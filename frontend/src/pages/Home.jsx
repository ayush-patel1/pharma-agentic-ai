import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

const SAMPLE_COMPOUNDS = [
  {
    drug: 'Metformin',
    originalIndication: 'Type 2 Diabetes',
    repurposedIndication: 'Glioblastoma Multiforme',
    target: 'AMPK / mTOR / Hexokinase II',
    kd: '1.8 nM',
    concordance: '94%',
    phase: 'Phase IIa Candidate',
    bbb: 'BBB+ Permeable (logBB +0.28)',
    pmidCount: 42,
    mechanism: 'Metabolic reprogramming via allosteric activation of AMPK, inhibiting tumor glycolysis.'
  },
  {
    drug: 'Rapamycin',
    originalIndication: 'Organ Transplant Rejection',
    repurposedIndication: "Alzheimer's Disease",
    target: 'mTORC1 Complex / Autophagy',
    kd: '0.2 nM',
    concordance: '89%',
    phase: 'Preclinical Validated',
    bbb: 'BBB+ Permeable (logBB +0.14)',
    pmidCount: 68,
    mechanism: 'Restores microglial autophagy clearance of amyloid-β and hyperphosphorylated tau.'
  },
  {
    drug: 'Donepezil',
    originalIndication: "Mild-to-Moderate Dementia",
    repurposedIndication: 'Traumatic Brain Injury',
    target: 'Acetylcholinesterase (AChE)',
    kd: '5.7 nM',
    concordance: '86%',
    phase: 'Phase I/II Exploratory',
    bbb: 'BBB+ High (logBB +0.42)',
    pmidCount: 29,
    mechanism: 'Mitigates post-injury secondary neurodegeneration and downregulates pro-inflammatory cytokines.'
  },
  {
    drug: 'Imatinib',
    originalIndication: 'Chronic Myeloid Leukemia',
    repurposedIndication: 'Pulmonary Arterial Hypertension',
    target: 'PDGFR-α/β / c-KIT / ABL',
    kd: '12.4 nM',
    concordance: '91%',
    phase: 'Phase II Repurposing',
    bbb: 'BBB- Low (Peripheral Specific)',
    pmidCount: 35,
    mechanism: 'Reverses vascular pulmonary arterial remodeling by blocking PDGF receptor phosphorylation.'
  }
]

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
  const [selectedDrugIndex, setSelectedDrugIndex] = useState(0)
  const [evidenceThreshold, setEvidenceThreshold] = useState(85)
  const [kdThreshold, setKdThreshold] = useState(25)
  const [activeFaq, setActiveFaq] = useState(0)
  const [isScanning, setIsScanning] = useState(true)

  const activeDrug = SAMPLE_COMPOUNDS[selectedDrugIndex]

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
          <aside className="research-hero-visual" aria-label="Illustrative drug repurposing evidence brief">
            <div className="evidence-brief-top">
              <div>
                <span className="brief-overline">EXAMPLE RESEARCH LEAD</span>
                <span className="brief-id">NR / BRIEF 001</span>
              </div>
              <span className="brief-status">Illustrative</span>
            </div>
            <div className="brief-compound-row">
              <div className="compound-monogram" aria-hidden="true">M</div>
              <div className="brief-compound-name">
                <strong>Metformin</strong>
                <span>Established indication · Type 2 diabetes</span>
              </div>
            </div>
            <div className="brief-connection" aria-hidden="true">
              <span></span><span className="connection-node"></span><span></span>
              <span className="connection-label">repurposing hypothesis</span>
            </div>
            <div className="brief-target-row">
              <div className="target-glyph" aria-hidden="true">
                <svg viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="17" stroke="currentColor" strokeWidth="1.4"/>
                  <circle cx="24" cy="24" r="9" stroke="currentColor" strokeWidth="1.4" strokeDasharray="3 3"/>
                  <circle cx="24" cy="24" r="3" fill="currentColor"/>
                  <path d="M24 2v8M24 38v8M2 24h8M38 24h8" stroke="currentColor" strokeWidth="1.4"/>
                </svg>
              </div>
              <div className="brief-compound-name">
                <strong>Glioblastoma</strong>
                <span>Candidate indication to investigate</span>
              </div>
              <span className="brief-arrow" aria-hidden="true">↗</span>
            </div>
            <div className="brief-evidence-divider"></div>
            <div className="brief-evidence-heading">
              <span>Evidence trail</span><span>3 review stages</span>
            </div>
            <div className="brief-evidence-list">
              <div className="brief-evidence-item">
                <span className="evidence-step-icon">01</span>
                <span><strong>Retrieve</strong><small>Find relevant papers across sources</small></span>
                <span className="evidence-step-state">Search</span>
              </div>
              <div className="brief-evidence-item">
                <span className="evidence-step-icon">02</span>
                <span><strong>Compare</strong><small>Review mechanisms and study context</small></span>
                <span className="evidence-step-state">Review</span>
              </div>
              <div className="brief-evidence-item">
                <span className="evidence-step-icon">03</span>
                <span><strong>Verify</strong><small>Inspect claims against source passages</small></span>
                <span className="evidence-step-state">Audit</span>
              </div>
            </div>
            <p className="brief-disclaimer">Illustrative example only. Not a validated finding or treatment recommendation.</p>
          </aside>
        </div>
        <div className="container research-capabilities-strip" aria-label="Core platform capabilities">
          <div><span className="capability-index">01</span><span><strong>Literature retrieval</strong><small>PubMed and Europe PMC</small></span></div>
          <div><span className="capability-index">02</span><span><strong>Evidence verification</strong><small>Claims linked to source text</small></span></div>
          <div><span className="capability-index">03</span><span><strong>Research synthesis</strong><small>Comparisons, gaps and reports</small></span></div>
        </div>
      </section>

      {/* ===================================================================
          2. INTERACTIVE TARGET SCANNER & DISCOVERY STUDIO
          =================================================================== */}
      <section className="container studio-section">
        <div className="section-head-bar">
          <span className="badge-pill">CANDIDATE EXPLORER · ILLUSTRATIVE DATA</span>
          <h2>COMPOUND & MECHANISM EXPLORER</h2>
          <p>Explore example compound profiles, proposed mechanisms, and research questions. Values shown in this interactive example are illustrative and require source-level validation.</p>
        </div>

        {/* Compound Selector Tabs */}
        <div className="compound-tabs-strip">
          {SAMPLE_COMPOUNDS.map((c, idx) => (
            <button
              key={c.drug}
              type="button"
              className={`compound-tab-btn ${selectedDrugIndex === idx ? 'is-selected' : ''}`}
              onClick={() => setSelectedDrugIndex(idx)}
            >
              <span className="tab-drug-name">{c.drug}</span>
              <span className="tab-drug-arrow">→</span>
              <span className="tab-drug-ind">{c.repurposedIndication}</span>
            </button>
          ))}
        </div>

        {/* 2-Column Scanner Console */}
        <div className="studio-console-grid">
          
          {/* Left Column: Kinetic Molecular Viewfinder */}
          <div className="viewfinder-terminal glass-panel">
            
            {/* Viewfinder Top Bar */}
            <div className="viewfinder-top-bar">
              <div className="vf-status-group">
                <span className={`status-indicator-light ${isScanning ? 'pulse-green' : 'paused'}`}></span>
                <span className="vf-channel-title">COMPOUND PROFILE // {activeDrug.drug.toUpperCase()}</span>
              </div>
              <div className="vf-meta-tags">
                <span className="meta-badge">MODEL VIEW</span>
                <span className="meta-badge cyan">EXAMPLE DATA</span>
              </div>
            </div>

            {/* Viewfinder Visual Screen */}
            <div className="viewfinder-screen">
              {/* Corner Crosshairs */}
              <div className="vf-crosshair ch-tl">+</div>
              <div className="vf-crosshair ch-tr">+</div>
              <div className="vf-crosshair ch-bl">+</div>
              <div className="vf-crosshair ch-br">+</div>

              {/* Scanning Laser Line */}
              {isScanning && <div className="scanning-laser"></div>}

              {/* Central Molecular Diagram Visual */}
              <div className="molecule-visual-box">
                <svg viewBox="0 0 400 240" className="molecule-svg">
                  {/* Grid Lines */}
                  <line x1="20" y1="120" x2="380" y2="120" stroke="rgba(0, 229, 255, 0.12)" strokeDasharray="4 4" />
                  <line x1="200" y1="20" x2="200" y2="220" stroke="rgba(0, 229, 255, 0.12)" strokeDasharray="4 4" />

                  {/* Receptor Protein Cavity */}
                  <path 
                    d="M 60 70 Q 120 40 180 80 T 260 100 T 340 70" 
                    fill="none" 
                    stroke="rgba(139, 92, 246, 0.5)" 
                    strokeWidth="3" 
                  />
                  <path 
                    d="M 60 170 Q 130 190 200 160 T 340 170" 
                    fill="none" 
                    stroke="rgba(139, 92, 246, 0.5)" 
                    strokeWidth="3" 
                  />

                  {/* Binding Cavity Glow */}
                  <circle cx="200" cy="120" r="45" fill="rgba(0, 229, 255, 0.06)" stroke="rgba(0, 229, 255, 0.3)" strokeDasharray="3 3" />
                  
                  {/* Active Ligand (Molecule) */}
                  <g className="ligand-group">
                    <circle cx="170" cy="115" r="9" fill="#00E5FF" filter="drop-shadow(0 0 6px #00E5FF)" />
                    <line x1="170" y1="115" x2="200" y2="105" stroke="#00E5FF" strokeWidth="2.5" />
                    <circle cx="200" cy="105" r="7" fill="#10B981" filter="drop-shadow(0 0 6px #10B981)" />
                    <line x1="200" y1="105" x2="228" y2="125" stroke="#00E5FF" strokeWidth="2.5" />
                    <circle cx="228" cy="125" r="8" fill="#8B5CF6" filter="drop-shadow(0 0 6px #8B5CF6)" />
                    <line x1="228" y1="125" x2="195" y2="140" stroke="#00E5FF" strokeWidth="2.5" />
                    <circle cx="195" cy="140" r="7" fill="#00E5FF" />
                    <line x1="195" y1="140" x2="170" y2="115" stroke="#00E5FF" strokeWidth="2" strokeDasharray="2 2" />
                  </g>

                  {/* Active Bond Distance Callout */}
                  <text x="215" y="90" fill="#00E5FF" fontSize="10" fontFamily="var(--font-mono)">2.48 Å (H-BOND)</text>
                  <text x="135" y="155" fill="#10B981" fontSize="10" fontFamily="var(--font-mono)">Kd = {activeDrug.kd}</text>
                </svg>

                {/* Overlaid Target Label */}
                <div className="target-overlay-badge">
                  <span className="mono-label">PRIMARY TARGET:</span>
                  <strong>{activeDrug.target}</strong>
                </div>
              </div>

              {/* Viewfinder Telemetry Readout Grid */}
              <div className="vf-telemetry-row">
                <div className="vf-tele-cell">
                  <span className="cell-lbl">Kd AFFINITY</span>
                  <span className="cell-val text-cyan">{activeDrug.kd}</span>
                </div>
                <div className="vf-tele-cell">
                  <span className="cell-lbl">CONCORDANCE</span>
                  <span className="cell-val text-emerald">{activeDrug.concordance}</span>
                </div>
                <div className="vf-tele-cell">
                  <span className="cell-lbl">PHARMACOKINETICS</span>
                  <span className="cell-val">{activeDrug.bbb}</span>
                </div>
                <div className="vf-tele-cell">
                  <span className="cell-lbl">CLINICAL STAGE</span>
                  <span className="cell-val text-cyan">{activeDrug.phase}</span>
                </div>
              </div>

            </div>

            {/* Viewfinder Footer */}
            <div className="viewfinder-footer-bar">
              <span className="vf-mechanism-note">
                <strong>MECHANISM:</strong> {activeDrug.mechanism}
              </span>
            </div>

          </div>

          {/* Right Column: Interactive Parameter Tuning & Action Console */}
          <div className="studio-control-card glass-panel">
            <div className="control-card-head">
              <h4>EVIDENCE FILTERS</h4>
              <span className="badge-pill green">USER-DEFINED</span>
            </div>

            {/* Slider 1: Evidence Consensus */}
            <div className="tune-slider-block">
              <div className="slider-header-row">
                <span className="slider-title">MINIMUM CONSENSUS THRESHOLD</span>
                <span className="slider-val text-cyan">{evidenceThreshold}%</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="99" 
                value={evidenceThreshold} 
                onChange={e => setEvidenceThreshold(Number(e.target.value))} 
              />
              <span className="slider-hint">Set a review threshold for comparing evidence in a research run.</span>
            </div>

            {/* Slider 2: Kd Affinity Stringency */}
            <div className="tune-slider-block">
              <div className="slider-header-row">
                <span className="slider-title">Kd AFFINITY STRINGENCY CUTOFF</span>
                <span className="slider-val text-cyan">&le; {kdThreshold} nM</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="100" 
                value={kdThreshold} 
                onChange={e => setKdThreshold(Number(e.target.value))} 
              />
              <span className="slider-hint">Use affinity as one research filter; it does not establish clinical efficacy.</span>
            </div>

            {/* Status Breakdown Box */}
            <div className="studio-status-box">
              <div className="status-item-row">
                <span className="status-k">PubMed & Europe PMC Papers:</span>
                <span className="status-v">{activeDrug.pmidCount} publications analyzed</span>
              </div>
              <div className="status-item-row">
                <span className="status-k">Original Indication:</span>
                <span className="status-v">{activeDrug.originalIndication}</span>
              </div>
              <div className="status-item-row">
                <span className="status-k">Repurposing Candidate:</span>
                <span className="status-v text-cyan">{activeDrug.repurposedIndication}</span>
              </div>
              <div className="status-item-row">
                <span className="status-k">505(b)(2) Regulatory Feasibility:</span>
                <span className="status-v text-emerald">Requires regulatory review</span>
              </div>
            </div>

            {/* Button Actions */}
            <div className="studio-buttons-row">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setIsScanning(!isScanning)}
              >
                {isScanning ? 'Pause Probe' : 'Resume Probe'}
              </button>
              <Link 
                to={`/analyzer?mode=database`} 
                className="btn btn-primary"
              >
                <span>Analyze in Full Suite</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>

          </div>

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
                  <p><span className="t-cyan">&gt;</span> Initializing PubMed API &amp; Europe PMC cluster...</p>
                  <p><span className="t-green">&#10003;</span> 42 records retrieved for Metformin + Glioblastoma</p>
                  <p><span className="t-cyan">&gt;</span> Running BM25 + Reciprocal Rank Fusion reranker...</p>
                  <p><span className="t-green">&#10003;</span> Target AMPK identified with Kd = 1.8 nM (p &lt; 0.001)</p>
                  <p><span className="t-cyan">&gt;</span> Deterministic Verifier auditing 16 extracted claims...</p>
                  <p><span className="t-green">&#10003;</span> 15 Concordant assertions verified with verbatim quotes</p>
                  <p><span className="t-amber">&#9888;</span> 1 Preclinical Discordance noted (in vitro only, lack in vivo model)</p>
                  <p><span className="t-purple">&gt;</span> Generating Phase IIa Clinical Protocol monograph...</p>
                  <p className="t-cyan"><b>[STATUS: READY FOR AUDIT &amp; EXPORT]</b></p>
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
