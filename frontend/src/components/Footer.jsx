import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-section">
          <h4>NeuroRepurpose AI</h4>
          <p>Multi-agent research platform for AI-driven drug repurposing and biomedical literature analysis.</p>
        </div>
        
        <div className="footer-section">
          <h4>Technology</h4>
          <ul>
            <li>LangGraph Multi-Agent System</li>
            <li>Google Gemini AI</li>
            <li>FastAPI Backend</li>
            <li>React Frontend</li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Resources</h4>
          <ul>
            <li><a href="https://github.com/ayushdev2/pharma-agentic-ai" target="_blank" rel="noopener noreferrer">GitHub Repository</a></li>
            <li><a href="https://github.com/ayushdev2/pharma-agentic-ai/blob/main/README.md" target="_blank" rel="noopener noreferrer">Documentation</a></li>
            <li><a href="https://github.com/ayushdev2/pharma-agentic-ai/blob/main/ARCHITECTURE.md" target="_blank" rel="noopener noreferrer">Architecture</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} NeuroRepurpose AI. Built with LangGraph & Gemini.</p>
        </div>
      </div>
    </footer>
  )
}
