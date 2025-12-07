import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const location = useLocation()
  
  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">🧬</div>
          <div className="brand-text">
            <span className="brand-name">NeuroRepurpose AI</span>
            <span className="brand-tagline">Multi-Agent Research Platform</span>
          </div>
        </Link>
        
        <div className="navbar-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
          >
            About
          </Link>
          <Link 
            to="/analyzer" 
            className={`nav-link ${location.pathname === '/analyzer' ? 'active' : ''}`}
          >
            Analyzer
          </Link>
          <a 
            href="https://github.com/ayush-patel1/pharma-agentic-ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="nav-link"
          >
            GitHub
          </a>
        </div>
        
        <Link to="/analyzer" className="btn-primary">
          Start Analysis
        </Link>
      </div>
    </nav>
  )
}
