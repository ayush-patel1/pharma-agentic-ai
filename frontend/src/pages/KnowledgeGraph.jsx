import { useState } from 'react'
import './KnowledgeGraph.css'

export default function KnowledgeGraph() {
  const [activeCompound, setActiveCompound] = useState('metformin')
  const [selectedNode, setSelectedNode] = useState(null)

  const graphData = {
    metformin: {
      name: 'Metformin',
      class: 'Biguanide (Antihyperglycemic)',
      indication: "Alzheimer's Disease",
      nodes: [
        { id: 'drug', type: 'compound', label: 'Metformin', detail: 'Primary biguanide compound with dual neuro-metabolic activities.' },
        { id: 'target_ampk', type: 'target', label: 'AMPK α1/α2', affinity: 'Kd = 12.4 nM', detail: 'AMP-activated protein kinase activation; central energy sensor.' },
        { id: 'target_tnf', type: 'target', label: 'TNF-α', affinity: 'Kd = 45.1 nM', detail: 'Pro-inflammatory cytokine downregulated in microglia.' },
        { id: 'target_mtor', type: 'target', label: 'mTORC1', affinity: 'IC50 = 32.0 nM', detail: 'Mammalian target of rapamycin; inhibition stimulates autophagy.' },
        { id: 'mech_tau', type: 'mechanism', label: 'Tau Dephosphorylation', detail: 'Attenuation of Ser396 / Ser202 tau hyperphosphorylation.' },
        { id: 'mech_abeta', type: 'mechanism', label: 'Aβ Oligomer Clearance', detail: 'Enhanced lysosomal degradation of extracellular amyloid aggregates.' },
        { id: 'mech_inflam', type: 'mechanism', label: 'Microglial Calming', detail: 'Suppression of NF-kB nuclear translocation in reactive microglia.' },
        { id: 'disease', type: 'disease', label: "Alzheimer's Disease", detail: 'Primary neurodegenerative dementia target pathology.' }
      ]
    },
    donepezil: {
      name: 'Donepezil',
      class: 'Reversible Acetylcholinesterase Inhibitor',
      indication: 'Mild Cognitive Impairment',
      nodes: [
        { id: 'drug', type: 'compound', label: 'Donepezil', detail: 'Centrally active reversible piperidine AChE inhibitor.' },
        { id: 'target_ache', type: 'target', label: 'AChE Active Site', affinity: 'Kd = 5.7 nM', detail: 'Blocks breakdown of synaptic acetylcholine in cholinergic neurons.' },
        { id: 'target_sigma1', type: 'target', label: 'Sigma-1 Receptor', affinity: 'Kd = 14.6 nM', detail: 'Chaperone protein modulating calcium homeostasis and anti-apoptosis.' },
        { id: 'mech_synaptic', type: 'mechanism', label: 'Cholinergic Potentiation', detail: 'Restores neurotransmission in basal forebrain projections.' },
        { id: 'mech_mito', type: 'mechanism', label: 'Mitochondrial Stability', detail: 'Sigma-1 mediated reduction in oxidative stress.' },
        { id: 'disease', type: 'disease', label: 'Mild Cognitive Impairment', detail: 'Prodromal symptomatic memory decline.' }
      ]
    },
    imatinib: {
      name: 'Imatinib',
      class: 'Tyrosine Kinase Inhibitor',
      indication: "Parkinson's Disease",
      nodes: [
        { id: 'drug', type: 'compound', label: 'Imatinib', detail: '2-phenylaminopyrimidine derivative kinase inhibitor.' },
        { id: 'target_cabl', type: 'target', label: 'c-Abl Kinase', affinity: 'Kd = 8.1 nM', detail: 'Proto-oncogene tyrosine-protein kinase overactivated in Lewy body pathology.' },
        { id: 'mech_synuclein', type: 'mechanism', label: 'Alpha-Synuclein Clearance', detail: 'Inhibition of c-Abl prevents parkin inactivation and clears aggregates.' },
        { id: 'disease', type: 'disease', label: "Parkinson's Disease", detail: 'Substantia nigra dopaminergic neurodegeneration.' }
      ]
    }
  }

  const current = graphData[activeCompound]

  return (
    <div className="graph-page animate-fade-in">
      <div className="container">
        {/* Header */}
        <header className="graph-header">
          <div>
            <span className="section-mini-badge">PATHWAY PHARMACOPHORE MAP</span>
            <h1>Interactive Molecular Target Graph</h1>
            <p>
              Explore multi-tier relationships between repurposed compounds, molecular targets, biological mechanisms, and therapeutic indications.
            </p>
          </div>
          <div className="compound-selector-group">
            <button
              type="button"
              className={`compound-tab-btn ${activeCompound === 'metformin' ? 'active' : ''}`}
              onClick={() => { setActiveCompound('metformin'); setSelectedNode(null); }}
            >
              Metformin ➔ Alzheimer's
            </button>
            <button
              type="button"
              className={`compound-tab-btn ${activeCompound === 'donepezil' ? 'active' : ''}`}
              onClick={() => { setActiveCompound('donepezil'); setSelectedNode(null); }}
            >
              Donepezil ➔ MCI
            </button>
            <button
              type="button"
              className={`compound-tab-btn ${activeCompound === 'imatinib' ? 'active' : ''}`}
              onClick={() => { setActiveCompound('imatinib'); setSelectedNode(null); }}
            >
              Imatinib ➔ Parkinson's
            </button>
          </div>
        </header>

        {/* Visual Graph Canvas Card */}
        <div className="glass-panel graph-canvas-card">
          <div className="canvas-header">
            <span className="legend-item"><span className="legend-dot teal"></span> Compound</span>
            <span className="legend-item"><span className="legend-dot blue"></span> Molecular Target</span>
            <span className="legend-item"><span className="legend-dot green"></span> Cellular Mechanism</span>
            <span className="legend-item"><span className="legend-dot violet"></span> Clinical Indication</span>
          </div>

          <div className="interactive-svg-container">
            <svg className="knowledge-graph-svg" viewBox="0 0 900 480">
              <defs>
                <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.8" />
                </linearGradient>
                <filter id="glow-effect" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Connecting Edges */}
              {activeCompound === 'metformin' && (
                <>
                  <path className="graph-edge-line" d="M 120 240 L 320 120" />
                  <path className="graph-edge-line" d="M 120 240 L 320 240" />
                  <path className="graph-edge-line" d="M 120 240 L 320 360" />
                  <path className="graph-edge-line" d="M 450 120 L 600 120" />
                  <path className="graph-edge-line" d="M 450 240 L 600 240" />
                  <path className="graph-edge-line" d="M 450 360 L 600 360" />
                  <path className="graph-edge-line" d="M 720 120 L 810 240" />
                  <path className="graph-edge-line" d="M 720 240 L 810 240" />
                  <path className="graph-edge-line" d="M 720 360 L 810 240" />
                </>
              )}
              {activeCompound === 'donepezil' && (
                <>
                  <path className="graph-edge-line" d="M 140 240 L 360 160" />
                  <path className="graph-edge-line" d="M 140 240 L 360 320" />
                  <path className="graph-edge-line" d="M 480 160 L 620 160" />
                  <path className="graph-edge-line" d="M 480 320 L 620 320" />
                  <path className="graph-edge-line" d="M 720 160 L 800 240" />
                  <path className="graph-edge-line" d="M 720 320 L 800 240" />
                </>
              )}
              {activeCompound === 'imatinib' && (
                <>
                  <path className="graph-edge-line" d="M 160 240 L 380 240" />
                  <path className="graph-edge-line" d="M 500 240 L 660 240" />
                  <path className="graph-edge-line" d="M 740 240 L 800 240" />
                </>
              )}

              {/* Node Elements */}
              {activeCompound === 'metformin' && (
                <>
                  {/* Compound Node */}
                  <g className="svg-graph-node" onClick={() => setSelectedNode(current.nodes[0])}>
                    <circle cx="120" cy="240" r="42" className="node-shape compound" />
                    <text x="120" y="244" textAnchor="middle" className="svg-node-text bold">Metformin</text>
                  </g>

                  {/* Target Nodes */}
                  <g className="svg-graph-node" onClick={() => setSelectedNode(current.nodes[1])}>
                    <rect x="250" y="95" width="140" height="50" rx="10" className="node-shape target" />
                    <text x="320" y="120" textAnchor="middle" className="svg-node-text sm">AMPK α1/α2</text>
                    <text x="320" y="136" textAnchor="middle" className="svg-node-meta">Kd: 12.4 nM</text>
                  </g>
                  <g className="svg-graph-node" onClick={() => setSelectedNode(current.nodes[2])}>
                    <rect x="250" y="215" width="140" height="50" rx="10" className="node-shape target" />
                    <text x="320" y="240" textAnchor="middle" className="svg-node-text sm">TNF-α Cytokine</text>
                    <text x="320" y="256" textAnchor="middle" className="svg-node-meta">Kd: 45.1 nM</text>
                  </g>
                  <g className="svg-graph-node" onClick={() => setSelectedNode(current.nodes[3])}>
                    <rect x="250" y="335" width="140" height="50" rx="10" className="node-shape target" />
                    <text x="320" y="360" textAnchor="middle" className="svg-node-text sm">mTORC1</text>
                    <text x="320" y="376" textAnchor="middle" className="svg-node-meta">IC50: 32.0 nM</text>
                  </g>

                  {/* Mechanisms */}
                  <g className="svg-graph-node" onClick={() => setSelectedNode(current.nodes[4])}>
                    <rect x="520" y="95" width="160" height="50" rx="10" className="node-shape mechanism" />
                    <text x="600" y="125" textAnchor="middle" className="svg-node-text sm">Tau Dephosphorylation</text>
                  </g>
                  <g className="svg-graph-node" onClick={() => setSelectedNode(current.nodes[5])}>
                    <rect x="520" y="215" width="160" height="50" rx="10" className="node-shape mechanism" />
                    <text x="600" y="245" textAnchor="middle" className="svg-node-text sm">Aβ Aggregate Clearance</text>
                  </g>
                  <g className="svg-graph-node" onClick={() => setSelectedNode(current.nodes[6])}>
                    <rect x="520" y="335" width="160" height="50" rx="10" className="node-shape mechanism" />
                    <text x="600" y="365" textAnchor="middle" className="svg-node-text sm">Microglial Calming</text>
                  </g>

                  {/* Disease Node */}
                  <g className="svg-graph-node" onClick={() => setSelectedNode(current.nodes[7])}>
                    <circle cx="810" cy="240" r="45" className="node-shape disease" />
                    <text x="810" y="238" textAnchor="middle" className="svg-node-text bold">Alzheimer's</text>
                    <text x="810" y="254" textAnchor="middle" className="svg-node-meta">Disease</text>
                  </g>
                </>
              )}

              {activeCompound === 'donepezil' && (
                <>
                  <g className="svg-graph-node" onClick={() => setSelectedNode(current.nodes[0])}>
                    <circle cx="140" cy="240" r="42" className="node-shape compound" />
                    <text x="140" y="244" textAnchor="middle" className="svg-node-text bold">Donepezil</text>
                  </g>
                  <g className="svg-graph-node" onClick={() => setSelectedNode(current.nodes[1])}>
                    <rect x="290" y="135" width="140" height="50" rx="10" className="node-shape target" />
                    <text x="360" y="160" textAnchor="middle" className="svg-node-text sm">AChE Active Site</text>
                    <text x="360" y="176" textAnchor="middle" className="svg-node-meta">Kd: 5.7 nM</text>
                  </g>
                  <g className="svg-graph-node" onClick={() => setSelectedNode(current.nodes[2])}>
                    <rect x="290" y="295" width="140" height="50" rx="10" className="node-shape target" />
                    <text x="360" y="320" textAnchor="middle" className="svg-node-text sm">Sigma-1 Receptor</text>
                    <text x="360" y="336" textAnchor="middle" className="svg-node-meta">Kd: 14.6 nM</text>
                  </g>
                  <g className="svg-graph-node" onClick={() => setSelectedNode(current.nodes[3])}>
                    <rect x="540" y="135" width="160" height="50" rx="10" className="node-shape mechanism" />
                    <text x="620" y="165" textAnchor="middle" className="svg-node-text sm">Cholinergic Potentiation</text>
                  </g>
                  <g className="svg-graph-node" onClick={() => setSelectedNode(current.nodes[4])}>
                    <rect x="540" y="295" width="160" height="50" rx="10" className="node-shape mechanism" />
                    <text x="620" y="325" textAnchor="middle" className="svg-node-text sm">Mitochondrial Stability</text>
                  </g>
                  <g className="svg-graph-node" onClick={() => setSelectedNode(current.nodes[5])}>
                    <circle cx="800" cy="240" r="45" className="node-shape disease" />
                    <text x="800" y="238" textAnchor="middle" className="svg-node-text bold">MCI</text>
                    <text x="800" y="254" textAnchor="middle" className="svg-node-meta">Impairment</text>
                  </g>
                </>
              )}

              {activeCompound === 'imatinib' && (
                <>
                  <g className="svg-graph-node" onClick={() => setSelectedNode(current.nodes[0])}>
                    <circle cx="160" cy="240" r="42" className="node-shape compound" />
                    <text x="160" y="244" textAnchor="middle" className="svg-node-text bold">Imatinib</text>
                  </g>
                  <g className="svg-graph-node" onClick={() => setSelectedNode(current.nodes[1])}>
                    <rect x="310" y="215" width="140" height="50" rx="10" className="node-shape target" />
                    <text x="380" y="240" textAnchor="middle" className="svg-node-text sm">c-Abl Kinase</text>
                    <text x="380" y="256" textAnchor="middle" className="svg-node-meta">Kd: 8.1 nM</text>
                  </g>
                  <g className="svg-graph-node" onClick={() => setSelectedNode(current.nodes[2])}>
                    <rect x="570" y="215" width="160" height="50" rx="10" className="node-shape mechanism" />
                    <text x="650" y="245" textAnchor="middle" className="svg-node-text sm">α-Synuclein Clearance</text>
                  </g>
                  <g className="svg-graph-node" onClick={() => setSelectedNode(current.nodes[3])}>
                    <circle cx="800" cy="240" r="45" className="node-shape disease" />
                    <text x="800" y="238" textAnchor="middle" className="svg-node-text bold">Parkinson's</text>
                    <text x="800" y="254" textAnchor="middle" className="svg-node-meta">Disease</text>
                  </g>
                </>
              )}
            </svg>
          </div>

          <div className="graph-instructions">
            <span>💡 Tip: Click any node to inspect binding kinetics, affinities, and mechanistic details.</span>
          </div>
        </div>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="glass-panel node-inspector-card animate-fade-in">
            <div className="inspector-header">
              <span className={`badge-pill ${selectedNode.type === 'compound' ? 'teal' : selectedNode.type === 'target' ? 'blue' : 'green'}`}>
                {selectedNode.type.toUpperCase()}
              </span>
              <button type="button" className="close-btn" onClick={() => setSelectedNode(null)}>✕</button>
            </div>
            <h3>{selectedNode.label}</h3>
            {selectedNode.affinity && (
              <div className="affinity-line">
                <strong>Binding Affinity / IC50:</strong> <code>{selectedNode.affinity}</code>
              </div>
            )}
            <p className="node-desc-text">{selectedNode.detail}</p>
          </div>
        )}
      </div>
    </div>
  )
}
