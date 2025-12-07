from typing import List, Dict, Optional
from typing_extensions import TypedDict
from pydantic import BaseModel


class GraphState(TypedDict, total=False):
    """State object that flows through the LangGraph workflow."""
    drug: str
    disease: str
    query: str
    tasks: List[str]
    papers: List[Dict]          # each dict: {title, abstract, link}
    summaries: List[Dict]       # {title, key_points, score}
    final_report: str


class QueryInput(BaseModel):
    """Input model for the API endpoint."""
    drug: str
    disease: str


class QueryOutput(BaseModel):
    """Output model for the API endpoint."""
    drug: str
    disease: str
    papers: List[Dict]
    summaries: List[Dict]
    final_report: str
