from langgraph.graph import END, StateGraph

from backend.models import GraphState
from backend.tools import generate_monograph, search_pubmed_papers, summarize_papers_batch


def master_agent(state: GraphState) -> GraphState:
    query = state.get("query") or f"{state['drug']} for {state['disease']}"
    state["tasks"] = ["retrieve_sources", "synthesize_evidence", "compile_report"]
    print(f"[MASTER AGENT] Planning source-grounded workflow for: {query}")
    return state


def search_agent(state: GraphState) -> GraphState:
    if state.get("papers"):
        print(f"[EXTRACTION AGENT] Retaining {len(state['papers'])} uploaded and retrieved source(s)")
        return state

    drug = state["drug"]
    disease = state["disease"]
    print(f"[SEARCH AGENT] Searching PubMed for: {drug} + {disease}")
    papers = search_pubmed_papers(drug, disease, top_k=5)
    state["papers"] = papers
    print(f"[SEARCH AGENT] Found {len(papers)} PubMed record(s)")
    return state


def summarizer_agent(state: GraphState) -> GraphState:
    papers = state.get("papers", [])
    print(f"[SUMMARIZER AGENT] Analyzing source text for {len(papers)} record(s)")
    state["summaries"] = summarize_papers_batch(
        state["drug"],
        state["disease"],
        papers,
    )
    print(f"[SUMMARIZER AGENT] Completed {len(state['summaries'])} source-linked summary(s)")
    return state


def report_agent(state: GraphState) -> GraphState:
    print("[REPORT AGENT] Compiling source-linked evidence monograph")
    state["final_report"] = generate_monograph(
        state["drug"],
        state["disease"],
        state.get("papers", []),
        state.get("summaries", []),
    )
    return state


graph = StateGraph(GraphState)
graph.add_node("master", master_agent)
graph.add_node("search", search_agent)
graph.add_node("summarize", summarizer_agent)
graph.add_node("report", report_agent)
graph.set_entry_point("master")
graph.add_edge("master", "search")
graph.add_edge("search", "summarize")
graph.add_edge("summarize", "report")
graph.add_edge("report", END)

app = graph.compile()
