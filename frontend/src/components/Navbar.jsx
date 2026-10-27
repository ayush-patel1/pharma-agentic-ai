import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const location = useLocation()
  
  return (
    <nav className="quantum-navbar">
      <div className="container navbar-content">
        
        {/* Left: Logo with rotating military reticle icon */}
        <Link to="/" className="navbar-brand">
          <div className="reticle-icon-box" aria-hidden="true">
            <svg className="rotating-reticle" viewBox="0 0 40 40" width="32" height="32">
              <circle cx="20" cy="20" r="16" fill="none" stroke="#00F0FF" strokeWidth="1.5" strokeDasharray="6 4" />
              <circle cx="20" cy="20" r="9" fill="none" stroke="#00F0FF" strokeWidth="1" />
              <line x1="20" y1="2" x2="20" y2="10" stroke="#00F0FF" strokeWidth="2" />
              <line x1="20" y1="30" x2="20" y2="38" stroke="#00F0FF" strokeWidth="2" />
              <line x1="2" y1="20" x2="10" y2="20" stroke="#00F0FF" strokeWidth="2" />
              <line x1="30" y1="20" x2="38" y2="20" stroke="#00F0FF" strokeWidth="2" />
              <circle cx="20" cy="20" r="2.5" fill="#FF2A2A" />
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-title">NEURO<span className="text-cyan-glow">QUANTUM</span></span>
            <span className="brand-subtitle">[ BIOMETRIC RESEARCH ]</span>
          </div>
        </Link>
        
        {/* Center: Nav links in JetBrains Mono wrapped in [ LINK ] */}
        <div className="navbar-links">
          <Link 
            to="/workspace" 
            className={`quantum-nav-link ${location.pathname === '/workspace' ? 'active' : ''}`}
          >
            [ WORKSPACE ]
          </Link>
          <Link 
            to="/analyzer" 
            className={`quantum-nav-link ${location.pathname === '/analyzer' ? 'active' : ''}`}
          >
            [ ANALYZER ]
          </Link>
          <Link 
            to="/evidence" 
            className={`quantum-nav-link ${location.pathname === '/evidence' ? 'active' : ''}`}
          >
            [ EVIDENCE ]
          </Link>
          <Link 
            to="/chat" 
            className={`quantum-nav-link ${location.pathname === '/chat' ? 'active' : ''}`}
          >
            [ CHATBOT ]
          </Link>
          <Link 
            to="/graph" 
            className={`quantum-nav-link ${location.pathname === '/graph' ? 'active' : ''}`}
          >
            [ TARGET GRAPH ]
          </Link>
          <Link 
            to="/reports" 
            className={`quantum-nav-link ${location.pathname === '/reports' ? 'active' : ''}`}
          >
            [ REPORTS ]
          </Link>
        </div>
        
        {/* Right: Small cyber-cut button in cyan */}
        <div className="navbar-actions">
          <Link to="/analyzer" className="btn btn-primary btn-sm cyber-btn-nav">
            [ INITIATE SCAN ]
          </Link>
        </div>
      </div>
    </nav>
  )
}
