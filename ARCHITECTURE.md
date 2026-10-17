# NeuroRepurpose AI — System Architecture

## Request flow

```text
React / Vite
    │ JSON query or multipart PDF
    ▼
FastAPI
    │
    ▼
LangGraph: Master → Search / Extraction → Summarizer → Report
                 │                   │
                 │                   └─ Configured AI service
                 ├─ NCBI PubMed E-utilities
                 └─ pypdf (first eight PDF pages)
    │
    ▼
Source-linked HTML evidence report + source records
```

## Endpoints

- `POST /run` accepts a compound and indication, searches PubMed for records mentioning both terms in their title or abstract, and runs the workflow.
- `POST /run-pdf` accepts a PDF and optional research terms. It extracts text from up to the first eight pages, searches PubMed for related records, and analyzes the extracted text alongside those records.

The PDF upload limit is 15 MB. The service rejects unreadable, encrypted, or text-empty PDFs; scanned/image-only documents are not OCR-processed. When research terms are omitted, the configured AI service attempts to identify both from the extracted paper text. If identification is incomplete, the request asks for the missing terms rather than substituting the filename.

## Agent responsibilities

1. **Master Agent** initializes the compound–indication workflow.
2. **Search / Extraction Agent** retrieves PubMed records or retains the uploaded document and its related PubMed results.
3. **Summarizer Agent** summarizes each abstract or extracted document text separately, preserving source titles and links. Synthesis is restricted to supplied text; service and malformed-response errors stop the request rather than producing fallback summaries.
4. **Report Agent** assembles an HTML report from the source metadata and summaries. It does not produce clinical scores or treatment recommendations.

PubMed records contain a PMID and a link to their original PubMed entry. PDF text is labeled as an uploaded document. Missing abstracts are marked as unavailable and are not summarized.

## Configuration and limitations

- Set `GEMINI_API_KEY` in the backend environment for AI synthesis and optional PDF term detection.
- PubMed retrieval uses NCBI E-utilities and requires network access. `NCBI_API_KEY` and `PUBMED_EMAIL` are optional environment variables.
- PubMed title/abstract search is focused, not systematic, and may miss relevant literature.
- AI-generated summaries can be incomplete or incorrect. Verify statements against the original publications.
- Do not upload confidential or identifiable documents. This project does not claim HIPAA compliance and does not provide medical, safety, efficacy, or regulatory advice.
