import unittest
from fastapi.testclient import TestClient

from backend.database import init_db
from backend.evidence import extract_claims_and_synthesis, verify_claim_grounding
from backend.main import app
from backend.retrieval import BM25Ranker, normalize_title, reciprocal_rank_fusion


class TestNeuroRepurpose(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        init_db()
        cls.client = TestClient(app)

    def test_root_endpoint(self):
        resp = self.client.get("/")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("NeuroRepurpose AI", data["platform"])

    def test_normalize_title(self):
        self.assertEqual(
            normalize_title("Metformin in Alzheimer's Disease: A Review!"),
            "metformininalzheimersdiseaseareview",
        )

    def test_bm25_ranker(self):
        corpus = [
            "Metformin improves cognitive impairment and memory in mice.",
            "Aspirin reduces cardiovascular risk in adult patients.",
            "Synaptic plasticity and Alzheimer amyloid beta plaque reduction by Metformin.",
        ]
        bm25 = BM25Ranker(corpus)
        score0 = bm25.score("metformin cognitive", 0)
        score1 = bm25.score("metformin cognitive", 1)
        score2 = bm25.score("metformin cognitive", 2)
        self.assertGreater(score0, score1)
        self.assertGreater(score2, score1)

    def test_reciprocal_rank_fusion(self):
        list1 = [{"title": "Paper A", "pmid": "111"}, {"title": "Paper B", "pmid": "222"}]
        list2 = [{"title": "Paper B", "pmid": "222"}, {"title": "Paper C", "pmid": "333"}]
        merged = reciprocal_rank_fusion([list1, list2], k=60, top_n=3)
        self.assertEqual(len(merged), 3)
        self.assertEqual(merged[0]["pmid"], "222")

    def test_claim_verification(self):
        passage = "Metformin treatment significantly attenuated amyloid beta accumulation in hippocampal neurons."
        status, conf, notes = verify_claim_grounding(
            "Metformin reduces amyloid accumulation in neurons", passage
        )
        self.assertIn(status, ["verified", "partially_verified"])
        self.assertGreaterEqual(conf, 0.7)

        status_un, conf_un, _ = verify_claim_grounding(
            "Paclitaxel induces tumor regression in pancreatic cancer", passage
        )
        self.assertEqual(status_un, "unsupported")
        self.assertLess(conf_un, 0.6)

    def test_evidence_synthesis(self):
        sample_papers = [
            {
                "title": "Metformin modulates AMPK pathway in neurodegenerative models",
                "abstract": "We investigated the neuroprotective mechanisms of metformin. Metformin administration activated AMPK signaling and reduced neuroinflammation in tauopathy models.",
                "pmid": "999001",
            }
        ]
        synthesis = extract_claims_and_synthesis("Metformin", "Alzheimer's", sample_papers)
        self.assertEqual(synthesis.drug, "Metformin")
        self.assertGreaterEqual(len(synthesis.claims), 1)
        self.assertGreaterEqual(len(synthesis.gaps), 1)

    def test_chat_and_project_api(self):
        # 1. Projects
        p_resp = self.client.get("/api/projects")
        self.assertEqual(p_resp.status_code, 200)

        # 2. Chat session creation
        s_resp = self.client.post("/api/chat/sessions", json={"title": "Test Chat"})
        self.assertEqual(s_resp.status_code, 200)
        s_id = s_resp.json()["id"]

        # 3. Message sending
        m_resp = self.client.post(
            f"/api/chat/sessions/{s_id}/messages",
            json={"content": "What is the biological mechanism?"},
        )
        self.assertEqual(m_resp.status_code, 200)
        self.assertEqual(m_resp.json()["role"], "assistant")
        self.assertGreater(len(m_resp.json()["content"]), 10)


if __name__ == "__main__":
    unittest.main()
