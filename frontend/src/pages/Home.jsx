import { useState } from 'react'
import { Link } from 'react-router-dom'

const FAQ_ITEMS = [
  {
    q: 'How does the multi-agent literature retrieval work?',
    a: 'NeuroRepurpose AI queries both PubMed (NCBI) and Europe PMC simultaneously using Boolean bio-queries. Results are deduplicated and scored using BM25 token relevance combined with Reciprocal Rank Fusion (RRF), ensuring top-ranking peer-reviewed clinical studies are prioritized.'
  },
  {
    q: 'What is deterministic claim verification?',
    a: 'Unlike generic LLMs that hallucinate facts, our deterministic verifier isolates each generated claim, matches it against verbatim text passages retrieved from the original papers, and computes an unalterable lexical and semantic grounding score. If a quote does not support the claim, it is flagged.'
  },
  {
    q: 'How does this accelerate the FDA 505(b)(2) regulatory pathway?',
    a: 'Because repurposed drugs already have established human safety and toxicology profiles, researchers can leverage existing data under FDA 505(b)(2). Our platform synthesizes off-label preclinical evidence directly into structured regulatory dossiers, supporting earlier-stage research synthesis.'
  },
  {
    q: 'Can researchers upload and analyze their own unpublished PDFs?',
    a: 'Yes. The analyzer accepts proprietary lab PDFs or newly published preprints, extracts the structured biomedical text, parses binding curves and study models, and integrates them with public database evidence.'
  }
]

export default function Home() {
  const [activeFaq, setActiveFaq] = useState(0)

  return (
    <div className="home-container animate-fade-in">
      
      {/* ===================================================================
          1. HERO SECTION
          =================================================================== */}
      <section className="hero-section research-hero">
        <div className="container hero-content research-hero-grid">
          <div className="research-hero-copy">
            <div className="hero-status-pill research-kicker">
              <span className="pulse-radar-dot" aria-hidden="true"></span>
              <span className="pill-text">NEUROREPURPOSE AI</span>
              <span className="pill-sep">/</span>
              <span className="pill-badge">BIOMEDICAL EVIDENCE WORKBENCH</span>
            </div>
            <h1 className="hero-main-title">
              <span className="hero-title-line-1">Find new possibilities</span>
              <span className="hero-title-line-2">in existing medicines.</span>
            </h1>
            <p className="hero-description">
              Explore drug-repurposing hypotheses across biomedical literature. Follow each finding back to its source, compare evidence across studies, and inspect the molecular targets behind a potential connection.
            </p>
            <div className="hero-actions-row">
              <Link to="/analyzer" className="btn btn-primary btn-lg">
                <span>Start an investigation</span><span aria-hidden="true">↗</span>
              </Link>
              <Link to="/evidence" className="btn btn-secondary btn-lg">
                <span>Inspect the evidence</span>
              </Link>
            </div>
            <div className="research-source-line">
              <span className="source-line-mark" aria-hidden="true"></span>
              <span>PubMed + Europe PMC</span>
              <span className="source-line-divider">·</span>
              <span>Claim-level citations</span>
              <span className="source-line-divider">·</span>
              <span>Exportable research reports</span>
            </div>
          </div>
          <aside className="research-hero-visual research-dna-visual" aria-label="Animated DNA and molecular discovery illustration">
            <div className="dna-scene">
              <div className="dna-scene-heading">
                <span className="dna-live-dot" aria-hidden="true"></span>
                <span>MOLECULAR DISCOVERY</span>
                <span className="dna-heading-rule" aria-hidden="true"></span>
              </div>
              <div className="dna-artwork">
                <div className="dna-orbit dna-orbit-one" aria-hidden="true"></div>
                <div className="dna-orbit dna-orbit-two" aria-hidden="true"></div>
                <div className="dna-molecule-orb" aria-hidden="true">
                  <span></span><span></span><span></span><span></span><span></span><span></span>
                </div>
                <svg className="dna-helix" viewBox="0 0 520 420" role="img" aria-label="Double helix with animated molecular bonds">
                  <defs>
                    <linearGradient id="dna-strand-a" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#77578a" />
                      <stop offset="50%" stopColor="#4e8c87" />
                      <stop offset="100%" stopColor="#9876b0" />
                    </linearGradient>
                    <linearGradient id="dna-strand-b" x1="1" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#e48db7" />
                      <stop offset="50%" stopColor="#8b75b5" />
                      <stop offset="100%" stopColor="#6ba7a1" />
                    </linearGradient>
                  </defs>
                  <circle className="dna-backdrop-ring" cx="260" cy="210" r="158" />
                  <circle className="dna-backdrop-ring dna-backdrop-ring-inner" cx="260" cy="210" r="120" />
                  <g className="dna-rungs">
                    <line x1="190" y1="38" x2="330" y2="38" />
                    <line x1="224" y1="68" x2="296" y2="68" />
                    <line x1="284" y1="98" x2="236" y2="98" />
                    <line x1="332" y1="128" x2="188" y2="128" />
                    <line x1="330" y1="158" x2="190" y2="158" />
                    <line x1="288" y1="188" x2="232" y2="188" />
                    <line x1="226" y1="218" x2="294" y2="218" />
                    <line x1="186" y1="248" x2="334" y2="248" />
                    <line x1="194" y1="278" x2="326" y2="278" />
                    <line x1="238" y1="308" x2="282" y2="308" />
                    <line x1="294" y1="338" x2="226" y2="338" />
                    <line x1="334" y1="368" x2="186" y2="368" />
                    <line x1="320" y1="398" x2="200" y2="398" />
                  </g>
                  <path className="dna-strand dna-strand-a" d="M190 28 C390 62 130 104 330 138 S130 212 330 248 S130 322 330 358 S170 394 200 408" />
                  <path className="dna-strand dna-strand-b" d="M330 28 C130 62 390 104 190 138 S390 212 190 248 S390 322 190 358 S350 394 320 408" />
                  <g className="dna-bases">
                    <circle cx="190" cy="38" r="5" /><circle cx="330" cy="38" r="5" />
                    <circle cx="224" cy="68" r="4" /><circle cx="296" cy="68" r="4" />
                    <circle cx="284" cy="98" r="5" /><circle cx="236" cy="98" r="5" />
                    <circle cx="332" cy="128" r="4" /><circle cx="188" cy="128" r="4" />
                    <circle cx="330" cy="158" r="5" /><circle cx="190" cy="158" r="5" />
                    <circle cx="288" cy="188" r="4" /><circle cx="232" cy="188" r="4" />
                    <circle cx="226" cy="218" r="5" /><circle cx="294" cy="218" r="5" />
                    <circle cx="186" cy="248" r="4" /><circle cx="334" cy="248" r="4" />
                    <circle cx="194" cy="278" r="5" /><circle cx="326" cy="278" r="5" />
                    <circle cx="238" cy="308" r="4" /><circle cx="282" cy="308" r="4" />
                    <circle cx="294" cy="338" r="5" /><circle cx="226" cy="338" r="5" />
                    <circle cx="334" cy="368" r="4" /><circle cx="186" cy="368" r="4" />
                  </g>
                </svg>
                <div className="dna-target-orb" aria-hidden="true">
                  <svg viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="23" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="32" cy="32" r="14" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 4" />
                    <circle cx="32" cy="32" r="5" fill="currentColor" />
                    <path d="M32 2v10M32 52v10M2 32h10M52 32h10" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>
                <span className="dna-signal dna-signal-one" aria-hidden="true"></span>
                <span className="dna-signal dna-signal-two" aria-hidden="true"></span>
                <span className="dna-signal dna-signal-three" aria-hidden="true"></span>
              </div>
              <div className="dna-scene-footer">
                <div><span className="dna-step">01</span><span>Compound</span></div>
                <span className="dna-step-connector" aria-hidden="true"></span>
                <div><span className="dna-step">02</span><span>Target</span></div>
                <span className="dna-step-connector" aria-hidden="true"></span>
                <div><span className="dna-step">03</span><span>Evidence</span></div>
              </div>
              <p className="dna-scene-note">From molecular hypotheses to literature-grounded research.</p>
            </div>
          </aside>
        </div>
        <div className="container research-capabilities-strip" aria-label="Core platform capabilities">
          <div><span className="capability-index">01</span><span><strong>Literature retrieval</strong><small>PubMed and Europe PMC</small></span></div>
          <div><span className="capability-index">02</span><span><strong>Evidence verification</strong><small>Claims linked to source text</small></span></div>
          <div><span className="capability-index">03</span><span><strong>Research synthesis</strong><small>Comparisons, gaps and reports</small></span></div>
        </div>
      </section>

      {/* ===================================================================
          3. FOUR-TIER MULTI-AGENT ARCHITECTURE
          =================================================================== */}
      <section className="container workflow-section">
        <div className="section-head-bar">
          <span className="badge-pill">AGENTIC WORKFLOW PIPELINE</span>
          <h2>FOUR-TIER COGNITIVE DISCOVERY ENGINE</h2>
          <p>The workflow retrieves literature, synthesizes candidate findings, and flags claims for source-level review.</p>
        </div>

        <div className="workflow-cards-grid">
          
          {/* Tier 1 */}
          <div className="workflow-card glass-panel">
            <div className="wf-card-top">
              <span className="wf-step-number">01</span>
              <div className="wf-icon-box cyan-glow">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#00E5FF" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
            </div>
            <h3>Hybrid Retrieval Agent</h3>
            <p>Concurrently executes Boolean searches across PubMed and Europe PMC, merging keyword BM25 with Reciprocal Rank Fusion (RRF) to score top clinical papers.</p>
            <div className="wf-footer-tag">
              <span className="mono-label">PUBMED + EUROPE PMC</span>
            </div>
          </div>

          {/* Tier 2 */}
          <div className="workflow-card glass-panel">
            <div className="wf-card-top">
              <span className="wf-step-number">02</span>
              <div className="wf-icon-box purple-glow">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#8B5CF6" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
            </div>
            <h3>Claim & Evidence Miner</h3>
            <p>Extracts structured pharmacological claims, targeted proteins, cellular models, and verbatim source passages with exact publication citations.</p>
            <div className="wf-footer-tag">
              <span className="mono-label">VERBATIM PASSAGE MAPPING</span>
            </div>
          </div>

          {/* Tier 3 */}
          <div className="workflow-card glass-panel">
            <div className="wf-card-top">
              <span className="wf-step-number">03</span>
              <div className="wf-icon-box emerald-glow">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#10B981" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
            </div>
            <h3>Deterministic Verifier</h3>
            <p>Audits claims against cited quotes using deterministic lexical validation. Separates concordant vs discordant evidence and highlights open research gaps.</p>
            <div className="wf-footer-tag">
              <span className="mono-label">ZERO HALLUCINATIONS</span>
            </div>
          </div>

          {/* Tier 4 */}
          <div className="workflow-card glass-panel">
            <div className="wf-card-top">
              <span className="wf-step-number">04</span>
              <div className="wf-icon-box cyan-glow">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#00E5FF" strokeWidth="2">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
            </div>
            <h3>Dossier & Protocol Engine</h3>
            <p>Compiles structured monographs with exploratory Phase IIa clinical protocols, dosing schedules, and exportable regulatory briefs in Markdown and PDF.</p>
            <div className="wf-footer-tag">
              <span className="mono-label">FDA 505(b)(2) READY</span>
            </div>
          </div>

        </div>
      </section>

      {/* ===================================================================
          4. INTERACTIVE PLATFORM HUB
          =================================================================== */}
      <section className="container hub-preview-section">
        <div className="hub-preview-card glass-panel">
          <div className="hub-grid">
            <div className="hub-copy">
              <span className="badge-pill green">COMPLETE SCIENTIFIC SUITE</span>
              <h2>ALL RESEARCH CAPABILITIES AT YOUR FINGERTIPS</h2>
              <p>Explore the full suite of bioinformatics modules built for oncology, neurodegenerative diseases, and rare disorders.</p>
              
              <div className="hub-features-list">
                <div className="hub-feat-item">
                  <strong className="text-cyan">Evidence Matrix:</strong>
                  <span>Interactive claim auditing with verbatim quote inspection and concordance sorting.</span>
                </div>
                <div className="hub-feat-item">
                  <strong className="text-cyan">Biomolecular Graph:</strong>
                  <span>SVG force-directed network mapping drugs to molecular targets and pathway nodes.</span>
                </div>
                <div className="hub-feat-item">
                  <strong className="text-cyan">Citation Research Chat:</strong>
                  <span>Ask deep scientific questions grounded strictly in indexed literature papers.</span>
                </div>
              </div>

              <div className="hub-cta-buttons">
                <Link to="/workspace" className="btn btn-primary">Open Research Workspace</Link>
                <Link to="/analyzer?mode=pdf" className="btn btn-outline">Analyze Lab PDF Document</Link>
              </div>
            </div>

            <div className="hub-visual-box">
              <div className="terminal-window">
                <div className="terminal-header">
                  <div className="terminal-dots">
                    <span></span><span></span><span></span>
                  </div>
                  <span className="terminal-title">neuro-agent --pipeline=autonomous</span>
                </div>
                <div className="terminal-body mono-data">
                  <p><span className="t-cyan">&gt;</span> Connecting to PubMed and Europe PMC...</p>
                  <p><span className="t-green">&#10003;</span> Collecting literature records for the research question</p>
                  <p><span className="t-cyan">&gt;</span> Ranking papers by relevance and source quality...</p>
                  <p><span className="t-green">&#10003;</span> Extracting candidate compounds, targets, and mechanisms...</p>
                  <p><span className="t-cyan">&gt;</span> Checking extracted claims against cited passages...</p>
                  <p><span className="t-green">&#10003;</span> Mapping findings to original source passages</p>
                  <p><span className="t-amber">&#9888;</span> Flagging evidence gaps for researcher review</p>
                  <p><span className="t-purple">&gt;</span> Preparing a traceable research summary...</p>
                  <p className="t-cyan"><b>[STATUS: READY FOR HUMAN REVIEW]</b></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          5. FAQ & REGULATORY SCOPE SECTION
          =================================================================== */}
      <section className="container faq-section">
        <div className="faq-layout">
          <div className="faq-intro">
            <span className="badge-pill">SCIENTIFIC RIGOR &amp; METHODOLOGY</span>
            <h2>FREQUENTLY ASKED QUESTIONS</h2>
            <p>Essential guidance on literature coverage, PDF extraction, deterministic audits, and regulatory scope.</p>
            <Link to="/about" className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }}>
              Read Full Methodology &rarr;
            </Link>
          </div>

          <div className="faq-accordion">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = activeFaq === index
              return (
                <div 
                  key={item.q} 
                  className={`faq-panel glass-panel ${isOpen ? 'is-open' : ''}`}
                >
                  <button 
                    type="button" 
                    className="faq-toggle-btn"
                    onClick={() => setActiveFaq(isOpen ? -1 : index)}
                  >
                    <span className="faq-q-text">{item.q}</span>
                    <span className="faq-indicator">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="faq-answer-body">
                      <p>{item.a}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Scientific Caveat Footer Banner */}
      <div className="container" style={{ marginTop: '4rem', marginBottom: '2rem' }}>
        <div className="disclosure-banner glass-panel">
          <div className="banner-icon-side">⚖️</div>
          <div className="banner-text-side">
            <strong>RESEARCH EXPLORATION INSTRUMENT · NOT CLINICAL ADVICE</strong>
            <p>NeuroRepurpose AI is designed to assist biomedical researchers and regulatory teams in formulating hypotheses. All AI-generated outputs and citations must be validated against original primary publications and subject to standard laboratory and clinical protocols.</p>
          </div>
        </div>
      </div>

    </div>
  )
}
