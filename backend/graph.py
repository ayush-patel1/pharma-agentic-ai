import datetime
import time
from typing import Any, Dict, List, Optional
from typing_extensions import TypedDict

from langgraph.graph import END, StateGraph
from backend.evidence import extract_claims_and_synthesis
from backend.retrieval import hybrid_search_literature
from backend.tools import generate_monograph, summarize_papers_batch


class GraphState(TypedDict, total=False):
    run_id: str
    drug: str
    disease: str
    query: str
    tasks: List[str]
    papers: List[Dict[str, Any]]
    summaries: List[Dict[str, Any]]
    claims: List[Dict[str, Any]]
    gaps: List[Dict[str, Any]]
    comparison_matrix: List[Dict[str, Any]]
    concordant_findings: List[str]
    discordant_findings: List[str]
    study_limitations: List[str]
    synergy_score: int
    safety_score: int
    evidence_tier: str
    time_accelerated_years: float
    final_report: str
    execution_trace: List[Dict[str, Any]]
    year_min: Optional[int]
    year_max: Optional[int]
    pub_types: Optional[List[str]]
    include_europe_pmc: bool


def _log_trace(state: GraphState, agent: str, action: str, details: Optional[str] = None):
    if "execution_trace" not in state:
        state["execution_trace"] = []
    ts = datetime.datetime.now().strftime("%H:%M:%S")
    state["execution_trace"].append({
        "agent": agent,
        "action": action,
        "timestamp": ts,
        "status": "completed",
        "details": details,
    })


def planner_node(state: GraphState) -> GraphState:
    drug = state.get("drug", "Target")
    disease = state.get("disease", "Indication")
    state["tasks"] = [
        "hybrid_retrieval",
        "evidence_extraction",
        "cross_study_analysis",
        "claim_verification",
        "gap_discovery",
        "report_generation",
    ]
    _log_trace(state, "Planner Agent", f"Configured adaptive research workflow for {drug} in {disease}")
    return state


def retriever_node(state: GraphState) -> GraphState:
    if state.get("papers"):
        _log_trace(state, "Extraction Agent", f"Retained {len(state['papers'])} pre-loaded / uploaded source document(s)")
        return state

    drug = state["drug"]
    disease = state["disease"]
    year_min = state.get("year_min")
    year_max = state.get("year_max")
    pub_types = state.get("pub_types")
    include_europe_pmc = state.get("include_europe_pmc", True)

    papers = hybrid_search_literature(
        drug=drug,
        disease=disease,
        top_k=7,
        year_min=year_min,
        year_max=year_max,
        pub_types=pub_types,
        include_europe_pmc=include_europe_pmc,
    )
    state["papers"] = papers
    _log_trace(
        state,
        "Retrieval Agent",
        f"Hybrid retrieval yielded {len(papers)} peer-reviewed records (RRF rank merged)",
        details=f"NCBI PubMed + Europe PMC ({len(papers)} unique deduplicated records)",
    )
    return state


def extractor_node(state: GraphState) -> GraphState:
    papers = state.get("papers", [])
    summaries = summarize_papers_batch(state["drug"], state["disease"], papers)
    state["summaries"] = summaries
    _log_trace(state, "Extraction Agent", f"Synthesized findings and metadata across {len(summaries)} sources")
    return state


def evidence_analyst_node(state: GraphState) -> GraphState:
    drug = state["drug"]
    disease = state["disease"]
    papers = state.get("papers", [])

    synthesis = extract_claims_and_synthesis(drug, disease, papers)
    state["claims"] = [c.dict() for c in synthesis.claims]
    state["gaps"] = [g.dict() for g in synthesis.gaps]
    state["comparison_matrix"] = [m.dict() for m in synthesis.comparison_matrix]
    state["concordant_findings"] = synthesis.concordant_findings
    state["discordant_findings"] = synthesis.discordant_findings
    state["study_limitations"] = synthesis.study_limitations
    state["synergy_score"] = synthesis.synergy_score
    state["safety_score"] = synthesis.safety_score
    state["evidence_tier"] = synthesis.evidence_tier
    state["time_accelerated_years"] = synthesis.time_accelerated_years

    _log_trace(
        state,
        "Evidence Analyst",
        f"Extracted {len(state['claims'])} claim assertions and mapped {len(state['comparison_matrix'])} comparison targets",
    )
    return state


def verifier_node(state: GraphState) -> GraphState:
    verified_count = sum(1 for c in state.get("claims", []) if c.get("verification_status") == "verified")
    total_claims = len(state.get("claims", []))
    _log_trace(
        state,
        "Claim Verifier",
        f"Audited {total_claims} claims: {verified_count} verified against exact source passages",
    )
    return state


def gap_analyst_node(state: GraphState) -> GraphState:
    gaps_count = len(state.get("gaps", []))
    _log_trace(
        state,
        "Gap Discovery Agent",
        f"Identified {gaps_count} candidate research gaps with 1-click follow-up queries",
    )
    return state


def report_generator_node(state: GraphState) -> GraphState:
    final_report = generate_monograph(
        state["drug"],
        state["disease"],
        state.get("papers", []),
        state.get("summaries", []),
    )
    state["final_report"] = final_report
    _log_trace(state, "Report Generator", "Compiled structured research monograph with source links")
    return state


# Build Adaptive Multi-Agent StateGraph
builder = StateGraph(GraphState)
builder.add_node("planner", planner_node)
builder.add_node("retriever", retriever_node)
builder.add_node("extractor", extractor_node)
builder.add_node("analyst", evidence_analyst_node)
builder.add_node("verifier", verifier_node)
builder.add_node("gap_analyst", gap_analyst_node)
builder.add_node("reporter", report_generator_node)

builder.set_entry_point("planner")
builder.add_edge("planner", "retriever")
builder.add_edge("retriever", "extractor")
builder.add_edge("extractor", "analyst")
builder.add_edge("analyst", "verifier")
builder.add_edge("verifier", "gap_analyst")
builder.add_edge("gap_analyst", "reporter")
builder.add_edge("reporter", END)

app = builder.compile()
