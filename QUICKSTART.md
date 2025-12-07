# 🚀 Quick Start Guide

## Prerequisites Checklist

- [ ] Python 3.9+ installed (`python3 --version`)
- [ ] Node.js 18+ installed (`node --version`)
- [ ] Google Gemini API key ready
- [ ] Terminal access

## Setup (5 minutes)

### Option 1: Automated Setup
```bash
cd pharma-agentic-langgraph
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Setup

**Backend:**
```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set API key
export GEMINI_API_KEY='your-gemini-api-key-here'
```

**Frontend:**
```bash
cd frontend
npm install
cd ..
```

## Running the Application

### Terminal 1 - Backend
```bash
# From project root
./run_backend.sh

# OR manually:
source venv/bin/activate
cd backend
uvicorn main:app --reload
```

Backend: http://localhost:8000  
API Docs: http://localhost:8000/docs

### Terminal 2 - Frontend
```bash
# From project root
./run_frontend.sh

# OR manually:
cd frontend
npm run dev
```

Frontend: http://localhost:3000

## Testing

### 1. UI Test (Recommended)
1. Open http://localhost:3000
2. Enter:
   - Drug: `Metformin`
   - Disease: `Alzheimer's`
3. Click "Run Analysis"
4. Wait ~20 seconds
5. See results!

### 2. API Test (cURL)
```bash
curl -X POST "http://localhost:8000/run" \
  -H "Content-Type: application/json" \
  -d '{
    "drug": "Metformin",
    "disease": "Alzheimer'"'"'s"
  }'
```

### 3. API Test (Python)
```python
import requests

response = requests.post(
    "http://localhost:8000/run",
    json={"drug": "Metformin", "disease": "Alzheimer's"}
)

result = response.json()
print(f"Found {len(result['papers'])} papers")
print(f"Generated {len(result['summaries'])} summaries")
print(f"Report: {result['final_report'][:200]}...")
```

## Troubleshooting

### Backend won't start
```bash
# Check Python version
python3 --version  # Should be 3.9+

# Check if port 8000 is in use
lsof -i :8000

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Frontend won't start
```bash
# Check Node version
node --version  # Should be 18+

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check if port 3000 is in use
lsof -i :3000
```

### API key errors
```bash
# Verify API key is set
echo $GEMINI_API_KEY

# Set it in current session
export GEMINI_API_KEY='your-gemini-api-key-here'

# Or create .env file in project root
echo "GEMINI_API_KEY=your-gemini-api-key-here" > .env
```

### CORS errors
- Ensure backend is running on port 8000
- Check CORS settings in `backend/main.py`
- Frontend must use http://localhost:8000 (not 127.0.0.1)

### No papers found
- Use "Metformin" + "Alzheimer's" (these are in mock dataset)
- Check `data/mock_papers.json` exists
- Verify case-insensitive matching in `tools.py`

## Example Queries

| Drug | Disease | Expected Papers |
|------|---------|----------------|
| Metformin | Alzheimer's | 5 papers |
| Metformin | Alzheimer | 5 papers |
| Aspirin | Cardiovascular | 1 paper |
| Statin | Alzheimer | 1 paper |

## Project Structure Quick Reference

```
pharma-agentic-langgraph/
├── backend/
│   ├── main.py          → FastAPI app (start here)
│   ├── graph.py         → LangGraph agents
│   ├── tools.py         → Search & LLM tools
│   └── models.py        → Data models
├── data/
│   └── mock_papers.json → 10 papers dataset
├── frontend/
│   └── src/
│       ├── App.jsx      → Main UI component
│       └── App.css      → Styling
├── setup.sh             → Automated setup
├── run_backend.sh       → Run backend
└── run_frontend.sh      → Run frontend
```

## API Endpoints

### POST /run
Execute drug repurposing analysis

**Request:**
```json
{
  "drug": "Metformin",
  "disease": "Alzheimer's"
}
```

**Response:**
```json
{
  "drug": "Metformin",
  "disease": "Alzheimer's",
  "papers": [
    {
      "title": "Paper title",
      "abstract": "Abstract text...",
      "link": "https://..."
    }
  ],
  "summaries": [
    {
      "title": "Paper title",
      "summary_raw": "AI summary...",
      "link": "https://..."
    }
  ],
  "final_report": "Executive Summary..."
}
```

### GET /
API information

### GET /docs
Interactive API documentation (Swagger UI)

## Performance Notes

- **First request**: ~20-30 seconds (LLM processing)
- **Subsequent requests**: Similar (no caching yet)
- **Papers retrieved**: Up to 5
- **Summaries generated**: 1 per paper
- **Final report**: 1 comprehensive report

## Development Tips

### Add a new agent
Edit `backend/graph.py`:
```python
def my_agent(state: GraphState) -> GraphState:
    # Your logic here
    return state

graph.add_node("myagent", my_agent)
graph.add_edge("previous_agent", "myagent")
```

### Modify mock data
Edit `data/mock_papers.json` - add more papers with:
```json
{
  "title": "Paper title",
  "abstract": "Abstract text with drug and disease keywords",
  "link": "https://pubmed.ncbi.nlm.nih.gov/12345"
}
```

### Change LLM model
Edit `backend/tools.py` and `backend/graph.py`:
```python
model = genai.GenerativeModel('gemini-1.5-pro')  # Instead of gemini-pro
```

### Customize UI
Edit `frontend/src/App.css` for styling
Edit `frontend/src/App.jsx` for behavior

## Next Steps for Hackathon

1. **Test the system** with example queries
2. **Customize the prompt** in `tools.py` for better summaries
3. **Add more mock papers** to `mock_papers.json`
4. **Style the frontend** to match your theme
5. **Create slides** showing the architecture
6. **Practice the demo** - should take 3-5 minutes
7. **Prepare to explain** the agent workflow

## Demo Script (3 minutes)

1. **Introduction** (30s)
   - "Multi-agent system for drug repurposing"
   - "Uses LangGraph to orchestrate specialized AI agents"

2. **Architecture** (60s)
   - Show ARCHITECTURE.md diagram
   - Explain: Master → Search → Summarizer → Reporter

3. **Live Demo** (90s)
   - Open UI at localhost:3000
   - Enter: Metformin + Alzheimer's
   - Click "Run Analysis"
   - Show: Papers → Summaries → Report

4. **Technical Highlights** (30s)
   - LangGraph for agent orchestration
   - OpenAI for intelligent summarization
   - FastAPI + React for modern stack

## Resources

- LangGraph docs: https://python.langchain.com/docs/langgraph
- Google Gemini API: https://ai.google.dev/docs
- FastAPI docs: https://fastapi.tiangolo.com
- React docs: https://react.dev

---

**Good luck with your hackathon! 🚀**
