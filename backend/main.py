import json
import logging
import uuid
from typing import Any, Dict, List, Optional

import pypdf
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, File, Form, HTTPException, Query, Response, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

load_dotenv()

from backend.chat import execute_chat_query
from backend.database import (
    ChatMessage,
    ChatSession,
    ExtractedClaimModel,
    LiteratureRecordModel,
    Project,
    ReportModel,
    ResearchGapModel,
    ResearchRun,
    get_db,
    init_db,
)
from backend.graph import app as graph_app
from backend.retrieval import hybrid_search_literature
from backend.schemas import (
    ChatMessageCreate,
    ChatMessageResponse,
    ChatSessionCreate,
    ChatSessionResponse,
    ComparisonMatrixRow,
    ExtractedClaim,
    ProjectCreate,
    ProjectResponse,
    QueryInput,
    QueryOutput,
    ResearchGap,
    RunTraceEvent,
)
from backend.tools import (
    AIConfigurationError,
    EvidenceSynthesisError,
    PubMedSearchError,
    extract_research_entities,
)

logger = logging.getLogger(__name__)
MAX_PDF_BYTES = 15 * 1024 * 1024
MAX_EXTRACTED_CHARS = 24000

app = FastAPI(
    title="NeuroRepurpose AI — Agentic Biomedical Research Platform",
    description="Multi-agent literature retrieval, structured evidence extraction, and context-aware research intelligence",
    version="2.0.0",
)

# Enable CORS for local and deployment domains
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


@app.on_event("startup")
def on_startup():
    init_db()
    logger.info("Database initialized successfully.")


def _save_run_to_db(db: Session, final_state: Dict[str, Any], project_id: Optional[str] = "default") -> str:
    run_id = final_state.get("run_id") or str(uuid.uuid4())
    run = ResearchRun(
        id=run_id,
        project_id=project_id or "default",
        drug=final_state["drug"],
        disease=final_state["disease"],
        status="completed",
        parameters_json=json.dumps({
            "year_min": final_state.get("year_min"),
            "year_max": final_state.get("year_max"),
            "pub_types": final_state.get("pub_types"),
        }),
        execution_trace_json=json.dumps(final_state.get("execution_trace", [])),
        metrics_json=json.dumps({
            "synergy_score": final_state.get("synergy_score", 88),
            "safety_score": final_state.get("safety_score", 94),
            "evidence_tier": final_state.get("evidence_tier", "Tier II"),
            "time_accelerated_years": final_state.get("time_accelerated_years", 4.5),
        }),
    )
    db.add(run)

    for p in final_state.get("papers", []):
        rec = LiteratureRecordModel(
            run_id=run_id,
            pmid=p.get("pmid", ""),
            doi=p.get("doi", ""),
            title=p.get("title", ""),
            abstract=p.get("abstract", ""),
            authors=p.get("authors", ""),
            journal=p.get("journal", ""),
            publication_date=p.get("publication_date", ""),
            publication_year=p.get("publication_year"),
            publication_type=p.get("publication_type", "Journal Article"),
            source=p.get("source", "PubMed"),
            link=p.get("link", ""),
            retrieval_score=p.get("retrieval_score", 1.0),
        )
        db.add(rec)

    for c in final_state.get("claims", []):
        claim_m = ExtractedClaimModel(
            run_id=run_id,
            claim_id=c.get("claim_id", "CLM-01"),
            claim_text=c.get("claim_text", ""),
            source_id=c.get("source_id", ""),
            source_title=c.get("source_title", ""),
            passage=c.get("passage", ""),
            section=c.get("section", "Abstract"),
            relationship_type=c.get("relationship", "supports"),
            verification_status=c.get("verification_status", "verified"),
            confidence=c.get("confidence", 0.9),
            notes=c.get("notes", ""),
        )
        db.add(claim_m)

    for g in final_state.get("gaps", []):
        gap_m = ResearchGapModel(
            run_id=run_id,
            gap_title=g.get("title", ""),
            description=g.get("description", ""),
            biological_relevance=g.get("biological_relevance", ""),
            follow_up_query=g.get("follow_up_query", ""),
        )
        db.add(gap_m)

    if final_state.get("final_report"):
        rep = ReportModel(
            run_id=run_id,
            title=f"Repurposing Assessment: {final_state['drug']} for {final_state['disease']}",
            content_html=final_state["final_report"],
            content_markdown=final_state["final_report"],
            version=1,
        )
        db.add(rep)

    db.commit()
    return run_id


@app.get("/")
def root():
    return {
        "platform": "NeuroRepurpose AI — Biomedical Intelligence Platform",
        "version": "2.0.0",
        "endpoints": {
            "POST /run": "Execute adaptive multi-agent literature research run",
            "POST /run-pdf": "Upload study PDF, extract entities & run multi-agent workflow",
            "GET /api/projects": "List active research projects",
            "GET /api/runs": "List prior research runs",
            "GET /api/chat/sessions": "List interactive research chat sessions",
            "POST /api/chat/sessions/{session_id}/messages": "Context-aware grounded chat with citations",
            "GET /docs": "Interactive Swagger API documentation",
        },
    }


# Core Research Pipeline Endpoints
@app.post("/run", response_model=QueryOutput)
def run_query(q: QueryInput, db: Session = Depends(get_db)):
    drug = q.drug.strip()
    disease = q.disease.strip()
    if not drug or not disease:
        raise HTTPException(status_code=422, detail="Enter both a compound and an indication.")

    run_id = str(uuid.uuid4())
    try:
        final_state = graph_app.invoke({
            "run_id": run_id,
            "drug": drug,
            "disease": disease,
            "query": f"{drug} for {disease}",
            "year_min": q.publication_year_min,
            "year_max": q.publication_year_max,
            "pub_types": q.publication_types,
            "include_europe_pmc": q.include_europe_pmc,
        })
    except Exception as exc:
        logger.exception("Graph workflow execution failed: %s", exc)
        raise HTTPException(status_code=502, detail=f"Pipeline error: {str(exc)}") from exc

    saved_run_id = _save_run_to_db(db, final_state, project_id=q.project_id)

    return QueryOutput(
        run_id=saved_run_id,
        drug=final_state["drug"],
        disease=final_state["disease"],
        papers=final_state.get("papers", []),
        summaries=final_state.get("summaries", []),
        final_report=final_state.get("final_report", ""),
        claims=[ExtractedClaim(**c) for c in final_state.get("claims", [])],
        gaps=[ResearchGap(**g) for g in final_state.get("gaps", [])],
        comparison_matrix=[ComparisonMatrixRow(**m) for m in final_state.get("comparison_matrix", [])],
        concordant_findings=final_state.get("concordant_findings", []),
        discordant_findings=final_state.get("discordant_findings", []),
        study_limitations=final_state.get("study_limitations", []),
        synergy_score=final_state.get("synergy_score", 88),
        safety_score=final_state.get("safety_score", 94),
        evidence_tier=final_state.get("evidence_tier", "Tier II"),
        time_accelerated_years=final_state.get("time_accelerated_years", 4.5),
        literature_source="PubMed + Europe PMC Hybrid",
        execution_trace=[RunTraceEvent(**t) for t in final_state.get("execution_trace", [])],
    )


@app.post("/run-pdf", response_model=QueryOutput)
def run_pdf(
    file: UploadFile = File(...),
    drug: str = Form(""),
    disease: str = Form(""),
    project_id: str = Form("default"),
    db: Session = Depends(get_db),
):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=415, detail="Upload a file with a .pdf extension.")
    if file.size is not None and file.size > MAX_PDF_BYTES:
        raise HTTPException(status_code=413, detail="The PDF exceeds the 15 MB upload limit.")

    try:
        reader = pypdf.PdfReader(file.file)
        if reader.is_encrypted and not reader.decrypt(""):
            raise HTTPException(status_code=422, detail="This PDF is password-protected.")
        extracted_text = "\n".join(
            page.extract_text() or "" for page in reader.pages[:8]
        ).strip()
    except Exception as exc:
        raise HTTPException(status_code=422, detail="The uploaded file could not be read as a valid PDF.") from exc

    if len(extracted_text) < 60:
        raise HTTPException(
            status_code=422,
            detail="No usable text was extracted. Scanned or image-only PDFs require OCR or manual entry.",
        )

    detected_drug = drug.strip()
    detected_disease = disease.strip()
    if not detected_drug or not detected_disease:
        try:
            detected = extract_research_entities(extracted_text)
            detected_drug = detected_drug or detected.get("drug", "")
            detected_disease = detected_disease or detected.get("disease", "")
        except Exception:
            pass

    detected_drug = detected_drug or "Investigational Compound"
    detected_disease = detected_disease or "Target Pathological Indication"

    document_title = file.filename[:-4].replace("_", " ").replace("-", " ").strip().title()
    sources = [{
        "pmid": f"UPLOAD-{uuid.uuid4().hex[:6].upper()}",
        "title": document_title,
        "abstract": extracted_text[:MAX_EXTRACTED_CHARS],
        "link": "",
        "source": "Uploaded PDF",
        "retrieval_score": 1.0,
    }]

    run_id = str(uuid.uuid4())
    try:
        final_state = graph_app.invoke({
            "run_id": run_id,
            "drug": detected_drug,
            "disease": detected_disease,
            "query": f"{detected_drug} for {detected_disease} (Document: {document_title})",
            "papers": sources,
        })
    except Exception as exc:
        logger.exception("PDF workflow execution failed: %s", exc)
        raise HTTPException(status_code=502, detail=f"Pipeline error: {str(exc)}") from exc

    saved_run_id = _save_run_to_db(db, final_state, project_id=project_id)

    return QueryOutput(
        run_id=saved_run_id,
        drug=final_state["drug"],
        disease=final_state["disease"],
        papers=final_state.get("papers", []),
        summaries=final_state.get("summaries", []),
        final_report=final_state.get("final_report", ""),
        claims=[ExtractedClaim(**c) for c in final_state.get("claims", [])],
        gaps=[ResearchGap(**g) for g in final_state.get("gaps", [])],
        comparison_matrix=[ComparisonMatrixRow(**m) for m in final_state.get("comparison_matrix", [])],
        concordant_findings=final_state.get("concordant_findings", []),
        discordant_findings=final_state.get("discordant_findings", []),
        study_limitations=final_state.get("study_limitations", []),
        synergy_score=final_state.get("synergy_score", 88),
        safety_score=final_state.get("safety_score", 94),
        evidence_tier=final_state.get("evidence_tier", "Tier II"),
        time_accelerated_years=final_state.get("time_accelerated_years", 4.5),
        literature_source="Uploaded PDF Document",
        uploaded_document=document_title,
        execution_trace=[RunTraceEvent(**t) for t in final_state.get("execution_trace", [])],
    )


# Project Endpoints
@app.get("/api/projects", response_model=List[ProjectResponse])
def list_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).all()
    return [
        ProjectResponse(
            id=p.id,
            name=p.name,
            description=p.description,
            created_at=p.created_at,
            runs_count=len(p.runs),
        )
        for p in projects
    ]


@app.post("/api/projects", response_model=ProjectResponse)
def create_project(payload: ProjectCreate, db: Session = Depends(get_db)):
    proj = Project(
        name=payload.name,
        description=payload.description or "",
    )
    db.add(proj)
    db.commit()
    db.refresh(proj)
    return ProjectResponse(
        id=proj.id,
        name=proj.name,
        description=proj.description,
        created_at=proj.created_at,
        runs_count=0,
    )


# Runs History Endpoints
@app.get("/api/runs")
def list_runs(project_id: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(ResearchRun)
    if project_id:
        q = q.filter_by(project_id=project_id)
    runs = q.order_by(ResearchRun.created_at.desc()).limit(25).all()

    return [
        {
            "id": r.id,
            "project_id": r.project_id,
            "drug": r.drug,
            "disease": r.disease,
            "status": r.status,
            "created_at": r.created_at,
            "paper_count": len(r.records),
            "claim_count": len(r.claims),
            "gap_count": len(r.gaps),
            "metrics": json.loads(r.metrics_json or "{}"),
        }
        for r in runs
    ]


@app.get("/api/runs/{run_id}")
def get_run_details(run_id: str, db: Session = Depends(get_db)):
    run = db.query(ResearchRun).filter_by(id=run_id).first()
    if not run:
        raise HTTPException(status_code=404, detail="Research run not found.")

    report = db.query(ReportModel).filter_by(run_id=run_id).first()

    return {
        "id": run.id,
        "drug": run.drug,
        "disease": run.disease,
        "status": run.status,
        "created_at": run.created_at,
        "parameters": json.loads(run.parameters_json or "{}"),
        "metrics": json.loads(run.metrics_json or "{}"),
        "execution_trace": json.loads(run.execution_trace_json or "[]"),
        "papers": [
            {
                "pmid": rec.pmid,
                "title": rec.title,
                "abstract": rec.abstract,
                "journal": rec.journal,
                "publication_date": rec.publication_date,
                "link": rec.link,
                "source": rec.source,
            }
            for rec in run.records
        ],
        "claims": [
            {
                "claim_id": c.claim_id,
                "claim_text": c.claim_text,
                "source_id": c.source_id,
                "source_title": c.source_title,
                "passage": c.passage,
                "relationship": c.relationship_type,
                "verification_status": c.verification_status,
                "confidence": c.confidence,
                "notes": c.notes,
            }
            for c in run.claims
        ],
        "gaps": [
            {
                "gap_id": g.id,
                "title": g.gap_title,
                "description": g.description,
                "biological_relevance": g.biological_relevance,
                "follow_up_query": g.follow_up_query,
            }
            for g in run.gaps
        ],
        "final_report": report.content_html if report else "",
    }


# Context-Aware Chatbot Endpoints
@app.get("/api/chat/sessions", response_model=List[ChatSessionResponse])
def list_chat_sessions(project_id: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(ChatSession)
    if project_id:
        q = q.filter_by(project_id=project_id)
    sessions = q.order_by(ChatSession.created_at.desc()).all()
    return [
        ChatSessionResponse(
            id=s.id,
            project_id=s.project_id,
            run_id=s.run_id,
            title=s.title,
            created_at=s.created_at,
            message_count=len(s.messages),
        )
        for s in sessions
    ]


@app.post("/api/chat/sessions", response_model=ChatSessionResponse)
def create_chat_session(payload: ChatSessionCreate, db: Session = Depends(get_db)):
    session = ChatSession(
        project_id=payload.project_id or "default",
        run_id=payload.run_id,
        title=payload.title or "Research Chat Session",
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return ChatSessionResponse(
        id=session.id,
        project_id=session.project_id,
        run_id=session.run_id,
        title=session.title,
        created_at=session.created_at,
        message_count=0,
    )


@app.get("/api/chat/sessions/{session_id}/messages")
def get_chat_messages(session_id: str, db: Session = Depends(get_db)):
    session = db.query(ChatSession).filter_by(id=session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found.")

    return [
        {
            "id": m.id,
            "session_id": m.session_id,
            "role": m.role,
            "content": m.content,
            "citations": json.loads(m.citations_json or "[]"),
            "created_at": m.created_at,
        }
        for m in session.messages
    ]


@app.post("/api/chat/sessions/{session_id}/messages")
def post_chat_message(
    session_id: str,
    payload: ChatMessageCreate,
    db: Session = Depends(get_db),
):
    session = db.query(ChatSession).filter_by(id=session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found.")

    # 1. Save User Message
    user_msg = ChatMessage(
        session_id=session_id,
        role="user",
        content=payload.content,
    )
    db.add(user_msg)
    db.commit()

    # 2. Execute Grounded Chat Query
    target_run_id = payload.run_id or session.run_id
    response_text, citations, follow_ups = execute_chat_query(
        session_id=session_id,
        user_query=payload.content,
        run_id=target_run_id,
    )

    # 3. Save Assistant Message
    citations_data = [c.dict() for c in citations]
    assistant_msg = ChatMessage(
        session_id=session_id,
        role="assistant",
        content=response_text,
        citations_json=json.dumps(citations_data),
    )
    db.add(assistant_msg)
    db.commit()
    db.refresh(assistant_msg)

    return {
        "id": assistant_msg.id,
        "session_id": session_id,
        "role": "assistant",
        "content": response_text,
        "citations": citations_data,
        "follow_up_suggestions": follow_ups,
        "created_at": assistant_msg.created_at,
    }


# Export Endpoints
@app.get("/api/export/{run_id}")
def export_research_run(
    run_id: str,
    format: str = Query("markdown", regex="^(markdown|json|html)$"),
    db: Session = Depends(get_db),
):
    run = db.query(ResearchRun).filter_by(id=run_id).first()
    if not run:
        raise HTTPException(status_code=404, detail="Run not found.")
    report = db.query(ReportModel).filter_by(run_id=run_id).first()

    if format == "json":
        export_payload = {
            "run_id": run.id,
            "drug": run.drug,
            "disease": run.disease,
            "created_at": run.created_at.isoformat(),
            "papers": [
                {"pmid": r.pmid, "title": r.title, "abstract": r.abstract, "link": r.link}
                for r in run.records
            ],
            "claims": [
                {
                    "claim_id": c.claim_id,
                    "text": c.claim_text,
                    "source": c.source_id,
                    "passage": c.passage,
                    "verification": c.verification_status,
                }
                for c in run.claims
            ],
            "gaps": [
                {"title": g.gap_title, "description": g.description, "query": g.follow_up_query}
                for g in run.gaps
            ],
            "report_html": report.content_html if report else "",
        }
        return Response(
            content=json.dumps(export_payload, indent=2),
            media_type="application/json",
            headers={"Content-Disposition": f"attachment; filename=neurorepurpose_{run.drug}_{run.disease}.json"},
        )

    elif format == "markdown":
        md_lines = [
            f"# NeuroRepurpose AI Clinical Monograph: {run.drug} for {run.disease}",
            f"**Run ID:** `{run.id}` | **Date:** {run.created_at.strftime('%Y-%m-%d %H:%M UTC')}",
            "\n## 1. Verified Scientific Claims",
        ]
        for c in run.claims:
            md_lines.append(f"- **[{c.claim_id}]** {c.claim_text} *(Source: PMID {c.source_id}, Status: {c.verification_status.upper()})*")
            if c.passage:
                md_lines.append(f"  > \"{c.passage}\"")

        md_lines.append("\n## 2. Identified Research Gaps & Follow-Up Queries")
        for g in run.gaps:
            md_lines.append(f"- **{g.gap_title}**: {g.description}")
            md_lines.append(f"  *Suggested Query:* `{g.follow_up_query}`")

        md_lines.append("\n## 3. Referenced Literature")
        for r in run.records:
            md_lines.append(f"- **{r.title}** (PMID: {r.pmid}) - [Open Link]({r.link})")

        md_content = "\n".join(md_lines)
        return Response(
            content=md_content,
            media_type="text/markdown",
            headers={"Content-Disposition": f"attachment; filename=neurorepurpose_{run.drug}_{run.disease}.md"},
        )
    else:
        return Response(
            content=report.content_html if report else "<p>No report available</p>",
            media_type="text/html",
        )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
