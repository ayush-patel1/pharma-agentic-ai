import json
import os
from typing import List, Dict
import google.generativeai as genai

# Initialize Gemini client with API key
API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyDVVajOq75YzUh7QcNEXMPoWVEwqKOnOxE")
genai.configure(api_key=API_KEY)


def search_mock_papers(drug: str, disease: str, top_k: int = 5) -> List[Dict]:
    """
    Search mock papers dataset for relevant papers based on drug and disease keywords.
    
    Args:
        drug: Drug name to search for
        disease: Disease name to search for
        top_k: Maximum number of papers to return
    
    Returns:
        List of paper dictionaries matching the search criteria
    """
    # Get the path to mock_papers.json
    current_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(current_dir, "data", "mock_papers.json")
    
    with open(data_path) as f:
        papers = json.load(f)
    
    results = []
    for p in papers:
        text = (p["title"] + " " + p["abstract"]).lower()
        if drug.lower() in text or disease.lower() in text:
            results.append(p)
    
    return results[:top_k]


def summarize_paper(drug: str, disease: str, paper: Dict) -> Dict:
    """
    Use LLM to summarize a paper for drug repurposing context.
    
    Args:
        drug: Drug name being investigated
        disease: Disease being targeted
        paper: Paper dictionary with title and abstract
    
    Returns:
        Dictionary with title and LLM-generated summary
    """
    prompt = f"""
You are a pharma expert. Summarize this paper for drug repurposing.

Drug: {drug}
Disease: {disease}
Title: {paper['title']}
Abstract: {paper['abstract']}

Return:
- 2 bullet key findings
- How relevant is this (0-10)?
- One-line conclusion.
"""
    
    model = genai.GenerativeModel('gemini-2.5-flash')
    response = model.generate_content(prompt)
    text = response.text
    
    return {
        "title": paper["title"],
        "summary_raw": text,
        "link": paper.get("link", "")
    }
