from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.models import QueryInput
from backend.graph import app as graph_app

app = FastAPI(
    title="Pharma Agentic LangGraph API",
    description="Multi-agent system for drug repurposing literature analysis",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:5173", 
        "http://0.0.0.0:3000", 
        "http://127.0.0.1:3000",
        "https://*.netlify.app",
        "https://pharma-agentic-ai-zsgc.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    """Root endpoint with API information."""
    return {
        "message": "Pharma Agentic LangGraph API",
        "endpoints": {
            "POST /run": "Run drug repurposing analysis",
            "GET /docs": "Interactive API documentation"
        }
    }


@app.post("/run")
def run_query(q: QueryInput):
    """
    Run the multi-agent LangGraph workflow for drug repurposing analysis.
    
    Args:
        q: QueryInput with drug and disease names
    
    Returns:
        Dictionary with papers, summaries, and final report
    """
    print(f"\n{'='*60}")
    print(f"NEW REQUEST: {q.drug} for {q.disease}")
    print(f"{'='*60}\n")
    
    initial_state = {
        "drug": q.drug,
        "disease": q.disease,
        "query": f"{q.drug} for {q.disease}",
    }
    
    # Run the LangGraph workflow
    final_state = graph_app.invoke(initial_state)
    
    print(f"\n{'='*60}")
    print(f"REQUEST COMPLETED")
    print(f"{'='*60}\n")
    
    return {
        "drug": final_state["drug"],
        "disease": final_state["disease"],
        "papers": final_state.get("papers", []),
        "summaries": final_state.get("summaries", []),
        "final_report": final_state.get("final_report", ""),
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
