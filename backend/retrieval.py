import json
import logging
import math
import os
import re
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime
from typing import Any, Dict, List, Optional, Set, Tuple

logger = logging.getLogger(__name__)


class LiteratureRetrievalError(Exception):
    """Base error for literature retrieval operations."""


class PubMedSearchError(LiteratureRetrievalError):
    """Raised when PubMed NCBI E-utilities fails or rejects query."""


class EuropePMCSearchError(LiteratureRetrievalError):
    """Raised when Europe PMC API fails."""


# In-Memory Search Cache with TTL (default 1 hour)
class SearchResultCache:
    def __init__(self, ttl_seconds: int = 3600):
        self._cache: Dict[str, Tuple[float, List[Dict[str, Any]]]] = {}
        self._ttl = ttl_seconds

    def _make_key(self, drug: str, disease: str, filters: Dict[str, Any]) -> str:
        serialized = json.dumps(filters, sort_keys=True)
        return f"{drug.strip().lower()}:::{disease.strip().lower()}:::{serialized}"

    def get(self, drug: str, disease: str, filters: Dict[str, Any]) -> Optional[List[Dict[str, Any]]]:
        key = self._make_key(drug, disease, filters)
        item = self._cache.get(key)
        if item:
            cached_time, results = item
            if time.time() - cached_time < self._ttl:
                return [dict(p) for p in results]
            del self._cache[key]
        return None

    def set(self, drug: str, disease: str, filters: Dict[str, Any], results: List[Dict[str, Any]]) -> None:
        key = self._make_key(drug, disease, filters)
        self._cache[key] = (time.time(), [dict(p) for p in results])


search_cache = SearchResultCache(ttl_seconds=3600)


def normalize_title(title: str) -> str:
    """Normalize paper title for deduplication."""
    return re.sub(r"[^a-zA-Z0-9]", "", title.lower())


# BM25 Keyword Ranker for hybrid scoring
class BM25Ranker:
    def __init__(self, corpus: List[str], k1: float = 1.5, b: float = 0.75):
        self.k1 = k1
        self.b = b
        self.corpus_size = len(corpus)
        self.tokenized_corpus = [self._tokenize(doc) for doc in corpus]
        self.doc_lens = [len(doc) for doc in self.tokenized_corpus]
        self.avgdl = sum(self.doc_lens) / self.corpus_size if self.corpus_size > 0 else 0
        self.df: Dict[str, int] = {}
        for doc in self.tokenized_corpus:
            unique_terms = set(doc)
            for term in unique_terms:
                self.df[term] = self.df.get(term, 0) + 1

    def _tokenize(self, text: str) -> List[str]:
        return re.findall(r"\b[a-zA-Z0-9_]{2,}\b", text.lower())

    def score(self, query: str, doc_idx: int) -> float:
        if self.corpus_size == 0 or doc_idx >= self.corpus_size:
            return 0.0
        doc = self.tokenized_corpus[doc_idx]
        doc_len = self.doc_lens[doc_idx]
        if doc_len == 0 or self.avgdl == 0:
            return 0.0

        q_tokens = self._tokenize(query)
        score = 0.0
        term_freqs: Dict[str, int] = {}
        for t in doc:
            term_freqs[t] = term_freqs.get(t, 0) + 1

        for term in q_tokens:
            if term not in term_freqs:
                continue
            df_val = self.df.get(term, 0)
            idf = math.log((self.corpus_size - df_val + 0.5) / (df_val + 0.5) + 1.0)
            tf = term_freqs[term]
            num = tf * (self.k1 + 1)
            denom = tf + self.k1 * (1 - self.b + self.b * (doc_len / self.avgdl))
            score += idf * (num / denom)
        return score


def search_pubmed_ncbi(
    drug: str,
    disease: str,
    top_k: int = 8,
    year_min: Optional[int] = None,
    year_max: Optional[int] = None,
    pub_types: Optional[List[str]] = None,
) -> List[Dict[str, Any]]:
    """Query NCBI E-utilities for PubMed literature."""
    drug_clean = drug.strip().replace('"', "")
    disease_clean = disease.strip().replace('"', "")
    term_parts = [f'"{drug_clean}"[Title/Abstract]', f'"{disease_clean}"[Title/Abstract]']

    if year_min and year_max:
        term_parts.append(f'("{year_min}"[Date - Publication] : "{year_max}"[Date - Publication])')
    elif year_min:
        term_parts.append(f'("{year_min}"[Date - Publication] : "3000"[Date - Publication])')
    elif year_max:
        term_parts.append(f'("1900"[Date - Publication] : "{year_max}"[Date - Publication])')

    if pub_types:
        type_clauses = [f'"{pt}"[Publication Type]' for pt in pub_types]
        term_parts.append(f"({' OR '.join(type_clauses)})")

    query = " AND ".join(term_parts)
    email = os.environ.get("PUBMED_EMAIL", "")
    api_key = os.environ.get("NCBI_API_KEY", "")

    common_params = {"tool": "neurorepurpose"}
    if email:
        common_params["email"] = email
    if api_key:
        common_params["api_key"] = api_key

    search_params = {
        **common_params,
        "db": "pubmed",
        "term": query,
        "retmode": "xml",
        "retmax": str(top_k),
        "sort": "relevance",
    }
    search_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?" + urllib.parse.urlencode(search_params)

    try:
        req = urllib.request.Request(search_url, headers={"User-Agent": "NeuroRepurpose/2.0"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            search_xml = resp.read()
        search_root = ET.fromstring(search_xml)
        if search_root.findtext(".//ERROR") or search_root.find(".//ErrorList") is not None:
            logger.warning("PubMed returned error in esearch: %s", search_xml[:200])
            return []

        pmids = [el.text for el in search_root.findall(".//IdList/Id") if el.text]
        if not pmids:
            return []

        fetch_params = {**common_params, "db": "pubmed", "id": ",".join(pmids), "retmode": "xml"}
        fetch_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?" + urllib.parse.urlencode(fetch_params)
        fetch_req = urllib.request.Request(fetch_url, headers={"User-Agent": "NeuroRepurpose/2.0"})
        with urllib.request.urlopen(fetch_req, timeout=20) as resp:
            fetch_xml = resp.read()
        fetch_root = ET.fromstring(fetch_xml)
    except Exception as exc:
        logger.warning("NCBI PubMed call failed: %s", exc)
        return []

    records: List[Dict[str, Any]] = []
    for article in fetch_root.findall(".//PubmedArticle"):
        pmid = article.findtext(".//MedlineCitation/PMID", default="")
        art = article.find(".//Article")
        if art is None:
            continue

        title_el = art.find("ArticleTitle")
        title = "".join(title_el.itertext()).strip() if title_el is not None else ""
        if not pmid or not title:
            continue

        abstract_parts = [" ".join(p.itertext()).strip() for p in art.findall(".//Abstract/AbstractText")]
        abstract = "\n".join(p for p in abstract_parts if p)

        # DOI
        doi = ""
        for aid in article.findall(".//PubmedData/ArticleIdList/ArticleId"):
            if aid.attrib.get("IdType") == "doi" and aid.text:
                doi = aid.text.strip()
                break

        # Authors
        author_names = []
        for author in art.findall(".//AuthorList/Author"):
            last = author.findtext("LastName", default="")
            fore = author.findtext("ForeName", default="")
            if last or fore:
                author_names.append(f"{fore} {last}".strip())
        authors_str = ", ".join(author_names[:4]) + (" et al." if len(author_names) > 4 else "")

        # Journal & Year
        journal = art.findtext(".//Journal/Title", default="")
        pub_year = None
        year_str = art.findtext(".//Journal/JournalIssue/PubDate/Year")
        if year_str and year_str.isdigit():
            pub_year = int(year_str)

        date_parts = [art.findtext(f".//Journal/JournalIssue/PubDate/{k}", default="") for k in ("Year", "Month", "Day")]
        publication_date = " ".join(p for p in date_parts if p)

        pub_type_el = art.find(".//PublicationTypeList/PublicationType")
        pub_type = pub_type_el.text.strip() if pub_type_el is not None and pub_type_el.text else "Journal Article"

        records.append({
            "pmid": pmid,
            "doi": doi,
            "title": title,
            "abstract": abstract,
            "authors": authors_str,
            "journal": journal,
            "publication_date": publication_date,
            "publication_year": pub_year,
            "publication_type": pub_type,
            "source": "PubMed",
            "link": f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/",
            "retrieval_score": 1.0,
        })
    return records


def search_europe_pmc(
    drug: str,
    disease: str,
    limit: int = 5,
    year_min: Optional[int] = None,
    year_max: Optional[int] = None,
) -> List[Dict[str, Any]]:
    """Query Europe PMC REST API."""
    drug_clean = drug.strip().replace('"', "")
    disease_clean = disease.strip().replace('"', "")
    query_parts = [f'"{drug_clean}"', f'"{disease_clean}"']
    if year_min and year_max:
        query_parts.append(f"PUB_YEAR:[{year_min} TO {year_max}]")
    elif year_min:
        query_parts.append(f"PUB_YEAR:[{year_min} TO 3000]")

    query = " AND ".join(query_parts)
    params = {
        "query": query,
        "format": "json",
        "pageSize": str(limit),
        "resultType": "core",
    }
    url = "https://www.ebi.ac.uk/europepmc/webservices/rest/search?" + urllib.parse.urlencode(params)

    try:
        req = urllib.request.Request(url, headers={"User-Agent": "NeuroRepurpose/2.0"})
        with urllib.request.urlopen(req, timeout=12) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except Exception as exc:
        logger.warning("Europe PMC search call failed: %s", exc)
        return []

    result_list = data.get("resultList", {}).get("result", [])
    records: List[Dict[str, Any]] = []
    for item in result_list:
        title = item.get("title", "").strip().rstrip(".")
        abstract = item.get("abstractText", "") or ""
        pmid = item.get("pmid", "")
        doi = item.get("doi", "")
        if not title:
            continue

        pub_year = None
        if item.get("pubYear") and str(item["pubYear"]).isdigit():
            pub_year = int(item["pubYear"])

        journal = item.get("journalTitle") or item.get("journalInfo", {}).get("journal", {}).get("title", "")
        author_string = item.get("authorString", "")

        link = f"https://europepmc.org/article/MED/{pmid}" if pmid else (f"https://doi.org/{doi}" if doi else "")

        records.append({
            "pmid": pmid,
            "doi": doi,
            "title": title,
            "abstract": abstract,
            "authors": author_string,
            "journal": journal,
            "publication_date": str(pub_year or ""),
            "publication_year": pub_year,
            "publication_type": item.get("pubType", "Journal Article"),
            "source": "Europe PMC",
            "link": link,
            "retrieval_score": 0.9,
        })
    return records


def reciprocal_rank_fusion(
    ranked_lists: List[List[Dict[str, Any]]],
    k: int = 60,
    top_n: int = 8,
) -> List[Dict[str, Any]]:
    """Combine multiple ranked lists using Reciprocal Rank Fusion (RRF)."""
    scores: Dict[str, float] = {}
    doc_map: Dict[str, Dict[str, Any]] = {}

    for rank_list in ranked_lists:
        for rank, doc in enumerate(rank_list, start=1):
            key = doc.get("pmid") or doc.get("doi") or normalize_title(doc["title"])
            if not key:
                continue
            if key not in doc_map:
                doc_map[key] = doc
            scores[key] = scores.get(key, 0.0) + (1.0 / (k + rank))

    sorted_keys = sorted(scores.keys(), key=lambda x: scores[x], reverse=True)
    merged: List[Dict[str, Any]] = []
    for key in sorted_keys[:top_n]:
        record = dict(doc_map[key])
        record["retrieval_score"] = round(scores[key], 4)
        merged.append(record)
    return merged


def hybrid_search_literature(
    drug: str,
    disease: str,
    top_k: int = 7,
    year_min: Optional[int] = None,
    year_max: Optional[int] = None,
    pub_types: Optional[List[str]] = None,
    include_europe_pmc: bool = True,
) -> List[Dict[str, Any]]:
    """Hybrid literature search combining PubMed, Europe PMC, and BM25 RRF."""
    filters = {
        "top_k": top_k,
        "year_min": year_min,
        "year_max": year_max,
        "pub_types": pub_types,
        "include_europe_pmc": include_europe_pmc,
    }
    cached = search_cache.get(drug, disease, filters)
    if cached is not None:
        logger.info("Serving literature search from cache for %s + %s", drug, disease)
        return cached

    # 1. Fetch from PubMed
    pubmed_results = search_pubmed_ncbi(
        drug=drug,
        disease=disease,
        top_k=top_k * 2,
        year_min=year_min,
        year_max=year_max,
        pub_types=pub_types,
    )

    # 2. Fetch from Europe PMC (if enabled)
    europe_results = []
    if include_europe_pmc:
        europe_results = search_europe_pmc(
            drug=drug,
            disease=disease,
            limit=top_k,
            year_min=year_min,
            year_max=year_max,
        )

    # 3. Deduplicate across sources
    seen_titles: Set[str] = set()
    seen_pmids: Set[str] = set()
    unique_candidates: List[Dict[str, Any]] = []

    for r in pubmed_results + europe_results:
        t_norm = normalize_title(r["title"])
        pmid = r.get("pmid")
        if pmid and pmid in seen_pmids:
            continue
        if t_norm and t_norm in seen_titles:
            continue
        if pmid:
            seen_pmids.add(pmid)
        if t_norm:
            seen_titles.add(t_norm)
        unique_candidates.append(r)

    if not unique_candidates:
        return []

    # 4. In-Memory BM25 scoring over title + abstract
    bm25_corpus = [f"{p['title']} {p.get('abstract', '')}" for p in unique_candidates]
    bm25 = BM25Ranker(bm25_corpus)
    query_text = f"{drug} {disease} target pathway mechanism"

    bm25_ranked = sorted(
        unique_candidates,
        key=lambda doc: bm25.score(query_text, unique_candidates.index(doc)),
        reverse=True,
    )

    # 5. Merge rankings using Reciprocal Rank Fusion
    ranked_lists = [unique_candidates, bm25_ranked]
    final_results = reciprocal_rank_fusion(ranked_lists, k=60, top_n=top_k)

    search_cache.set(drug, disease, filters, final_results)
    return final_results
