# NeuroRepurpose AI

NeuroRepurpose AI is an exploratory research tool for searching PubMed by compound and indication, extracting text from research PDFs, and organizing source material into AI-generated summaries and a structured report. It does not assess treatment safety, efficacy, or clinical suitability.

---

## 🔬 Core Capabilities

### 1. Literature Database Search
Search PubMed for records that mention both supplied terms in their title or abstract. This focused query is not a systematic review and may miss relevant records. Suggested compound–indication queries are examples, not recommendations.

### 2. PDF Document Upload & Text Extraction
Upload a text-based PDF up to 15 MB. The service extracts text from up to the first eight pages and includes it with related PubMed records. Scanned/image-only PDFs are not supported.

### 3. Automated Compound Detection
If compound and indication are omitted, the configured AI service attempts to identify both from extracted text. If either cannot be identified, the request asks for the missing term instead of substituting a filename or guessed value.

### 4. Source-linked summaries and report
The synthesis step summarizes supplied abstracts and extracted PDF text. The report links summaries to their source records and does not generate clinical scores or treatment recommendations. AI-generated text may still be incomplete or incorrect; verify it against the original publication.

---

## 🏗️ Multi-Agent Architecture

The platform runs a stateful workflow orchestrated by **LangGraph** where specialized agents collaborate in sequence:

```
                  ┌──────────────────────┐
                  │      User Input      │
                  │  (PDF or Query)     │
                  └──────────┬───────────┘
                             ▼
                  ┌──────────────────────┐
                  │    Master Agent      │
                  │ (Plan & Orchestrate) │
                  └──────────┬───────────┘
                             ▼
                  ┌──────────────────────┐
                  │  Search / Extraction │
                  │ (PubMed / PDF text)  │
                  └──────────┬───────────┘
                             ▼
                  ┌──────────────────────┐
                  │   Summarizer Agent   │
                  │ (Source-grounded AI)│
                  └──────────┬───────────┘
                             ▼
                  ┌──────────────────────┐
                  │     Report Agent     │
                  │ (Cited HTML report)  │
                  └──────────┬───────────┘
                             ▼
                  ┌──────────────────────┐
                  │   Research Workspace │
                  │    & PDF Export      │
                  └──────────────────────┘
```

1.  **Master Agent:** Validates parameters and structures the sub-task execution plan.
2.  **Search / Extraction Agent:** Retrieves PubMed records matching both terms, and extracts text from uploaded PDFs.
3.  **Summarizer Agent:** Produces source-specific summaries of the retrieved abstracts and extracted PDF text. It does not assign clinical scores.
4.  **Report Agent:** Compiles a source-linked HTML report without clinical recommendations or fabricated scores.

---

## 📁 Project Structure

```
pharma-agentic-langgraph/
├── backend/
│   ├── main.py            # FastAPI ASGI Gateway (with CORS and PDF Upload support)
│   ├── graph.py           # LangGraph Multi-Agent Workflow Engine
│   ├── tools.py           # PubMed retrieval, AI synthesis, and report generation
│   ├── models.py          # State dictionaries and validation models
│   └── data/
│       └── mock_papers.json # Legacy sample data (not used for live searches)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx   # Sticky glassmorphic navbar
│   │   │   └── Footer.jsx   # Business-focused platform footer
│   │   ├── pages/
│   │   │   ├── Home.jsx     # Landing page with 3D animated CSS DNA helix
│   │   │   ├── About.jsx    # Methodology & node-chart architecture map
│   │   │   └── Analyzer.jsx # Core research dashboard (PDF uploader, scorecard, terminal)
│   │   ├── App.jsx          # React Router entry
│   │   └── index.css        # Global clinical stylesheet
│   ├── package.json
│   └── vite.config.js
├── .env.example             # Environment key templates
├── requirements.txt         # Package indices for cloud hosting
└── README.md                # Platform documentation
```

---

## 🚀 Installation & Local Launch

### Prerequisites
*   **Python 3.9+** (Tested on Python 3.14)
*   **Node.js 18+**
*   **AI service API key** (`GEMINI_API_KEY` for the configured backend integration)
*   **Internet access** for PubMed E-utilities

### 1. Clone & Set Up Environment Variables
Create a file named `.env` in the root directory:
```env
GEMINI_API_KEY="your_actual_gemini_api_key_here"
```

### 2. Install Backend Dependencies
Run the following commands in your terminal:
```bash
# Install required Python packages globally or in your venv
pip install -r backend/requirements.txt
```

### 3. Launch Backend Server
From the root directory, start the FastAPI gateway:
```bash
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
```
*   API Gateway: `http://localhost:8000`
*   Swagger Interactive Docs: `http://localhost:8000/docs`

### 4. Install Frontend Dependencies & Launch Client
Open a second terminal window:
```bash
# Navigate to frontend folder
cd frontend

# Install package dependencies
npm install

# Start Vite dev client
npm run dev
```
*   Clinical Client: [http://localhost:3000](http://localhost:3000)

---

## Data handling and limitations

*   PDF text extraction reads up to the first eight pages. Extracted text is sent to the configured AI service; do not upload confidential or identifiable documents.
*   PubMed source links make retrieved records inspectable but do not eliminate AI errors. Verify generated statements against the original publications.
*   PubMed title/abstract queries are not systematic searches and may miss relevant papers.
*   This project does not claim HIPAA compliance or provide clinical, safety, efficacy, or regulatory assessments.

---

## 📄 License

This exploratory research tool is licensed under the MIT License.
