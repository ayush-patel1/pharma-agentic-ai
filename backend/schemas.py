from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class LiteratureRecord(BaseModel):
    id: Optional[str] = None
    pmid: Optional[str] = None
    doi: Optional[str] = None
    title: str
    abstract: str = ""
    authors: Optional[str] = None
    journal: Optional[str] = None
    publication_date: Optional[str] = None
    publication_year: Optional[int] = None
    publication_type: Optional[str] = None
    source: str = "PubMed"
    link: Optional[str] = None
    retrieval_score: float = 1.0


class ExtractedClaim(BaseModel):
    claim_id: str
    claim_text: str
    source_id: str
    source_title: str
    passage: str
    section: str = "Abstract"
    relationship: str = "supports"  # supports, contradicts, contextualizes
    verification_status: str = "verified"  # verified, partially_verified, unsupported
    confidence: float = 0.9
    notes: Optional[str] = None


class ResearchGap(BaseModel):
    gap_id: str
    title: str
    description: str
    biological_relevance: str = ""
    follow_up_query: str = ""


class ComparisonMatrixRow(BaseModel):
    compound: str
    target: str
    model: str  # in vitro, animal in vivo, clinical human
    sample_size: str = "N/A"
    finding: str
    relationship: str = "concordant"  # concordant, discordant
    source_pmid: Optional[str] = None


class EvidenceSynthesis(BaseModel):
    drug: str
    disease: str
    claims: List[ExtractedClaim] = []
    gaps: List[ResearchGap] = []
    comparison_matrix: List[ComparisonMatrixRow] = []
    concordant_findings: List[str] = []
    discordant_findings: List[str] = []
    study_limitations: List[str] = []
    synergy_score: int = 85
    safety_score: int = 90
    evidence_tier: str = "Tier II"
    time_accelerated_years: float = 4.5


class RunTraceEvent(BaseModel):
    agent: str
    action: str
    timestamp: str
    status: str = "completed"
    details: Optional[str] = None


# Core API Query models
class QueryInput(BaseModel):
    drug: str
    disease: str
    publication_year_min: Optional[int] = None
    publication_year_max: Optional[int] = None
    publication_types: Optional[List[str]] = None
    include_europe_pmc: bool = True
    project_id: Optional[str] = "default"


class QueryOutput(BaseModel):
    run_id: str
    drug: str
    disease: str
    papers: List[Dict[str, Any]]
    summaries: List[Dict[str, Any]]
    final_report: str
    claims: List[ExtractedClaim] = []
    gaps: List[ResearchGap] = []
    comparison_matrix: List[ComparisonMatrixRow] = []
    concordant_findings: List[str] = []
    discordant_findings: List[str] = []
    study_limitations: List[str] = []
    synergy_score: int = 88
    safety_score: int = 94
    evidence_tier: str = "Tier II"
    time_accelerated_years: float = 4.5
    literature_source: str = "PubMed + Europe PMC Hybrid"
    uploaded_document: Optional[str] = None
    execution_trace: List[RunTraceEvent] = []


# Chat models
class ChatCitationCard(BaseModel):
    ref_id: str
    source_id: str
    title: str
    passage: str
    link: Optional[str] = None


class ChatSessionCreate(BaseModel):
    project_id: Optional[str] = "default"
    run_id: Optional[str] = None
    title: Optional[str] = "Research Chat Session"


class ChatSessionResponse(BaseModel):
    id: str
    project_id: Optional[str]
    run_id: Optional[str]
    title: str
    created_at: datetime
    message_count: int = 0


class ChatMessageCreate(BaseModel):
    content: str
    run_id: Optional[str] = None


class ChatMessageResponse(BaseModel):
    id: str
    session_id: str
    role: str
    content: str
    citations: List[ChatCitationCard] = []
    created_at: datetime


# Project models
class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = ""


class ProjectResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    created_at: datetime
    runs_count: int = 0
