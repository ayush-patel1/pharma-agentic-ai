import { Link } from 'react-router-dom'
import './Home.css'

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text fade-in">
            <h1 className="hero-title">
              <span className="gradient-text">NeuroRepurpose AI</span>
            </h1>
            <p className="hero-subtitle">
              Transforming drug discovery with multi-agent intelligence and automated biomedical research.
            </p>
            <div className="hero-buttons">
              <Link to="/analyzer" className="btn-hero-primary">
                Start Analysis
                <span>→</span>
              </Link>
              <Link to="/about" className="btn-hero-secondary">
                Learn More
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">4</div>
                <div className="stat-label">AI Agents</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100+</div>
                <div className="stat-label">Papers Analyzed</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">10s</div>
                <div className="stat-label">Analysis Time</div>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-card card-1">
              <div className="card-icon">🧬</div>
              <div>Neural Networks</div>
            </div>
            <div className="floating-card card-2">
              <div className="card-icon">💊</div>
              <div>Drug Molecules</div>
            </div>
            <div className="floating-card card-3">
              <div className="card-icon">📄</div>
              <div>Research Papers</div>
            </div>
            <div className="gradient-orb orb-1"></div>
            <div className="gradient-orb orb-2"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Intelligent Research Automation</h2>
          <p className="section-subtitle">
            Powered by cutting-edge AI agents and biomedical NLP
          </p>
          
          <div className="features-grid">
            <div className="feature-card card fade-in">
              <div className="feature-icon">🤖</div>
              <h3 className="feature-title">Multi-Agent Intelligence</h3>
              <p className="feature-description">
                Master agent orchestrates specialized agents for search, summarization, and report generation.
              </p>
            </div>
            <div className="feature-card card fade-in" style={{animationDelay: '0.1s'}}>
              <div className="feature-icon">🔍</div>
              <h3 className="feature-title">Automated Literature Mining</h3>
              <p className="feature-description">
                Advanced search algorithms retrieve relevant biomedical research papers from scientific databases.
              </p>
            </div>
            <div className="feature-card card fade-in" style={{animationDelay: '0.2s'}}>
              <div className="feature-icon">✨</div>
              <h3 className="feature-title">LLM-Powered Summaries</h3>
              <p className="feature-description">
                Google Gemini AI generates expert-level pharmacological summaries and insights.
              </p>
            </div>
            <div className="feature-card card fade-in" style={{animationDelay: '0.3s'}}>
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Scientific Report Generator</h3>
              <p className="feature-description">
                Comprehensive drug repurposing assessment reports with clinical feasibility analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Three simple steps to comprehensive drug repurposing analysis
          </p>
          
          <div className="steps-grid">
            <div className="step-card card">
              <div className="step-number">1</div>
              <h3>Enter Drug + Disease</h3>
              <p>Input the drug name and target disease you want to analyze for repurposing potential.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-card card">
              <div className="step-number">2</div>
              <h3>AI Agents Process</h3>
              <p>Multi-agent system searches, extracts, and summarizes relevant scientific literature.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-card card">
              <div className="step-number">3</div>
              <h3>Get Comprehensive Report</h3>
              <p>Receive detailed repurposing assessment with clinical insights and safety analysis.</p>
            </div>
          </div>
          
          <div className="cta-section">
            <Link to="/analyzer" className="btn-cta">
              Try It Now - Free Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="tech-stack">
        <div className="container">
          <h2 className="section-title">Built With Cutting-Edge Technology</h2>
          <div className="tech-grid">
            <div className="tech-item">
              <div className="tech-logo">🔗</div>
              <div className="tech-name">LangGraph</div>
            </div>
            <div className="tech-item">
              <div className="tech-logo">✨</div>
              <div className="tech-name">Google Gemini</div>
            </div>
            <div className="tech-item">
              <div className="tech-logo">⚡</div>
              <div className="tech-name">FastAPI</div>
            </div>
            <div className="tech-item">
              <div className="tech-logo">⚛️</div>
              <div className="tech-name">React</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
