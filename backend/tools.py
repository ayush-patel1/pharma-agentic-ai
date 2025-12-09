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


def summarize_papers_batch(drug: str, disease: str, papers: List[Dict]) -> List[Dict]:
    """
    Summarize multiple papers in a single LLM API call to avoid rate limits.
    
    Args:
        drug: Drug name being investigated
        disease: Disease being targeted
        papers: List of paper dictionaries with title and abstract
    
    Returns:
        List of dictionaries with title and LLM-generated summary
    """
    if not papers:
        return []
    
    # Build combined prompt with all papers
    papers_text = ""
    for i, paper in enumerate(papers, 1):
        papers_text += f"""
Paper {i}:
Title: {paper['title']}
Abstract: {paper['abstract']}
---
"""
    
    prompt = f"""You are a pharmaceutical research expert analyzing papers for drug repurposing opportunities.

Drug: {drug}
Disease: {disease}

Below are {len(papers)} research papers. For each paper, provide:
- 2-3 bullet points of key findings relevant to repurposing {drug} for {disease}
- Relevance score (0-10)
- One-line conclusion

Papers to analyze:
{papers_text}

IMPORTANT: Return your response as a valid JSON array with this exact structure:
[
  {{
    "title": "exact title from Paper 1",
    "summary": "• Key finding 1\\n• Key finding 2\\n• Key finding 3\\nRelevance: X/10\\nConclusion: [one-line conclusion]"
  }},
  {{
    "title": "exact title from Paper 2",
    "summary": "..."
  }}
]

Return ONLY the JSON array, no additional text before or after."""

    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        # Extract JSON from response (handle cases where model adds extra text)
        json_start = response_text.find('[')
        json_end = response_text.rfind(']') + 1
        
        if json_start == -1 or json_end == 0:
            raise ValueError("No JSON array found in response")
        
        json_str = response_text[json_start:json_end]
        summaries_data = json.loads(json_str)
        
        # Map summaries back to papers with links
        results = []
        for i, paper in enumerate(papers):
            if i < len(summaries_data):
                results.append({
                    "title": paper["title"],
                    "summary_raw": summaries_data[i].get("summary", "Summary not available"),
                    "link": paper.get("link", "")
                })
            else:
                # Fallback if response has fewer summaries than papers
                results.append({
                    "title": paper["title"],
                    "summary_raw": "Summary not generated",
                    "link": paper.get("link", "")
                })
        
        return results
        
    except Exception as e:
        # Handle rate limit errors and other exceptions
        error_msg = str(e)
        if "ResourceExhausted" in error_msg or "quota" in error_msg.lower():
            print(f"[ERROR] Gemini API rate limit exceeded: {error_msg}")
            return [{
                "title": paper["title"],
                "summary_raw": "⚠️ API rate limit exceeded. Please try again later or use a different API key.",
                "link": paper.get("link", "")
            } for paper in papers]
        else:
            print(f"[ERROR] Failed to summarize papers: {error_msg}")
            return [{
                "title": paper["title"],
                "summary_raw": f"⚠️ Summarization failed: {error_msg}",
                "link": paper.get("link", "")
            } for paper in papers]
