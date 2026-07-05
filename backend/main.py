import json
import os
from dotenv import load_dotenv

# Load environment variables from .env file at startup
load_dotenv()

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import pypdf
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
        "https://pharma-agentic-ai-zsgc.onrender.com"
    ],
    allow_origin_regex=r"https://.*\.netlify\.app",
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
            "POST /run-pdf": "Upload a PDF paper and analyze it",
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


@app.post("/run-pdf")
async def run_pdf(
    file: UploadFile = File(...),
    drug: str = Form(""),
    disease: str = Form("")
):
    """
    Upload a PDF research paper and run multi-agent analysis on it.
    """
    print(f"\n{'='*60}")
    print(f"NEW PDF REQUEST: {file.filename}")
    print(f"{'='*60}\n")
    
    # 1. Extract text from uploaded PDF
    text = ""
    try:
        reader = pypdf.PdfReader(file.file)
        # Extract text from first 8 pages
        for page in reader.pages[:8]:
            text += page.extract_text() or ""
    except Exception as e:
        print(f"Error reading PDF: {e}")
        text = f"Could not extract text from PDF. Filename: {file.filename}"
    
    # 2. Extract drug & disease if empty
    detected_drug = drug.strip()
    detected_disease = disease.strip()
    
    if not detected_drug or not detected_disease:
        try:
            API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyDVVajOq75YzUh7QcNEXMPoWVEwqKOnOxE")
            genai.configure(api_key=API_KEY)
            model = genai.GenerativeModel('gemini-2.5-flash')
            
            prompt = (
                "You are an expert medical text analyzer. Analyze this excerpt from a scientific paper. "
                "Identify: 1) The primary pharmaceutical drug compound name being studied. "
                "2) The target disease or indication being investigated. "
                "Return ONLY a JSON object with keys 'drug' and 'disease'. "
                "For example: {\"drug\": \"Metformin\", \"disease\": \"Alzheimer's\"}. "
                f"Text:\n{text[:2000]}"
            )
            
            res = model.generate_content(prompt)
            res_text = res.text.strip()
            
            js_start = res_text.find('{')
            js_end = res_text.rfind('}') + 1
            if js_start != -1 and js_end != 0:
                js_data = json.loads(res_text[js_start:js_end])
                if not detected_drug:
                    detected_drug = js_data.get("drug", "Unknown Compound")
                if not detected_disease:
                    detected_disease = js_data.get("disease", "Unknown Indication")
        except Exception as e:
            print(f"Error extracting parameters: {e}")
            
        if not detected_drug:
            detected_drug = "Analyzed Drug"
        if not detected_disease:
            detected_disease = "Target Indication"
            
    # 3. Create papers input state to pass into graph
    abstract = text[:3000] if len(text) > 3000 else text
    initial_state = {
        "drug": detected_drug,
        "disease": detected_disease,
        "query": f"{detected_drug} for {detected_disease} (from PDF: {file.filename})",
        "papers": [{
            "title": file.filename.replace(".pdf", "").replace("_", " ").replace("-", " ").title(),
            "abstract": abstract,
            "link": ""
        }]
    }
    
    # Run the graph
    final_state = graph_app.invoke(initial_state)
    
    print(f"\n{'='*60}")
    print(f"PDF REQUEST COMPLETED")
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
