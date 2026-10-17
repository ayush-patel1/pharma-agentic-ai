import logging

import pypdf
from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from backend.graph import app as graph_app
from backend.models import QueryInput
from backend.tools import (
    AIConfigurationError,
    EvidenceSynthesisError,
    PubMedSearchError,
    extract_research_entities,
    search_pubmed_papers,
)


logger = logging.getLogger(__name__)
MAX_PDF_BYTES = 15 * 1024 * 1024
MAX_EXTRACTED_CHARS = 24000

app = FastAPI(
    title="Pharma Agentic LangGraph API",
    description="Multi-agent system for drug repurposing literature analysis",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://0.0.0.0:3000",
        "http://127.0.0.1:3000",
        "https://pharma-agentic-ai-zsgc.onrender.com",
    ],
    allow_origin_regex=r"https://.*\.netlify\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _run_workflow(drug: str, disease: str, papers=None):
    try:
        return graph_app.invoke({
            "drug": drug,
            "disease": disease,
            "query": f"{drug} for {disease}",
            **({"papers": papers} if papers is not None else {}),
        })
    except PubMedSearchError as exc:
        logger.warning("PubMed search failed: %s", exc)
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except AIConfigurationError as exc:
        logger.error("AI service is not configured")
        raise HTTPException(status_code=503, detail="The AI service is not configured. Set GEMINI_API_KEY and retry.") from exc
    except EvidenceSynthesisError as exc:
        logger.exception("Evidence synthesis failed")
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@app.get("/")
def root():
    return {
        "message": "Pharma Agentic LangGraph API",
        "endpoints": {
            "POST /run": "Search PubMed and run drug repurposing evidence analysis",
            "POST /run-pdf": "Upload a PDF, extract its text, and retrieve related PubMed records",
            "GET /docs": "Interactive API documentation",
        },
    }


@app.post("/run")
def run_query(q: QueryInput):
    drug = q.drug.strip()
    disease = q.disease.strip()
    if not drug or not disease:
        raise HTTPException(status_code=422, detail="Enter both a compound and an indication.")

    final_state = _run_workflow(drug, disease)
    return {
        "drug": final_state["drug"],
        "disease": final_state["disease"],
        "papers": final_state.get("papers", []),
        "summaries": final_state.get("summaries", []),
        "final_report": final_state.get("final_report", ""),
        "literature_source": "PubMed",
    }


@app.post("/run-pdf")
def run_pdf(
    file: UploadFile = File(...),
    drug: str = Form(""),
    disease: str = Form(""),
):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=415, detail="Upload a file with a .pdf extension.")
    if file.size is not None and file.size > MAX_PDF_BYTES:
        raise HTTPException(status_code=413, detail="The PDF exceeds the 15 MB upload limit.")

    try:
        reader = pypdf.PdfReader(file.file)
        if reader.is_encrypted and not reader.decrypt(""):
            raise HTTPException(status_code=422, detail="This PDF is password-protected. Upload an unlocked PDF.")
        extracted_text = "\n".join(
            page.extract_text() or ""
            for page in reader.pages[:8]
        ).strip()
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Could not read uploaded PDF %s", file.filename)
        raise HTTPException(status_code=422, detail="The uploaded file could not be read as a valid PDF.") from exc

    if len(extracted_text) < 80:
        raise HTTPException(
            status_code=422,
            detail="No usable text was extracted from the first eight PDF pages. Scanned/image-only PDFs are not supported; try a text-based PDF or enter the research terms manually.",
        )

    detected_drug = drug.strip()
    detected_disease = disease.strip()
    if not detected_drug or not detected_disease:
        try:
            detected = extract_research_entities(extracted_text)
        except AIConfigurationError as exc:
            raise HTTPException(status_code=503, detail="Auto-detection requires the AI service. Enter both research terms or configure GEMINI_API_KEY.") from exc
        except EvidenceSynthesisError as exc:
            logger.exception("Could not identify the research question from PDF text")
            raise HTTPException(status_code=502, detail=str(exc)) from exc
        detected_drug = detected_drug or detected["drug"]
        detected_disease = detected_disease or detected["disease"]
        if not detected_drug or not detected_disease:
            raise HTTPException(
                status_code=422,
                detail="The PDF did not clearly identify both a compound and an indication. Enter the missing research terms and retry.",
            )

    try:
        pubmed_papers = search_pubmed_papers(detected_drug, detected_disease, top_k=5)
    except PubMedSearchError as exc:
        logger.warning("PubMed search failed for uploaded PDF: %s", exc)
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    document_title = file.filename[:-4].replace("_", " ").replace("-", " ").strip() or "Uploaded research PDF"
    sources = [{
        "title": document_title,
        "abstract": extracted_text[:MAX_EXTRACTED_CHARS],
        "link": "",
        "source": "uploaded_pdf",
    }, *pubmed_papers]

    final_state = _run_workflow(detected_drug, detected_disease, papers=sources)
    return {
        "drug": final_state["drug"],
        "disease": final_state["disease"],
        "papers": final_state.get("papers", []),
        "summaries": final_state.get("summaries", []),
        "final_report": final_state.get("final_report", ""),
        "literature_source": "PubMed",
        "uploaded_document": document_title,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
