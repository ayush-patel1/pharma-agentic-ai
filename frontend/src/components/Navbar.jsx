import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const location = useLocation()
  
  const navItems = [
    { label: 'Workspace', path: '/workspace' },
    { label: 'Drug Analyzer', path: '/analyzer' },
    { label: 'Evidence Matrix', path: '/evidence' },
    { label: 'Research Chat', path: '/chat' },
    { label: 'Target Graph', path: '/graph' },
    { label: 'Reports', path: '/reports' },
    { label: 'About', path: '/about' },
  ]

  return (
    <nav className="site-navbar">
      <div className="container navbar-inner">
        
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <div className="brand-logo-mark" aria-hidden="true">
            <svg viewBox="0 0 36 36" width="32" height="32" className="brand-svg">
              <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(0, 229, 255, 0.2)" strokeWidth="1.5" />
              <circle cx="18" cy="18" r="10" fill="none" stroke="#00E5FF" strokeWidth="1.5" strokeDasharray="4 3" className="rotating-orbit" />
              <circle cx="18" cy="18" r="4.5" fill="#00E5FF" className="core-pulse" />
              <circle cx="18" cy="3" r="2.5" fill="#10B981" />
              <circle cx="33" cy="18" r="2.5" fill="#8B5CF6" />
            </svg>
          </div>
          <div className="brand-text-block">
            <div className="brand-title-row">
              <span className="brand-name">NEURO<span className="brand-highlight">REPURPOSE</span></span>
              <span className="brand-version-tag">AI v2.0</span>
            </div>
            <span className="brand-sub">PRECISION PHARMA INTELLIGENCE</span>
          </div>
        </Link>
        
        {/* Navigation Items */}
        <div className="navbar-nav-links">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link 
                key={item.path}
                to={item.path} 
                className={`nav-menu-link ${isActive ? 'is-active' : ''}`}
              >
                <span>{item.label}</span>
                {isActive && <span className="nav-active-indicator" />}
              </Link>
            )
          })}
        </div>
        
        {/* Right Action */}
        <div className="navbar-right-actions">
          <Link to="/analyzer" className="btn btn-primary btn-sm">
            <span>Launch Engine</span>
            <span aria-hidden="true" style={{ fontSize: '1rem', lineHeight: 1 }}>↗</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
