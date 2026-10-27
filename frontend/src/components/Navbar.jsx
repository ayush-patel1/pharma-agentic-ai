import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const location = useLocation()
  
  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon" aria-hidden="true">
            <span className="brand-shape brand-circle" />
            <span className="brand-shape brand-square" />
            <span className="brand-shape brand-triangle" />
          </div>
          <div className="brand-text">
            <span className="brand-name">NeuroRepurpose AI</span>
            <span className="brand-tagline">Biomedical Intelligence Suite</span>
          </div>
        </Link>
        
        <div className="navbar-links">
          <Link 
            to="/workspace" 
            className={`nav-link ${location.pathname === '/workspace' ? 'active' : ''}`}
          >
            Workspace
          </Link>
          <Link 
            to="/analyzer" 
            className={`nav-link ${location.pathname === '/analyzer' ? 'active' : ''}`}
          >
            Analyzer
          </Link>
          <Link 
            to="/evidence" 
            className={`nav-link ${location.pathname === '/evidence' ? 'active' : ''}`}
          >
            Evidence Explorer
          </Link>
          <Link 
            to="/chat" 
            className={`nav-link ${location.pathname === '/chat' ? 'active' : ''}`}
          >
            Research Chat
          </Link>
          <Link 
            to="/graph" 
            className={`nav-link ${location.pathname === '/graph' ? 'active' : ''}`}
          >
            Target Graph
          </Link>
          <Link 
            to="/reports" 
            className={`nav-link ${location.pathname === '/reports' ? 'active' : ''}`}
          >
            Reports
          </Link>
          <Link 
            to="/about" 
            className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
          >
            Methodology
          </Link>
        </div>
        
        <Link to="/analyzer" className="btn btn-primary nav-cta-btn">
          🔬 Launch Analysis
        </Link>
      </div>
    </nav>
  )
}
