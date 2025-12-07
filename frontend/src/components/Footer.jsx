import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-section footer-brand">
          <div className="footer-logo">
            <span className="logo-icon">🧬</span>
            <h4>NeuroRepurpose AI</h4>
          </div>
          <p>Multi-agent research platform powered by LangGraph for AI-driven drug repurposing and biomedical literature analysis.</p>
          <div className="social-links">
            <a href="https://github.com/ayushdev2/pharma-agentic-ai" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Technology</h4>
          <ul>
            <li>🤖 LangGraph Multi-Agent</li>
            <li>✨ Google Gemini AI</li>
            <li>⚡ FastAPI Backend</li>
            <li>⚛️ React + Vite</li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Resources</h4>
          <ul>
            <li><a href="https://github.com/ayushdev2/pharma-agentic-ai" target="_blank" rel="noopener noreferrer">📦 Repository</a></li>
            <li><a href="https://github.com/ayushdev2/pharma-agentic-ai/blob/main/README.md" target="_blank" rel="noopener noreferrer">📚 Documentation</a></li>
            <li><a href="https://github.com/ayushdev2/pharma-agentic-ai/blob/main/ARCHITECTURE.md" target="_blank" rel="noopener noreferrer">🏗️ Architecture</a></li>
            <li><a href="https://github.com/ayushdev2/pharma-agentic-ai/blob/main/DEPLOY_GUIDE.md" target="_blank" rel="noopener noreferrer">🚀 Deploy Guide</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">🏠 Home</a></li>
            <li><a href="/analyzer">🔬 Analyzer</a></li>
            <li><a href="/about">ℹ️ About</a></li>
            <li><a href="https://github.com/ayushdev2/pharma-agentic-ai/issues" target="_blank" rel="noopener noreferrer">🐛 Report Issue</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p>&copy; {new Date().getFullYear()} NeuroRepurpose AI. Built with ❤️ using LangGraph & Gemini.</p>
          <div className="footer-links">
            <a href="https://github.com/ayushdev2" target="_blank" rel="noopener noreferrer">Made by Ayush</a>
            <span className="divider">•</span>
            <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer">MIT License</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
