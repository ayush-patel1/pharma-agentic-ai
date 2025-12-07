# 🧬 Pharma Agentic LangGraph

A multi-agent system for drug repurposing literature analysis using LangGraph and FastAPI. This prototype demonstrates how AI agents can collaborate to search literature, summarize research papers, and generate comprehensive reports for pharmaceutical repurposing opportunities.

## 🎯 Project Goal

Given a drug name and a disease, the system uses multiple agents to:
- Search literature (mock dataset for demo)
- Summarize 3-5 key papers using LLM
- Generate a ranked repurposing summary
- Produce a structured PDF-style text report

## 🏗️ Architecture

The system consists of 4 specialized agents orchestrated by LangGraph:

1. **Master Agent**: Plans subtasks and coordinates workflow
2. **Search Agent**: Fetches relevant papers from mock dataset
3. **Summarizer Agent**: Uses LLM to summarize each paper for repurposing context
4. **Reporter Agent**: Aggregates summaries into a final structured report

```
User Input (Drug + Disease)
         ↓
    Master Agent (Planning)
         ↓
    Search Agent (Literature Retrieval)
         ↓
  Summarizer Agent (LLM Analysis)
         ↓
   Report Agent (Final Report)
         ↓
    Results Display
```

## 📁 Project Structure

```
pharma-agentic-langgraph/
├── backend/
│   ├── __init__.py
│   ├── main.py          # FastAPI entry point
│   ├── graph.py         # LangGraph workflow definition
│   ├── tools.py         # Search & summarization tools
│   └── models.py        # Pydantic models & state
├── data/
│   └── mock_papers.json # Curated dataset (10 papers)
├── frontend/
│   ├── src/
│   │   ├── App.jsx      # Main React component
│   │   ├── App.css      # Styling
│   │   ├── main.jsx     # Entry point
│   │   └── index.css    # Global styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── requirements.txt
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- Google Gemini API Key

### Backend Setup

1. **Clone and navigate to the project:**
```bash
cd pharma-agentic-langgraph
```

2. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Set Gemini API key:**
```bash
export GEMINI_API_KEY='your-api-key-here'
```

5. **Run the backend:**
```bash
cd backend
uvicorn main:app --reload
```

Backend will be available at: `http://localhost:8000`
- Interactive API docs: `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run development server:**
```bash
npm run dev
```

Frontend will be available at: `http://localhost:3000`

## 🧪 Testing the System

### Option 1: Using the UI (Recommended)

1. Open `http://localhost:3000` in your browser
2. Enter:
   - **Drug**: `Metformin`
   - **Disease**: `Alzheimer's`
3. Click "Run Analysis"
4. View the results:
   - Retrieved papers (cards)
   - AI-generated summaries (cards)
   - Final repurposing report

### Option 2: Using FastAPI Swagger UI

1. Open `http://localhost:8000/docs`
2. Click on `POST /run`
3. Click "Try it out"
4. Enter JSON:
```json
{
  "drug": "Metformin",
  "disease": "Alzheimer's"
}
```
5. Click "Execute" and view response

### Option 3: Using cURL

```bash
curl -X POST "http://localhost:8000/run" \
  -H "Content-Type: application/json" \
  -d '{"drug": "Metformin", "disease": "Alzheimers"}'
```

## 🔧 How It Works

### 1. State Management (models.py)

The `GraphState` TypedDict defines the shared state that flows through all agents:

```python
class GraphState(TypedDict, total=False):
    drug: str
    disease: str
    query: str
    tasks: List[str]
    papers: List[Dict]
    summaries: List[Dict]
    final_report: str
```

### 2. Tools (tools.py)

- **`search_mock_papers()`**: Filters mock dataset by drug/disease keywords
- **`summarize_paper()`**: Uses OpenAI GPT-4o-mini to generate expert summaries

### 3. Agent Workflow (graph.py)

Each node is a Python function that transforms state:

```python
master_agent() → search_agent() → summarizer_agent() → report_agent()
```

The graph is compiled into an executable workflow using LangGraph.

### 4. API Layer (main.py)

FastAPI exposes the workflow via REST endpoint with CORS enabled for frontend.

## 📊 Mock Dataset

The `data/mock_papers.json` contains 10 curated papers:
- 5 papers on Metformin + Alzheimer's
- 5 papers on other drugs/diseases for variety

Each paper includes:
- Title
- Abstract (realistic medical content)
- Link (mock PubMed URLs)

## 🎨 Frontend Features

- **Clean, modern UI** with gradient design
- **Loading states** with spinner animation
- **Card-based layout** for papers and summaries
- **Formatted report display** with sections
- **Responsive design** for mobile/desktop
- **Error handling** with user-friendly messages

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your-gemini-key-here
```

Or export directly:
```bash
export GEMINI_API_KEY='your-gemini-key-here'
```

## 📦 Dependencies

### Backend
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `google-generativeai` - Google Gemini API client
- `langgraph` - Agent orchestration
- `langchain` - LLM framework
- `pydantic` - Data validation

### Frontend
- `react` - UI library
- `vite` - Build tool
- Modern CSS with gradients and animations

## 🎯 Example Output

**Input:**
- Drug: Metformin
- Disease: Alzheimer's

**Output:**
1. **Papers Found**: 5 relevant papers
2. **Summaries**: AI-generated key findings with relevance scores
3. **Final Report**:
   - Executive Summary
   - Evidence Overview
   - Potential Benefits & Risks
   - Conclusion (Should this be investigated further?)

## 🚧 Future Enhancements

- [ ] Real PubMed API integration
- [ ] PDF export functionality
- [ ] User authentication
- [ ] Results caching
- [ ] More sophisticated ranking algorithms
- [ ] Clinical trial data integration
- [ ] Interactive graph visualization
- [ ] Batch processing for multiple drugs

## 🐛 Troubleshooting

**Issue**: Backend fails to start
- **Solution**: Ensure all dependencies are installed and Gemini API key is set

**Issue**: Frontend can't connect to backend
- **Solution**: Check CORS settings and ensure backend is running on port 8000

**Issue**: No papers found
- **Solution**: Try "Metformin" + "Alzheimer's" which are in the mock dataset

## 📝 License

MIT License - Feel free to use for your hackathon or learning purposes!

## 🤝 Contributing

This is a hackathon prototype. Feel free to fork and enhance!

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Built with ❤️ for pharmaceutical innovation and AI-powered drug repurposing**
