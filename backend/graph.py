from langgraph.graph import StateGraph, END
from backend.models import GraphState
from backend.tools import search_mock_papers, summarize_paper
import google.generativeai as genai
import os

# Configure Gemini API
API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyDVVajOq75YzUh7QcNEXMPoWVEwqKOnOxE")
genai.configure(api_key=API_KEY)


def master_agent(state: GraphState) -> GraphState:
    """
    Master agent that plans the workflow tasks.
    
    Args:
        state: Current graph state
    
    Returns:
        Updated state with tasks list
    """
    query = state.get("query") or f"{state['drug']} for {state['disease']}"
    tasks = ["search_papers", "summarize_papers", "generate_report"]
    state["tasks"] = tasks
    print(f"[MASTER AGENT] Planning tasks for query: {query}")
    print(f"[MASTER AGENT] Tasks: {tasks}")
    return state


def search_agent(state: GraphState) -> GraphState:
    """
    Search agent that retrieves relevant papers from the mock dataset.
    
    Args:
        state: Current graph state
    
    Returns:
        Updated state with papers list
    """
    drug = state["drug"]
    disease = state["disease"]
    print(f"[SEARCH AGENT] Searching for papers: {drug} + {disease}")
    papers = search_mock_papers(drug, disease, top_k=5)
    state["papers"] = papers
    print(f"[SEARCH AGENT] Found {len(papers)} papers")
    return state


def summarizer_agent(state: GraphState) -> GraphState:
    """
    Summarizer agent that uses LLM to summarize each paper.
    
    Args:
        state: Current graph state
    
    Returns:
        Updated state with summaries list
    """
    drug = state["drug"]
    disease = state["disease"]
    summaries = []
    print(f"[SUMMARIZER AGENT] Summarizing {len(state.get('papers', []))} papers")
    
    for i, p in enumerate(state.get("papers", []), 1):
        print(f"[SUMMARIZER AGENT] Processing paper {i}/{len(state.get('papers', []))}: {p['title'][:50]}...")
        summary = summarize_paper(drug, disease, p)
        summaries.append(summary)
    
    state["summaries"] = summaries
    print(f"[SUMMARIZER AGENT] Completed {len(summaries)} summaries")
    return state


def report_agent(state: GraphState) -> GraphState:
    """
    Report agent that aggregates summaries into a final structured report.
    
    Args:
        state: Current graph state
    
    Returns:
        Updated state with final_report
    """
    print(f"[REPORT AGENT] Generating final report")
    
    # Get current date
    from datetime import datetime
    current_date = datetime.now().strftime("%B %d, %Y")
    
    bullet_points = "\n\n".join(
        f"Paper {i+1}: {s['title']}\n{s['summary_raw']}" for i, s in enumerate(state.get("summaries", []))
    )
    
    prompt = f"""
You are a senior pharmaceutical research scientist preparing a comprehensive drug repurposing assessment report for executive leadership.

Generate a detailed, professional report analyzing the potential of repurposing {state['drug']} for {state['disease']}.

Based on the following {len(state.get('summaries', []))} research paper summaries:

{bullet_points}

Create a well-structured HTML report with the following sections:

1. **EXECUTIVE SUMMARY** (3-4 paragraphs)
   - Clear overview of the repurposing opportunity
   - Key findings from the research
   - Overall assessment and recommendation
   - Strategic implications

2. **BACKGROUND & RATIONALE** (2-3 paragraphs)
   - Current therapeutic landscape for {state['disease']}
   - Why {state['drug']} is a promising candidate
   - Mechanism of action relevance

3. **EVIDENCE ANALYSIS** (detailed section)
   - Organize findings by evidence type (preclinical, clinical, epidemiological)
   - For each paper, provide:
     * Study design and population
     * Key findings with specific data points
     * Statistical significance where mentioned
     * Limitations

4. **EFFICACY & SAFETY PROFILE**
   - Expected therapeutic benefits
   - Known safety profile of {state['drug']}
   - Potential adverse events specific to {state['disease']} population
   - Drug interactions and contraindications

5. **CLINICAL & COMMERCIAL CONSIDERATIONS**
   - Target patient population
   - Competitive landscape
   - Market opportunity assessment
   - Regulatory pathway considerations

6. **RISK ASSESSMENT**
   - Scientific risks
   - Clinical development risks
   - Commercial risks
   - Mitigation strategies

7. **RECOMMENDATIONS & NEXT STEPS**
   - Clear go/no-go recommendation with justification
   - Proposed clinical trial design
   - Timeline and resource estimates
   - Key success criteria

Format the report using proper HTML tags:
- Use <h2> for main section headings
- Use <h3> for subsections
- Use <p> for paragraphs
- Use <ul> and <li> for bullet points
- Use <strong> for emphasis on key findings
- Use <div class="highlight"> for critical information
- Use <table> for any comparative data if applicable

Make the report detailed (aim for 2000+ words), data-driven, and suitable for executive decision-making.
Include specific numbers, percentages, and quantitative findings from the summaries.
Maintain a professional, objective tone while being persuasive about the opportunity.

Start with: <div class="report-header"><h1>Drug Repurposing Assessment Report</h1><h2>{state['drug']} for {state['disease']}</h2><p class="report-date">Report Date: {current_date}</p></div>
"""

    model = genai.GenerativeModel('gemini-2.5-flash')
    response = model.generate_content(prompt)
    
    state["final_report"] = response.text
    print(f"[REPORT AGENT] Final report generated ({len(state['final_report'])} chars)")
    return state


# Create the graph
graph = StateGraph(GraphState)

# Add nodes
graph.add_node("master", master_agent)
graph.add_node("search", search_agent)
graph.add_node("summarize", summarizer_agent)
graph.add_node("report", report_agent)

# Set entry point
graph.set_entry_point("master")

# Define edges: master -> search -> summarize -> report -> END
graph.add_edge("master", "search")
graph.add_edge("search", "summarize")
graph.add_edge("summarize", "report")
graph.add_edge("report", END)

# Compile the graph
app = graph.compile()
