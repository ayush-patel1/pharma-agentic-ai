import io
import json
import unittest
from types import SimpleNamespace
from unittest.mock import patch
from urllib.parse import parse_qs, urlparse

from backend.tools import (
    EvidenceSynthesisError,
    generate_monograph,
    search_pubmed_papers,
    summarize_papers_batch,
)


class PubMedSearchTests(unittest.TestCase):
    def test_search_returns_real_record_metadata_and_pmid_link(self):
        search_response = b"<eSearchResult><IdList><Id>123456</Id></IdList></eSearchResult>"
        fetch_response = b"""<PubmedArticleSet><PubmedArticle><MedlineCitation>
        <PMID>123456</PMID><Article><ArticleTitle>Compound and indication study</ArticleTitle>
        <Abstract><AbstractText Label="RESULTS">Observed result.</AbstractText></Abstract>
        <Journal><Title>Research Journal</Title><JournalIssue><PubDate><Year>2024</Year></PubDate></JournalIssue></Journal>
        </Article></MedlineCitation></PubmedArticle></PubmedArticleSet>"""
        with patch(
            "backend.tools.urllib.request.urlopen",
            side_effect=[io.BytesIO(search_response), io.BytesIO(fetch_response)],
        ) as open_url:
            papers = search_pubmed_papers("Compound X", "Condition Y", top_k=1)

        self.assertEqual(len(papers), 1)
        self.assertEqual(papers[0]["pmid"], "123456")
        self.assertEqual(papers[0]["link"], "https://pubmed.ncbi.nlm.nih.gov/123456/")
        self.assertEqual(papers[0]["abstract"], "Observed result.")
        query = parse_qs(urlparse(open_url.call_args_list[0].args[0].full_url).query)["term"][0]
        self.assertIn('"Compound X"[Title/Abstract]', query)
        self.assertIn('"Condition Y"[Title/Abstract]', query)

    def test_no_search_matches_returns_empty_results_without_fetch(self):
        with patch(
            "backend.tools.urllib.request.urlopen",
            return_value=io.BytesIO(b"<eSearchResult><IdList /></eSearchResult>"),
        ) as open_url:
            self.assertEqual(search_pubmed_papers("Compound X", "Condition Y"), [])
        open_url.assert_called_once()


class EvidenceSynthesisTests(unittest.TestCase):
    def test_missing_abstract_is_not_sent_to_ai(self):
        paper = {"title": "No abstract record", "abstract": "", "source": "PubMed"}
        with patch("backend.tools._new_model") as new_model:
            summaries = summarize_papers_batch("Compound X", "Condition Y", [paper])
        new_model.assert_not_called()
        self.assertIn("No abstract text", summaries[0]["summary_raw"])

    def test_summary_remains_linked_to_exact_source(self):
        paper = {
            "title": "Compound and indication study",
            "abstract": "Source text with study findings.",
            "link": "https://pubmed.ncbi.nlm.nih.gov/123456/",
            "pmid": "123456",
        }
        response = SimpleNamespace(text=json.dumps([{
            "title": paper["title"],
            "summary": "- Finding stated in the source.",
        }]))
        with patch("backend.tools._new_model") as new_model:
            new_model.return_value.generate_content.return_value = response
            summaries = summarize_papers_batch("Compound X", "Condition Y", [paper])
        self.assertEqual(summaries[0]["pmid"], "123456")
        self.assertEqual(summaries[0]["link"], paper["link"])
        self.assertEqual(summaries[0]["summary_raw"], "- Finding stated in the source.")

    def test_invalid_ai_output_fails_instead_of_returning_placeholder_summary(self):
        paper = {"title": "Study", "abstract": "Source text"}
        with patch("backend.tools._new_model") as new_model:
            new_model.return_value.generate_content.return_value = SimpleNamespace(text="not JSON")
            with self.assertRaises(EvidenceSynthesisError):
                summarize_papers_batch("Compound X", "Condition Y", [paper])

    def test_report_escapes_source_and_summary_text(self):
        papers = [{
            "title": "<script>bad title</script>",
            "abstract": "Source abstract",
            "link": "https://pubmed.ncbi.nlm.nih.gov/123456/",
            "pmid": "123456",
            "source": "PubMed",
        }]
        summaries = [{
            "title": papers[0]["title"],
            "summary_raw": "<img src=x onerror=alert(1)>",
        }]
        report = generate_monograph("Compound X", "Condition Y", papers, summaries)
        self.assertNotIn("<script>", report)
        self.assertNotIn("<img", report)
        self.assertIn("&lt;script&gt;", report)
        self.assertIn("https://pubmed.ncbi.nlm.nih.gov/123456/", report)


if __name__ == "__main__":
    unittest.main()
