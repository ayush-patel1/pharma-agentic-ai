import { Link } from 'react-router-dom'
import './Home.css'

export default function Home() {
  return (
    <div className="home-page animate-fade-in">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text">
            <div className="hero-badge">🧬 Clinical Discovery Suite</div>
            <h1 className="hero-title">
              Accelerate <span className="gradient-text">Drug Repurposing</span> with AI Intelligence
            </h1>
            <p className="hero-subtitle">
              Scan scientific literature, map novel compound indications, and compile executive-ready feasibility reports in seconds.
            </p>
            <div className="hero-buttons">
              <Link to="/analyzer" className="btn btn-primary">
                Open Research Analyzer
                <span className="arrow-icon">→</span>
              </Link>
              <Link to="/about" className="btn btn-secondary">
                See Platform Overview
              </Link>
            </div>
            
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">4x</div>
                <div className="stat-label">Discovery Channels</div>
              </div>
              <div className="stat-item border-left">
                <div className="stat-number">10x</div>
                <div className="stat-label">Faster Synthesis</div>
              </div>
              <div className="stat-item border-left">
                <div className="stat-number">100%</div>
                <div className="stat-label">Auditable Evidence</div>
              </div>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="dna-helix-outer">
              <div className="dna-helix-container">
                <div className="dna-helix">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="dna-pair" style={{ '--index': i }}>
                      <div className="dna-node node-a"></div>
                      <div className="dna-bar"></div>
                      <div className="dna-node node-b"></div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="floating-card card-1 animate-pulse-glow">
                <div className="card-icon">🧠</div>
                <div className="card-details">
                  <h5>Insights Engine</h5>
                  <p>Coordinated Clinical Search</p>
                </div>
              </div>
              
              <div className="floating-card card-2 animate-pulse-teal">
                <div className="card-icon">💊</div>
                <div className="card-details">
                  <h5>Metformin</h5>
                  <p>Target: Alzheimer's</p>
                </div>
              </div>
            </div>
            
            <div className="gradient-orb orb-1"></div>
            <div className="gradient-orb orb-2"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Intelligent Repurposing Pipeline</h2>
            <p className="section-subtitle">
              Our automated research pipeline acts as a 24/7 scientific associate, distilling literature databases into actionable drug development roadmaps.
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card glass-panel-glow">
              <div className="feature-icon">🔍</div>
              <h3 className="feature-title">Target Literature Mining</h3>
              <p className="feature-description">
                Scans clinical trial archives and scientific libraries for hidden connections between compounds and diseases.
              </p>
            </div>
            <div className="feature-card glass-panel">
              <div className="feature-icon">🛡️</div>
              <h3 className="feature-title">Safety & Toxicity Screen</h3>
              <p className="feature-description">
                Cross-references active safety profiles and prior FDA approvals to flag commercialization risks early.
              </p>
            </div>
            <div className="feature-card glass-panel">
              <div className="feature-icon">✨</div>
              <h3 className="feature-title">Efficacy Summarization</h3>
              <p className="feature-description">
                Distills complex trial findings, dosage effects, and therapeutic outcomes into concise, expert-level summaries.
              </p>
            </div>
            <div className="feature-card glass-panel">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Scientific Report Generator</h3>
              <p className="feature-description">
                Assembles a publication-ready repurposing monograph, including commercial opportunity and regulatory path projections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Workflow Overview</h2>
            <p className="section-subtitle">
              Simple steps to generate a comprehensive pharmacological evaluation.
            </p>
          </div>
          
          <div className="steps-container">
            <div className="step-card-new glass-panel">
              <div className="step-badge">01</div>
              <div className="step-content-box">
                <h4>Specify Compounds</h4>
                <p>Input target drug compounds and indications, or simply upload a PDF study to analyze.</p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="step-card-new glass-panel">
              <div className="step-badge">02</div>
              <div className="step-content-box">
                <h4>Pipeline Analysis</h4>
                <p>The platform extracts, filters, and analyzes relevant data points, updating logs in real time.</p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="step-card-new glass-panel">
              <div className="step-badge">03</div>
              <div className="step-content-box">
                <h4>Review Monograph</h4>
                <p>Download structured clinical monographs, evaluate safety scores, and map development timelines.</p>
              </div>
            </div>
          </div>
          
          <div className="cta-section">
            <Link to="/analyzer" className="btn btn-primary btn-lg">
              Start Your First Analysis
              <span className="arrow-icon">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Integrity & Compliance Section */}
      <section className="tech-stack">
        <div className="container">
          <h3 className="tech-title-mini">COMPLIANCE & INTEGRITY STANDARDS</h3>
          <div className="tech-logos-grid">
            <div className="tech-logo-item">
              <span className="tech-emoji">🛡️</span>
              <span>Secure Data Handling</span>
            </div>
            <div className="tech-logo-item">
              <span className="tech-emoji">📄</span>
              <span>Fully Auditable Citations</span>
            </div>
            <div className="tech-logo-item">
              <span className="tech-emoji">⚖️</span>
              <span>Regulatory Path Alignment</span>
            </div>
            <div className="tech-logo-item">
              <span className="tech-emoji">🔬</span>
              <span>Clinical Method Verification</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
