import pytest
from fastapi.testclient import TestClient

from backend.database import Base, SessionLocal, engine, init_db
from backend.evidence import verify_claim_grounding, extract_claims_and_synthesis
from backend.main import app
from backend.retrieval import BM25Ranker, normalize_title, reciprocal_rank_fusion


@pytest.fixture(scope="module")
def client():
    init_db()
    with TestClient(app) as test_client:
        yield test_client


def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "NeuroRepurpose AI" in data["platform"]
    assert "endpoints" in data


def test_normalize_title():
    assert normalize_title("Metformin in Alzheimer's Disease: A Review!") == "metformininalzheimersdiseaseareview"


def test_bm25_ranker():
    corpus = [
        "Metformin improves cognitive impairment and memory in mice.",
        "Aspirin reduces cardiovascular risk in adult patients.",
        "Synaptic plasticity and Alzheimer amyloid beta plaque reduction by Metformin.",
    ]
    bm25 = BM25Ranker(corpus)
    score0 = bm25.score("metformin cognitive", 0)
    score1 = bm25.score("metformin cognitive", 1)
    score2 = bm25.score("metformin cognitive", 2)
    assert score0 > score1
    assert score2 > score1


def test_reciprocal_rank_fusion():
    list1 = [{"title": "Paper A", "pmid": "111"}, {"title": "Paper B", "pmid": "222"}]
    list2 = [{"title": "Paper B", "pmid": "222"}, {"title": "Paper C", "pmid": "333"}]
    merged = reciprocal_rank_fusion([list1, list2], k=60, top_n=3)
    assert len(merged) == 3
    # Paper B appears in both lists, so its RRF score should rank it #1
    assert merged[0]["pmid"] == "222"


def test_claim_verification():
    passage = "Metformin treatment significantly attenuated amyloid beta accumulation in hippocampal neurons."
    # High overlap claim
    status, conf, notes = verify_claim_grounding(
        "Metformin reduces amyloid accumulation in neurons", passage
    )
    assert status in ["verified", "partially_verified"]
    assert conf >= 0.7

    # Unsupported claim
    status_un, conf_un, _ = verify_claim_grounding(
        "Paclitaxel induces tumor regression in pancreatic cancer", passage
    )
    assert status_un == "unsupported"
    assert conf_un < 0.6


def test_evidence_synthesis_fallback():
    sample_papers = [
        {
            "title": "Metformin modulates AMPK pathway in neurodegenerative models",
            "abstract": "We investigated the neuroprotective mechanisms of metformin. Metformin administration activated AMPK signaling and reduced neuroinflammation in tauopathy models.",
            "pmid": "999001",
        }
    ]
    synthesis = extract_claims_and_synthesis("Metformin", "Alzheimer's", sample_papers)
    assert synthesis.drug == "Metformin"
    assert len(synthesis.claims) >= 1
    assert len(synthesis.gaps) >= 1
    assert len(synthesis.comparison_matrix) >= 1


def test_project_and_chat_endpoints(client):
    # 1. List Projects
    p_resp = client.get("/api/projects")
    assert p_resp.status_code == 200
    assert isinstance(p_resp.json(), list)

    # 2. Create Chat Session
    chat_session_resp = client.post(
        "/api/chat/sessions",
        json={"title": "Test Alzheimer Session", "project_id": "default"},
    )
    assert chat_session_resp.status_code == 200
    session_data = chat_session_resp.json()
    session_id = session_data["id"]

    # 3. Post Message
    msg_resp = client.post(
        f"/api/chat/sessions/{session_id}/messages",
        json={"content": "What are the molecular targets for this investigation?"},
    )
    assert msg_resp.status_code == 200
    msg_data = msg_resp.json()
    assert msg_data["role"] == "assistant"
    assert len(msg_data["content"]) > 10
    assert "follow_up_suggestions" in msg_data
