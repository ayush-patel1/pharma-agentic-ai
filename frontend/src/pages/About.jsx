import './About.css'

export default function About() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <h1 className="page-title fade-in">About NeuroRepurpose AI</h1>
          <p className="page-subtitle fade-in">
            A cutting-edge multi-agent research platform powered by LangGraph and Google Gemini AI
          </p>
        </div>
      </section>

      {/* Overview Section */}
      <section className="overview-section">
        <div className="container">
          <div className="content-grid">
            <div className="content-text">
              <h2>What is Drug Repurposing?</h2>
              <p>
                Drug repurposing (also called drug repositioning) is the process of finding new therapeutic uses for existing, approved drugs. This approach offers significant advantages over traditional drug development:
              </p>
              <ul>
                <li><strong>Faster development:</strong> Repurposed drugs have already passed safety trials</li>
                <li><strong>Lower costs:</strong> Reduces R&D expenses by billions of dollars</li>
                <li><strong>Higher success rates:</strong> Known safety profiles reduce clinical trial risks</li>
                <li><strong>Faster patient access:</strong> Can reach patients years sooner than new drugs</li>
              </ul>
            </div>
            <div className="content-visual card">
              <div className="stat-box">
                <div className="stat-big">90%</div>
                <div className="stat-label">Cost Reduction vs. New Drug Development</div>
              </div>
              <div className="stat-box">
                <div className="stat-big">3-12 years</div>
                <div className="stat-label">Faster Than Traditional Development</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="architecture-section">
        <div className="container">
          <h2 className="section-title">Platform Architecture</h2>
          <p className="section-subtitle">
            Multi-agent workflow orchestrated by LangGraph
          </p>
          
          <div className="architecture-diagram card">
            <div className="arch-flow">
              <div className="arch-node user-node">
                <div className="node-icon">👤</div>
                <div className="node-title">User Input</div>
                <div className="node-desc">Drug + Disease</div>
              </div>
              
              <div className="arch-arrow">↓</div>
              
              <div className="arch-node api-node">
                <div className="node-icon">⚡</div>
                <div className="node-title">FastAPI Backend</div>
                <div className="node-desc">Request Processing</div>
              </div>
              
              <div className="arch-arrow">↓</div>
              
              <div className="arch-agents">
                <div className="agent-box master-agent">
                  <div className="agent-icon">🎯</div>
                  <div className="agent-name">Master Agent</div>
                  <div className="agent-role">Orchestration</div>
                </div>
                
                <div className="agent-connections">
                  <div className="agent-box search-agent">
                    <div className="agent-icon">🔍</div>
                    <div className="agent-name">Search Agent</div>
                    <div className="agent-role">Literature Retrieval</div>
                  </div>
                  
                  <div className="agent-box summary-agent">
                    <div className="agent-icon">✨</div>
                    <div className="agent-name">Summarizer Agent</div>
                    <div className="agent-role">AI Analysis (Gemini)</div>
                  </div>
                  
                  <div className="agent-box report-agent">
                    <div className="agent-icon">📊</div>
                    <div className="agent-name">Report Agent</div>
                    <div className="agent-role">Final Report</div>
                  </div>
                </div>
              </div>
              
              <div className="arch-arrow">↓</div>
              
              <div className="arch-node output-node">
                <div className="node-icon">📄</div>
                <div className="node-title">Comprehensive Report</div>
                <div className="node-desc">Clinical Assessment + PDF Export</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="technology-section">
        <div className="container">
          <h2 className="section-title">Technology Stack</h2>
          
          <div className="tech-details-grid">
            <div className="tech-detail-card card">
              <div className="tech-card-icon">🔗</div>
              <h3>LangGraph</h3>
              <p>
                Multi-agent orchestration framework that enables complex, stateful AI workflows with specialized agents working in coordination.
              </p>
            </div>
            
            <div className="tech-detail-card card">
              <div className="tech-card-icon">✨</div>
              <h3>Google Gemini AI</h3>
              <p>
                Advanced large language model (gemini-1.5-flash) that generates expert-level biomedical summaries and clinical insights.
              </p>
            </div>
            
            <div className="tech-detail-card card">
              <div className="tech-card-icon">⚡</div>
              <h3>FastAPI</h3>
              <p>
                High-performance Python backend framework with automatic API documentation and async request handling.
              </p>
            </div>
            
            <div className="tech-detail-card card">
              <div className="tech-card-icon">⚛️</div>
              <h3>React + Vite</h3>
              <p>
                Modern frontend stack with fast build times, hot module replacement, and responsive UI components.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="use-cases-section">
        <div className="container">
          <h2 className="section-title">Use Cases</h2>
          
          <div className="use-cases-grid">
            <div className="use-case-card card">
              <div className="use-case-icon">🏥</div>
              <h3>Clinical Research</h3>
              <p>Identify repurposing candidates for rare diseases and unmet medical needs</p>
            </div>
            
            <div className="use-case-card card">
              <div className="use-case-icon">🧪</div>
              <h3>Pharmaceutical R&D</h3>
              <p>Accelerate drug discovery pipelines with AI-powered literature analysis</p>
            </div>
            
            <div className="use-case-card card">
              <div className="use-case-icon">📚</div>
              <h3>Academic Research</h3>
              <p>Automated systematic literature reviews for drug mechanism studies</p>
            </div>
            
            <div className="use-case-card card">
              <div className="use-case-icon">💡</div>
              <h3>Biotech Innovation</h3>
              <p>Discover novel therapeutic applications for existing drug compounds</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta-section">
        <div className="container">
          <div className="cta-box card">
            <h2>Ready to Explore Drug Repurposing?</h2>
            <p>Try our AI-powered analysis platform with any drug and disease combination</p>
            <a href="/analyzer" className="btn-cta">Start Free Analysis</a>
          </div>
        </div>
      </section>
    </div>
  )
}
