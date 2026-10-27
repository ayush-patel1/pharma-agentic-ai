# 🧬 NeuroRepurpose AI — Agentic Biomedical Research Intelligence Platform

**NeuroRepurpose AI** is a source-grounded biomedical research intelligence platform for investigating compounds, diseases, molecular targets, biological pathways, and drug-repurposing hypotheses. 

It combines **hybrid literature retrieval (NCBI PubMed + Europe PMC + BM25 RRF)**, an **evidence intelligence engine with claim-level citations**, an **evidence verifier**, **research gap discovery**, an **interactive context-aware research chatbot**, and a **7-node adaptive LangGraph workflow**.

> ⚠️ **Research Disclaimer**: NeuroRepurpose AI is a research-assistance workspace designed to synthesize scientific literature. It is not a clinical decision-support system and does not determine medical safety, efficacy, or treatment protocols.

---

## 🎯 Architecture Overview

```
                      ┌──────────────────────────────────────┐
                      │    Researcher Query / Study PDF      │
                      └──────────────────┬───────────────────┘
                                         ▼
                      ┌──────────────────────────────────────┐
                      │          1. Planner Agent            │
                      │  Formulates multi-source strategies  │
                      └──────────────────┬───────────────────┘
                                         ▼
                      ┌──────────────────────────────────────┐
                      │         2. Retrieval Agent           │
                      │  NCBI PubMed + Europe PMC + BM25     │
                      │  Reciprocal Rank Fusion (RRF) Rerank │
                      └──────────────────┬───────────────────┘
                                         ▼
                      ┌──────────────────────────────────────┐
                      │         3. Extraction Agent          │
                      │  Molecular entities, targets, models │
                      └──────────────────┬───────────────────┘
                                         ▼
                      ┌──────────────────────────────────────┐
                      │       4. Evidence Analyst Agent      │
                      │  Cross-paper comparison matrix       │
                      │  Concordant vs Discordant findings   │
                      └──────────────────┬───────────────────┘
                                         ▼
                      ┌──────────────────────────────────────┐
                      │          5. Verifier Agent           │
                      │  Audits claims against source quotes │
                      └──────────────────┬───────────────────┘
                                         ▼
                      ┌──────────────────────────────────────┐
                      │        6. Gap Discovery Agent        │
                      │  Unanswered questions & 1-click runs │
                      └──────────────────┬───────────────────┘
                                         ▼
                      ┌──────────────────────────────────────┐
                      │       7. Report Generator Agent      │
                      │  Cited monograph, Markdown & JSON    │
                      └──────────────────┬───────────────────┘
                                         ▼
    ┌──────────────────────────────────────────────────────────────────┐
    │                     Research Intelligence Suite                  │
    │  • Workspace   • Evidence Explorer   • Chatbot   • Target Graph  │
    └──────────────────────────────────────────────────────────────────┘
```

---

## 🔬 Core Platform Features

### 1. Hybrid Literature Retrieval (Feature A)
* **Multi-Provider Search**: Queries **NCBI PubMed E-utilities** and **Europe PMC REST API**.
* **BM25 & Reciprocal Rank Fusion (RRF)**: Combines keyword frequency with search provider ranks:
  $$RRF(d) = \sum_{r \in \text{rankings}} \frac{1}{60 + r(d)}$$
* **Deduplication & Metadata Normalization**: Normalizes records with unified fields (`pmid`, `doi`, `title`, `abstract`, `authors`, `journal`, `publication_date`, `publication_year`, `publication_type`, `link`, `retrieval_score`).
* **TTL In-Memory Cache**: Respects NCBI rate limits and accelerates repeated queries.
* **Advanced Filters**: Publication year ranges (`year_min`, `year_max`) and publication types.

### 2. Evidence Intelligence & Claim-Level Citations (Feature B)
* **Structured Claim Extraction**: Statements of finding, molecular targets (AMPK, mTOR, TNF-α, BACE1), study model (in vitro, animal in vivo, clinical human), and sample size.
* **Claim-Level Grounding**: Every claim has an assigned `claim_id` (e.g. `CLM-01`), `relationship` (`supports`, `contradicts`, `contextualizes`), and `verification_status`.
* **Automated Evidence Verifier**: Lexical and polarity verifier cross-referencing claim assertions against verbatim cited passages to flag ungrounded statements.

### 3. Cross-Paper Comparison & Research Gaps (Feature C)
* **Concordance vs Discordance**: Highlights consensus findings across multiple papers vs conflicting outcomes or dose paradoxes.
* **Candidate Research Gaps**: Pinpoints underexplored biological mechanisms and generates **1-Click Follow-Up Search Queries** directly into the Analyzer.

### 4. Context-Aware Research Chatbot (Feature D)
* Dedicated research chat interface grounded in the active project corpus.
* **Clickable Citation Cards**: Citations (`[REF-01]`, `[REF-02]`) open an inspection drawer showing the exact publication title, PMID, and verbatim quoted passage.
* **Integrated Research Tools**: Tool routing for literature search, claim verification, and gap discovery.
* **Grounded Safeguards**: Admits when evidence is missing; avoids medical treatment advice.

### 5. Interactive Molecular Target Graph
* Interactive SVG-based knowledge graph mapping **Compound ➔ Molecular Targets ➔ Cellular Mechanisms ➔ Clinical Indications**.
* Inspect target receptor binding affinities ($K_d$), IC50 values, and biological functions.

### 6. Export Center & Observability
* Multi-format export: **Markdown (`.md`)**, **JSON Research Bundle**, and styled **PDF**.
* Complete execution trace with per-agent timestamps, action logs, and reproducibility metadata.

---

## 📁 Repository Structure

```
pharma-agentic-ai/
├── backend/
│   ├── database.py         # SQLAlchemy models (SQLite/PostgreSQL) & session management
│   ├── schemas.py          # Typed Pydantic data contracts
│   ├── retrieval.py        # Hybrid search (PubMed, Europe PMC, BM25, RRF, caching)
│   ├── evidence.py         # Structured claim extraction & deterministic verifier
│   ├── chat.py             # Context-aware RAG chatbot engine with tool-calling
│   ├── graph.py            # 7-node adaptive LangGraph state machine
│   ├── main.py             # FastAPI REST gateway
│   ├── tools.py            # Synthesis utilities & Gemini integrations
│   └── tests/
│       ├── test_suite.py   # Native unittest suite (7 unit & integration tests)
│       └── test_tools.py   # Tools tests
├── frontend/
│   ├── src/
│   │   ├── components/     # Navbar, Footer
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Product landing page & 3D DNA visualization
│   │   │   ├── Workspace.jsx        # Project manager & analysis history
│   │   │   ├── Analyzer.jsx         # Research search & PDF upload pipeline
│   │   │   ├── EvidenceExplorer.jsx # Claim matrix, contradictions & research gaps
│   │   │   ├── ResearchChat.jsx     # Context-aware chatbot with citation cards
│   │   │   ├── KnowledgeGraph.jsx   # Interactive molecular target graph
│   │   │   ├── ReportsPage.jsx      # Monograph archive & multi-format export
│   │   │   └── About.jsx            # Scientific methodology overview
│   │   ├── App.jsx         # React Router navigation
│   │   └── index.css       # Biotech design system
│   ├── package.json
│   └── vite.config.js
├── README.md
├── pyproject.toml
└── .env.example
```

---

## 🚀 Local Development Setup

### Prerequisites
* **Python 3.9+** (Tested on Python 3.14)
* **Node.js 18+** & **npm**

### 1. Configure Environment
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY="your_google_gemini_api_key_here"
# Optional NCBI parameters for enhanced rate limits:
PUBMED_EMAIL="researcher@example.com"
NCBI_API_KEY=""
DATABASE_URL="sqlite:///./neurorepurpose.db"
```

### 2. Backend Launch
Install requirements and start FastAPI with Uvicorn:
```bash
pip install -r backend/requirements.txt
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
* API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Frontend Launch
In a second terminal:
```bash
cd frontend
npm install
npm run dev
```
* Web Application: [http://localhost:3000](http://localhost:3000)

### 4. Running Backend Tests
Execute the native unit and integration test suite:
```bash
python -m unittest backend/tests/test_suite.py
```

---

## 🧪 Verification & Test Results

```
Ran 7 tests in 0.261s

OK
- test_root_endpoint: PASSED
- test_normalize_title: PASSED
- test_bm25_ranker: PASSED
- test_reciprocal_rank_fusion: PASSED
- test_claim_verification: PASSED
- test_evidence_synthesis: PASSED
- test_chat_and_project_api: PASSED
```

Frontend production build check:
```
✓ 422 modules transformed.
dist/index.html                           0.58 kB
dist/assets/ReportsPage.js                5.74 kB
dist/assets/Workspace.js                  7.71 kB
dist/assets/ResearchChat.js               8.59 kB
dist/assets/EvidenceExplorer.js          12.60 kB
dist/assets/KnowledgeGraph.js            13.28 kB
dist/assets/Analyzer.js                  17.51 kB
✓ built in 7.07s with zero errors
```

---

## 📄 License
Licensed under the [MIT License](LICENSE).
