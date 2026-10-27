import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer" aria-label="Site footer">
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">

            {/* Column 1: Brand */}
            <div className="footer-brand">
              <Link to="/" className="footer-brand-link" aria-label="NeuroRepurpose AI — home">
                <svg viewBox="0 0 36 36" width="28" height="28" aria-hidden="true">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(59,130,246,0.25)" strokeWidth="1.5" />
                  <circle cx="18" cy="18" r="4.5" fill="#3B82F6" />
                  <circle cx="18" cy="3" r="2.5" fill="#10B981" />
                  <circle cx="33" cy="18" r="2.5" fill="#8B5CF6" />
                </svg>
                <span className="footer-logo-text">
                  Neuro<span className="accent">Repurpose</span>
                  <span className="tag">AI</span>
                </span>
              </Link>

              <p className="footer-tagline">
                Autonomous multi-agent drug repurposing intelligence powered by 38M+ biomedical publications.
              </p>

              <div className="footer-badges">
                <span className="footer-badge">FDA 505(b)(2)</span>
                <span className="footer-badge">PubMed + Europe PMC</span>
                <span className="footer-badge">WCAG 2.1 AA</span>
              </div>
            </div>

            {/* Column 2: Platform links */}
            <nav className="footer-nav-col" aria-label="Platform navigation">
              <h3 className="footer-nav-heading">Platform</h3>
              <Link to="/workspace">Research Workspace</Link>
              <Link to="/analyzer">Drug Analyzer</Link>
              <Link to="/evidence">Evidence Matrix</Link>
              <Link to="/chat">Research Chat</Link>
              <Link to="/graph">Knowledge Graph</Link>
              <Link to="/reports">Reports</Link>
            </nav>

            {/* Column 3: Research links */}
            <nav className="footer-nav-col" aria-label="Research resources navigation">
              <h3 className="footer-nav-heading">Research</h3>
              <Link to="/about">Methodology</Link>
              <a href="https://pubmed.ncbi.nlm.nih.gov/" target="_blank" rel="noopener noreferrer">PubMed Database</a>
              <a href="https://europepmc.org/" target="_blank" rel="noopener noreferrer">Europe PMC</a>
              <a href="https://www.fda.gov/drugs/types-applications/505b2-applications" target="_blank" rel="noopener noreferrer">FDA 505(b)(2) Pathway</a>
              <Link to="/about#faq">Frequently Asked Questions</Link>
            </nav>

            {/* Column 4: Disclaimer */}
            <div className="footer-nav-col">
              <h3 className="footer-nav-heading">Disclaimer</h3>
              <p className="footer-disclaimer-text">
                NeuroRepurpose AI is a research exploration tool designed for biomedical researchers and regulatory teams.
              </p>
              <div className="disclaimer-warning" role="note" aria-label="Important disclaimer">
                <svg className="disclaimer-warning-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <p>
                  All AI-generated outputs must be validated against primary publications. Not for clinical decision-making.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-inner">
            <p className="footer-copyright">
              &copy; {currentYear} NeuroRepurpose AI. Research instrument — verify all sources.
            </p>
            <div className="footer-legal-links">
              <Link to="/about">About</Link>
              <Link to="/about#methodology">Methodology</Link>
              <span className="footer-not-medical">NOT MEDICAL ADVICE</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
