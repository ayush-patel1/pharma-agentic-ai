import './About.css'

export default function About() {
  return (
    <div className="about-page animate-fade-in">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-badge">PLATFORM INTEL</div>
          <h1 className="page-title">About NeuroRepurpose AI</h1>
          <p className="page-subtitle">
            A state-of-the-art multi-agent research platform orchestrating Google Gemini AI and LangGraph.
          </p>
        </div>
      </section>

      {/* Clinical Challenge Section */}
      <section className="overview-section">
        <div className="container">
          <div className="content-grid">
            <div className="content-text">
              <h2>The Drug Repurposing Paradigm</h2>
              <p>
                Repositioning existing pharmaceuticals to target alternative clinical conditions bypasses early toxicology bottlenecks, accelerating the discovery timeline.
              </p>
              <div className="benefits-list">
                <div className="benefit-item">
                  <span className="benefit-dot"></span>
                  <div>
                    <strong>Reduced Risk:</strong> Safety and pharmacokinetic profiles are already clinically documented.
                  </div>
                </div>
                <div className="benefit-item">
                  <span className="benefit-dot"></span>
                  <div>
                    <strong>Cost Efficiency:</strong> Average savings of hundreds of millions of dollars compared to de novo synthesis.
                  </div>
                </div>
                <div className="benefit-item">
                  <span className="benefit-dot"></span>
                  <div>
                    <strong>Faster Deployment:</strong> Candidate molecules skip early phase trials, reaching phase II/III testing years ahead.
                  </div>
                </div>
              </div>
            </div>
            
            <div className="content-visual grid-2x1">
              <div className="stat-box-new glass-panel-glow">
                <div className="stat-big-value">90%</div>
                <div className="stat-label-new">Cost Reduction vs. Standard R&D</div>
              </div>
              <div className="stat-box-new glass-panel">
                <div className="stat-big-value">3-12y</div>
                <div className="stat-label-new">Time Saved in Development Pipeline</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Orchestration Node Map */}
      <section className="architecture-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Multi-Agent Orchestration Map</h2>
            <p className="section-subtitle">
              How our specialized agents coordinate state and share parameters in real-time.
            </p>
          </div>
          
          <div className="architecture-diagram glass-panel">
            <div className="arch-flow">
              {/* User Node */}
              <div className="arch-node-box user-node">
                <div className="node-icon-box">👤</div>
                <div className="node-text-box">
                  <h5>User Query</h5>
                  <p>Drug + Target Disease</p>
                </div>
              </div>
              
              <div className="arch-connector">↓</div>
              
              {/* Backend Node */}
              <div className="arch-node-box api-node">
                <div className="node-icon-box">⚡</div>
                <div className="node-text-box">
                  <h5>FastAPI Entry</h5>
                  <p>Invokes LangGraph</p>
                </div>
              </div>
              
              <div className="arch-connector">↓</div>
              
              {/* Master Agent Box */}
              <div className="agent-orchestration-zone">
                <div className="orchestrator-node glass-panel-glow">
                  <div className="node-icon-box orange">🎯</div>
                  <div className="node-text-box">
                    <h5>Master Agent</h5>
                    <p>Workflow planner & validator</p>
                  </div>
                </div>
                
                <div className="agent-branches">
                  <div className="agent-node-card">
                    <div className="node-icon-mini">🔍</div>
                    <h6>Search Agent</h6>
                    <p>Queries literature database</p>
                  </div>
                  
                  <div className="agent-node-card">
                    <div className="node-icon-mini">✨</div>
                    <h6>Summarizer Agent</h6>
                    <p>Gemini LLM extraction</p>
                  </div>
                  
                  <div className="agent-node-card">
                    <div className="node-icon-mini">📊</div>
                    <h6>Report Agent</h6>
                    <p>Compiles final assessment</p>
                  </div>
                </div>
              </div>
              
              <div className="arch-connector">↓</div>
              
              {/* Report Output Node */}
              <div className="arch-node-box output-node">
                <div className="node-icon-box green">📄</div>
                <div className="node-text-box">
                  <h5>Final Monograph</h5>
                  <p>Clinically formatted PDF report</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="technology-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Core Scientific Stack</h2>
            <p className="section-subtitle">
              Engineered using state-of-the-art libraries and language model pipelines.
            </p>
          </div>
          
          <div className="tech-details-grid">
            <div className="tech-detail-card glass-panel">
              <div className="tech-card-icon">🔗</div>
              <h3>LangGraph Orchestrator</h3>
              <p>
                Provides a stateful agent graph structure. Enables cyclical workflows and programmatic checkpoints during analysis.
              </p>
            </div>
            
            <div className="tech-detail-card glass-panel">
              <div className="tech-card-icon">✨</div>
              <h3>Google Gemini AI</h3>
              <p>
                Leverages advanced Gemini API models to parse complex medical abstracts and write evidence summaries.
              </p>
            </div>
            
            <div className="tech-detail-card glass-panel">
              <div className="tech-card-icon">⚡</div>
              <h3>FastAPI Backend</h3>
              <p>
                Async ASGI interface that executes the Graph workflow, streams progress logs, and handles JSON payloads.
              </p>
            </div>
            
            <div className="tech-detail-card glass-panel">
              <div className="tech-card-icon">⚛️</div>
              <h3>React 18 Dashboard</h3>
              <p>
                Modern responsive UI utilizing CSS custom properties, real-time animation frames, and canvas exports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta-section">
        <div className="container">
          <div className="cta-box glass-panel-glow">
            <h2>Ready to run your analysis?</h2>
            <p>Input compound names to trace literature findings in real time.</p>
            <a href="/analyzer" className="btn btn-primary">Start Analysis</a>
          </div>
        </div>
      </section>
    </div>
  )
}
