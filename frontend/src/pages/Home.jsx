import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

export default function Home() {
  const [scanActive, setScanActive] = useState(true)
  const [sensitivity, setSensitivity] = useState(85)
  const [kdThreshold, setKdThreshold] = useState(25)
  const [scrolled, setScrolled] = useState(false)

  // Quantum Teleport scroll trigger
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="quantum-home-page animate-fade-in">
      
      {/* 1. Hero Section (Min-height 90vh, centered flex column) */}
      <section className="quantum-hero">
        
        {/* Top: Capsule badge with pulsing dot and 'v2.0' label */}
        <div className="hero-capsule-badge">
          <span className="pulse-dot"></span>
          <span>SYSTEM ACTIVE // QUANTUM ENGINE v2.0</span>
        </div>

        {/* Heading: Rajdhani 120px, uppercase, two lines */}
        <div className="hero-heading-wrapper">
          <h1 className="hero-quantum-title">
            <span className="title-line-1">QUANTUM BIOMETRIC</span>
            <span className="title-line-2 text-cyan-glow">& PHARMA INTELLIGENCE</span>
          </h1>

          {/* 6 Floating Icons positioned absolutely with unique float animations & teleport glitch */}
          <div className={`floating-icons-container ${scrolled ? 'glitched-teleport-out' : ''}`}>
            
            {/* Icon 1: Brain */}
            <div className="quantum-float-icon icon-brain" style={{ '--float-range': '12px', '--float-dur': '2.4s' }}>
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#00F0FF" strokeWidth="1.5">
                <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z" />
                <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z" />
              </svg>
            </div>

            {/* Icon 2: Heart Rate Pulse */}
            <div className="quantum-float-icon icon-heart" style={{ '--float-range': '15px', '--float-dur': '3.1s' }}>
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#00F0FF" strokeWidth="1.5">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>

            {/* Icon 3: DNA Double Helix */}
            <div className="quantum-float-icon icon-dna" style={{ '--float-range': '10px', '--float-dur': '2.8s' }}>
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#00F0FF" strokeWidth="1.5">
                <path d="M2 15c6.667-6 13.333 0 20-6" />
                <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" />
                <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" />
                <path d="M17 6l-2.5-2.5" />
                <path d="M14 8l-1-1" />
                <path d="M7 18l2.5 2.5" />
                <path d="M3.5 14.5l.5.5" />
                <path d="M20 9.5l.5.5" />
                <path d="M2 9c6.667 6 13.333 0 20 6" />
              </svg>
            </div>

            {/* Icon 4: Molecule Target */}
            <div className="quantum-float-icon icon-molecule" style={{ '--float-range': '14px', '--float-dur': '3.5s' }}>
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#00F0FF" strokeWidth="1.5">
                <circle cx="12" cy="12" r="3" />
                <circle cx="19" cy="5" r="2" />
                <circle cx="5" cy="19" r="2" />
                <circle cx="5" cy="5" r="2" />
                <path d="M12 9V5" />
                <path d="M14.5 13.5l3 3" />
                <path d="M9.5 10.5l-3-3" />
              </svg>
            </div>

            {/* Icon 5: Reticle Tactical */}
            <div className="quantum-float-icon icon-reticle" style={{ '--float-range': '8px', '--float-dur': '2.0s' }}>
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#00F0FF" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="22" y1="12" x2="18" y2="12" />
                <line x1="6" y1="12" x2="2" y2="12" />
                <line x1="12" y1="6" x2="12" y2="2" />
                <line x1="12" y1="22" x2="12" y2="18" />
              </svg>
            </div>

            {/* Icon 6: Dumbbell Biometric */}
            <div className="quantum-float-icon icon-dumbbell" style={{ '--float-range': '11px', '--float-dur': '2.6s' }}>
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#00F0FF" strokeWidth="1.5">
                <path d="m6.5 6.5 11 11" />
                <path d="m21 21-1-1" />
                <path d="m3 3 1 1" />
                <path d="m18 22 4-4" />
                <path d="m2 6 4-4" />
                <path d="m3 10 7-7" />
                <path d="m14 21 7-7" />
              </svg>
            </div>
          </div>
        </div>

        <p className="hero-subtext">
          Deep literature retrieval, multi-agent evidence synthesis, and high-throughput cellular pharmacophore modeling.
        </p>

        <div className="hero-cta-group">
          <Link to="/analyzer" className="btn btn-primary">
            [ INITIATE TARGET SCAN ]
          </Link>
          <Link to="/workspace" className="btn btn-secondary">
            [ RESEARCH WORKSPACE ]
          </Link>
        </div>

        {/* Bottom: Three-column stat strip with 48px bold mono numbers & glitch-hover */}
        <div className="quantum-stat-strip glass-panel">
          <div className="stat-col glitch-hover">
            <div className="stat-number">4.5<span className="stat-unit">YRS</span></div>
            <div className="stat-label">[ PRECLINICAL TIME ACCELERATED ]</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-col glitch-hover">
            <div className="stat-number">94.8<span className="stat-unit">%</span></div>
            <div className="stat-label">[ TOXICITY SAFETY RECOVERY MATCH ]</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-col glitch-hover">
            <div className="stat-number">38.2<span className="stat-unit">M</span></div>
            <div className="stat-label">[ INDEXED PUBMED & EUROPE PMC RECORDS ]</div>
          </div>
        </div>
      </section>

      {/* 2. Scanner Interface (Viewfinder mockup + Control panel) */}
      <section className="container scanner-section">
        <div className="section-header-tag">
          <span className="section-mini-badge red">LIVE ACQUISITION</span>
          <h2>BIOMETRIC & PHARMACOPHORE SCANNER</h2>
          <p>Real-time molecular target viewfinder and binding affinity calibration.</p>
        </div>

        <div className="scanner-grid">
          {/* Left: Viewfinder mockup with 3:4 aspect ratio */}
          <div className="viewfinder-mockup glass-panel">
            {/* Cyan corner crosshairs */}
            <div className="crosshair top-left"></div>
            <div className="crosshair top-right"></div>
            <div className="crosshair bottom-left"></div>
            <div className="crosshair bottom-right"></div>

            {/* Horizontal cyan laser line sliding top-to-bottom every 3s */}
            {scanActive && <div className="cyan-laser-line"></div>}

            {/* Pulsing red guide box with 'TARGET ACQUISITION FRAME' */}
            <div className="pulsing-target-box">
              <span className="target-frame-label">TARGET ACQUISITION FRAME</span>
              <div className="reticle-center">
                <span className="reticle-ring"></span>
                <span className="reticle-dot"></span>
              </div>
              <span className="target-status-caption">
                {scanActive ? 'SCANNING CELLULAR PATHWAYS...' : 'ACQUISITION PAUSED'}
              </span>
            </div>

            {/* Telemetry readouts in JetBrains Mono */}
            <div className="viewfinder-telemetry">
              <span>FOV: 84.2° // SPECTRAL: 420nm</span>
              <span>RESOL: 0.08 Å // AF: LOCKED</span>
            </div>
          </div>

          {/* Right: Control panel with dark-800 cards */}
          <div className="scanner-control-panel glass-panel">
            <div className="panel-title-bar">
              <h4>INSTRUMENT TELEMETRY</h4>
              <span className="badge-pill green">ONLINE</span>
            </div>

            {/* Slider 1: Target Sensitivity */}
            <div className="control-card">
              <div className="slider-label-row">
                <span className="control-name">TARGET SENSITIVITY</span>
                <span className="control-val">{sensitivity}%</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="100" 
                value={sensitivity} 
                onChange={e => setSensitivity(e.target.value)} 
              />
            </div>

            {/* Slider 2: Kd Affinity Threshold */}
            <div className="control-card">
              <div className="slider-label-row">
                <span className="control-name">Kd BINDING THRESHOLD</span>
                <span className="control-val">{kdThreshold} nM</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="100" 
                value={kdThreshold} 
                onChange={e => setKdThreshold(e.target.value)} 
              />
            </div>

            {/* Button Group (START/STOP) */}
            <div className="control-actions-group">
              <button 
                type="button" 
                className={`btn ${scanActive ? 'btn-secondary' : 'btn-primary'}`}
                onClick={() => setScanActive(!scanActive)}
              >
                {scanActive ? '[ PAUSE SCANNER ]' : '[ ACTIVATE SCAN ]'}
              </button>
              <Link to="/analyzer" className="btn btn-primary">
                [ RUN AGENT ANALYSIS ]
              </Link>
            </div>

            <div className="telemetry-info-box">
              <span className="mono-label">ACTIVE PROBE: METFORMIN α-AMPK</span>
              <p>Calibrated against human plasma pharmacokinetic models with automated 505(b)(2) fast-track verification.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Process Section (4-column grid of cards) */}
      <section className="container process-section">
        <div className="section-header-tag">
          <span className="section-mini-badge">WORKFLOW PIPELINE</span>
          <h2>FOUR-TIER COGNITIVE DISCOVERY</h2>
          <p>Multi-agent research architecture converting raw biomedical papers into auditable repurposing hypotheses.</p>
        </div>

        <div className="process-grid">
          
          {/* Card 01 */}
          <div className="process-card glass-panel">
            <span className="bg-large-number">01</span>
            <div className="process-icon-box">🔍</div>
            <h4>Hybrid Retrieval</h4>
            <p>Queries PubMed and Europe PMC concurrently, merging keyword BM25 with Reciprocal Rank Fusion.</p>
          </div>

          {/* Card 02 */}
          <div className="process-card glass-panel">
            <span className="bg-large-number">02</span>
            <div className="process-icon-box">📑</div>
            <h4>Evidence Mining</h4>
            <p>Extracts molecular targets, study models, and verbatim text passages into claim-level citations.</p>
          </div>

          {/* Card 03 */}
          <div className="process-card glass-panel">
            <span className="bg-large-number">03</span>
            <div className="process-icon-box">⚖️</div>
            <h4>Claim Verification</h4>
            <p>Deterministic and lexical auditing checks whether claims are strictly substantiated by cited quotes.</p>
          </div>

          {/* Card 04 */}
          <div className="process-card glass-panel">
            <span className="bg-large-number">04</span>
            <div className="process-icon-box">📄</div>
            <h4>Monograph Export</h4>
            <p>Compiles auditable research reports with exploratory Phase IIa clinical protocols in Markdown and PDF.</p>
          </div>

        </div>
      </section>

    </div>
  )
}
