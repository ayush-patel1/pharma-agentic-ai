# 🧬 NeuroRepurpose AI - Clinical Discovery Suite

NeuroRepurpose AI is a state-of-the-art multi-agent research platform designed to accelerate clinical drug repurposing. The platform enables pharmaceutical researchers, biotech startups, and clinical research organizations (CROs) to scan scientific archives, analyze uploaded research papers, and formulate comprehensive drug-indication repurposing monographs in seconds.

---

## 🎯 Value Proposition

Developing a new chemical entity (NCE) from scratch takes **10–12 years** and costs upwards of **$2.6 billion**, with a clinical success rate of under 10%. 

Drug repurposing (repositioning known, FDA-approved compounds for new indications) bypasses early toxicology bottlenecks, saving up to **$2 billion** in R&D and reducing the development timeline by **4 to 6 years**.

NeuroRepurpose AI automates the initial literature synthesis, safety matching, and feasibility indexing phases using a cooperative team of AI agents.

---

## 🔬 Core Capabilities

### 1. Literature Database Search
Scan indexed publication archives for prior preclinical and epidemiological evidence matching target compounds with new indications. Includes quick-click **Suggested Trials** tags for immediate evaluation (e.g., *Metformin + Alzheimer's*, *Imatinib + Parkinson's*).

### 2. PDF Document Upload & Text Extraction
Upload any scientific study or clinical paper in PDF format. The platform automatically extracts raw text pages (using `pypdf`) and feeds the context directly into the analysis pipeline.

### 3. Automated Compound Detection
If you upload a paper without specifying inputs, the platform employs Google Gemini AI to analyze the document's introductory chapters, extract the primary drug compound name and target disease, and update the research workspace inputs automatically.

### 4. Interactive Split-Screen Document Preview
When analyzing an uploaded PDF, review a tabbed, formatted mockup of the document's key sections (*Introduction*, *Methodology*, *Discussion & MoA*) side-by-side with the agent timeline and log terminal.

### 5. Clinical Synergy & Repurposing Scorecard
An executive dashboard that aggregates literature consensus into four quantitative metrics:
*   **Synergy Index (0–100%):** Estimated biological pathway overlay and target receptor affinity.
*   **Safety Match (0–100%):** Toxicity match and adverse effect overlay in target cohorts.
*   **Evidence Strength (Tiers I–III):** Scientific consensus grading (Tier I: Meta-Analyses, Tier II: Controlled Trials, Tier III: Preclinical/Anecdotal).
*   **Time Accelerated:** Quantified time savings (e.g., *Saves ~4.5 years*) achieved by bypassing early preclinical safety phases.

### 6. Accelerated Investigational Roadmap
A visual progress timeline tracking milestones from *Phase I Safety [Bypassed]* to *Phase IIa Protocol [Current]* to *IND Submission [Pending]* and *Phase IIb Efficacy [Pending]*.

### 7. Alternative Candidates Matrix
A comparative table matching the primary candidate drug with alternative therapeutics in the same chemical class, showing synergy scores, evidence tiers, and secondary FDA-approved indications.

### 8. Publication-Ready Monograph
Generates a structured assessment report styled as a medical journal publication, complete with:
*   Executive Summary
*   Mechanism of Action & Rationale
*   Safety & Efficacy Profile
*   Recommended Phase IIa Exploratory Protocol Card

---

## 🏗️ Multi-Agent Architecture

The platform runs a stateful workflow orchestrated by **LangGraph** where specialized agents collaborate in sequence:

```
                  ┌──────────────────────┐
                  │      User Input      │
                  │ (PDF or Search Keys) │
                  └──────────┬───────────┘
                             ▼
                  ┌──────────────────────┐
                  │    Master Agent      │
                  │ (Plan & Orchestrate) │
                  └──────────┬───────────┘
                             ▼
                  ┌──────────────────────┐
                  │  Extraction Agent    │
                  │ (PDF or Mock Search) │
                  └──────────┬───────────┘
                             ▼
                  ┌──────────────────────┐
                  │   Summarizer Agent   │
                  │ (Gemini API batch)   │
                  └──────────┬───────────┘
                             ▼
                  ┌──────────────────────┐
                  │     Report Agent     │
                  │ (Monograph & scores) │
                  └──────────┬───────────┘
                             ▼
                  ┌──────────────────────┐
                  │   Clinical Dashboard │
                  │    & PDF Export      │
                  └──────────────────────┘
```

1.  **Master Agent:** Validates parameters and structures the sub-task execution plan.
2.  **Extraction Agent:** Gathers text inputs. For database runs, it filters scientific abstracts; for file uploads, it extracts text streams from PDF pages.
3.  **Summarizer Agent:** Batches the extracted data into a single request to Google Gemini, mapping efficacy metrics and safety flags.
4.  **Report Agent:** Automatically compiles the final structured HTML publication monograph, feasibility scorecard values, and the Phase IIa trial protocol layout.

---

## 📁 Project Structure

```
pharma-agentic-langgraph/
├── backend/
│   ├── main.py            # FastAPI ASGI Gateway (with CORS and PDF Upload support)
│   ├── graph.py           # LangGraph Multi-Agent Workflow Engine
│   ├── tools.py           # Literature databases & Gemini Summarizer integrations
│   ├── models.py          # State dictionaries and validation models
│   └── data/
│       └── mock_papers.json # Publication database for search simulations
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
*   **Google Gemini API Key**

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
pip install pypdf
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

## 🔒 Data Security & HIPAA Compliance

*   **Temporary File Buffering:** Uploaded PDF streams are read directly from memory buffers and are never persisted to disk, preventing data leakage of proprietary study materials.
*   **Auditable Integrity:** All generated summaries are mapped directly back to source publications (e.g. mock PubMed identifiers) to eliminate AI hallucination.
*   **Secure API Requests:** Securely passes request payloads over SSL to downstream language models, utilizing local `.env` security parameters.

---

## 📄 License

This clinical discovery suite is licensed under the MIT License - feel free to fork, customize, and extend for your clinical development operations.
