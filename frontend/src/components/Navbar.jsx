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
            <span className="brand-name">NeuroRepurpose</span>
            <span className="brand-tagline">Drug research workspace</span>
          </div>
        </Link>
        
        <div className="navbar-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Workspace
          </Link>
          <Link 
            to="/about" 
            className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
          >
            Methodology
          </Link>
          <Link 
            to="/analyzer" 
            className={`nav-link ${location.pathname === '/analyzer' ? 'active' : ''}`}
          >
            Analyze
          </Link>
          <Link to="/#faq" className="nav-link">FAQ</Link>
        </div>
        
        <Link to="/analyzer" className="btn btn-primary">
          New analysis
        </Link>
      </div>
    </nav>
  )
}
