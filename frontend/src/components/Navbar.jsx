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
    <>
      {/* Skip link for keyboard navigation */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <nav className="site-navbar" aria-label="Main navigation">
        <div className="container navbar-inner">

          {/* Brand */}
          <Link to="/" className="navbar-brand" aria-label="NeuroRepurpose AI — home">
            <div className="brand-logo-mark" aria-hidden="true">
              <svg viewBox="0 0 36 36" width="32" height="32" className="brand-svg" aria-hidden="true">
                <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(59,130,246,0.2)" strokeWidth="1.5" />
                <circle cx="18" cy="18" r="10" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="4 3" className="rotating-orbit" />
                <circle cx="18" cy="18" r="4.5" fill="#3B82F6" className="core-pulse" />
                <circle cx="18" cy="3" r="2.5" fill="#10B981" />
                <circle cx="33" cy="18" r="2.5" fill="#8B5CF6" />
              </svg>
            </div>
            <div className="brand-text-block">
              <div className="brand-title-row">
                <span className="brand-name">Neuro<span className="brand-highlight">Repurpose</span></span>
                <span className="brand-version-tag">AI</span>
              </div>
              <span className="brand-sub">Precision Pharma Intelligence</span>
            </div>
          </Link>

          {/* Navigation links */}
          <div className="navbar-nav-links" role="list">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-menu-link ${isActive ? 'is-active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  role="listitem"
                >
                  <span>{item.label}</span>
                  {isActive && <span className="nav-active-indicator" aria-hidden="true" />}
                </Link>
              )
            })}
          </div>

          {/* CTA */}
          <div className="navbar-right-actions">
            <Link to="/analyzer" className="btn btn-primary btn-sm" aria-label="Launch Drug Analyzer">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              <span>Launch Analyzer</span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  )
}
