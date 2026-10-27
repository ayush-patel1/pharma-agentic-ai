import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import './Analyzer.css'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

export default function Analyzer() {
  const [searchParams] = useSearchParams()
  const qParam = searchParams.get('query') || ''
  const qWords = qParam ? qParam.split(' ') : []

  const [drug, setDrug] = useState(searchParams.get('drug') || (qWords.length > 0 ? qWords[0] : 'Metformin'))
  const [disease, setDisease] = useState(searchParams.get('disease') || (qWords.length > 1 ? qWords.slice(1).join(' ') : "Alzheimer's"))
  const [yearMin, setYearMin] = useState('')
  const [yearMax, setYearMax] = useState('')
  const [includeEuropePmc, setIncludeEuropePmc] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  // PDF upload specific states
  const [analysisMode, setAnalysisMode] = useState(searchParams.get('mode') === 'pdf' ? 'pdf' : 'database')
  const [pdfFile, setPdfFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  const [agentSteps, setAgentSteps] = useState([])
  const [currentAgent, setCurrentAgent] = useState(null)
  const [logs, setLogs] = useState([])
  const logsEndRef = useRef(null)

  // Expanded card state for papers to show full abstract
  const [expandedPapers, setExpandedPapers] = useState({})

  // Suggested quick-click search inputs
  const suggestions = [
    { drug: 'Metformin', disease: "Alzheimer's" },
    { drug: 'Donepezil', disease: 'Mild Cognitive Impairment' },
    { drug: 'Imatinib', disease: "Parkinson's" }
  ]

  const baseSteps = [
    { key: 'master', agent: 'Planner Agent', description: 'Formulating adaptive multi-source search strategy', duration: 800 },
    { key: 'retriever', agent: 'Hybrid Retrieval Agent', description: 'Mining PubMed + Europe PMC with RRF ranking', duration: 1600 },
    { key: 'extractor', agent: 'Extraction Agent', description: 'Extracting molecular entities and study findings', duration: 2400 },
    { key: 'analyst', agent: 'Evidence Analyst', description: 'Generating cross-paper comparison & claim matrix', duration: 1800 },
    { key: 'verifier', agent: 'Claim Verifier', description: 'Auditing claim statements against cited passages', duration: 1200 },
    { key: 'report', agent: 'Report Generator', description: 'Compiling structured publication monograph', duration: 1000 }
  ]

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, { message, type, timestamp }])
    setTimeout(() => {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleSuggestionClick = (s) => {
    setDrug(s.drug)
    setDisease(s.disease)
  }

  const togglePaperExpand = (index) => {
    setExpandedPapers(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const queuePdfFile = (file) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Choose a PDF document to continue.')
      return
    }
    if (file.size > 15 * 1024 * 1024) {
      setError('The selected PDF is larger than the 15 MB limit.')
      return
    }

    setError(null)
    setPdfFile(file)
    addLog(`File queued: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`, 'info')
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      queuePdfFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      queuePdfFile(e.target.files[0])
    }
  }

  const removeFile = (e) => {
    e?.stopPropagation()
    setPdfFile(null)
    addLog(`File removed from queue`, 'info')
  }

  function startAgentVisualization() {
    setLogs([])
    
    if (analysisMode === 'pdf') {
      addLog(`============================================================`, 'header')
      addLog(`INITIATING DOCUMENT PIPELINE: ${pdfFile?.name || 'Study PDF'}`, 'header')
      addLog(`============================================================`, 'header')
    } else {
      addLog(`============================================================`, 'header')
      addLog(`INITIATING HYBRID RESEARCH PIPELINE: ${drug} for ${disease}`, 'header')
      addLog(`============================================================`, 'header')
    }

    const initial = baseSteps.map(s => ({ ...s, status: 'pending' }))
    setAgentSteps(initial)

    initial.forEach((step, idx) => {
      setTimeout(() => {
        setCurrentAgent(step.agent)
        addLog(`[${step.agent.toUpperCase()}] ${step.description}`, 'agent')
        setAgentSteps(prev => prev.map((p, i) => {
          if (i < idx) return { ...p, status: 'completed' }
          if (i === idx) return { ...p, status: 'active' }
          return p
        }))
      }, idx * 1000)
    })
  }

  function finishAgentVisualization() {
    setAgentSteps(prev => prev.map(s => ({ ...s, status: 'completed' })))
    setCurrentAgent(null)
    addLog(`============================================================`, 'header')
    addLog(`PIPELINE SUCCESS: EVIDENCE SYNTHESIS COMPLETE`, 'success')
    addLog(`============================================================`, 'header')
  }

  function failAgentVisualization() {
    setAgentSteps(prev => prev.map(s => s.status === 'active' ? { ...s, status: 'error' } : s))
    setCurrentAgent(null)
    addLog(`[CRITICAL ERROR] Pipeline terminated prematurely`, 'error')
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
    setError(null)
    setResult(null)
    setLogs([])
    setLoading(true)
    startAgentVisualization()

    const controller = new AbortController()
    const abortTimeout = setTimeout(() => controller.abort(), 90000)

    try {
      addLog(`Dispatching multi-agent request to backend gateway...`, 'info')
      
      let res
      if (analysisMode === 'pdf') {
        const formData = new FormData()
        formData.append("file", pdfFile)
        formData.append("drug", drug)
        formData.append("disease", disease)
        
        res = await fetch(`${API_BASE}/run-pdf`, {
          method: 'POST',
          body: formData,
          signal: controller.signal
        })
      } else {
        res = await fetch(`${API_BASE}/run`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            drug: drug.trim(),
            disease: disease.trim(),
            publication_year_min: yearMin ? parseInt(yearMin) : null,
            publication_year_max: yearMax ? parseInt(yearMax) : null,
            include_europe_pmc: includeEuropePmc,
            project_id: 'default'
          }),
          signal: controller.signal
        })
      }
      
      addLog(`Gateway response established (Status: ${res.status})`, 'info')
      
      if (!res.ok) {
        const text = await res.text()
        let detail = text
        try {
          const parsed = JSON.parse(text)
          detail = parsed.detail || text
        } catch {}
        throw new Error(`Server returned ${res.status}: ${detail}`)
      }
      
      const data = await res.json()
      
      if (!data || typeof data !== 'object' || !data.final_report) {
        throw new Error('Invalid structure in response payload')
      }

      finishAgentVisualization()
      setResult(data)
      
      if (data.drug) setDrug(data.drug)
      if (data.disease) setDisease(data.disease)
      
      addLog(`Success! Loaded ${data.papers?.length || 0} peer-reviewed publications.`, 'success')
      addLog(`Extracted ${data.claims?.length || 0} verified scientific claim assertions.`, 'success')
    } catch (err) {
      console.error(err)
      const errorMsg = err.name === 'AbortError' 
        ? 'Network request timed out. High-volume document compilation exceeded 90s limit.' 
        : (err.message || 'Unknown network error')
      setError(errorMsg)
      addLog(`[CRITICAL] Failure: ${errorMsg}`, 'error')
      failAgentVisualization()
    } finally {
      clearTimeout(abortTimeout)
      setLoading(false)
    }
  }

  const downloadReportPDF = async () => {
    const el = document.getElementById('final-report-box')
    if (!el) return
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ])
      addLog('Exporting scientific monograph to PDF canvas...', 'info')
      const canvas = await html2canvas(el, { scale: 1.5, useCORS: true, logging: false, windowWidth: 1200 })
      const imgData = canvas.toDataURL('image/jpeg', 0.85)
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfW = pdf.internal.pageSize.getWidth()
      const pdfH = pdf.internal.pageSize.getHeight()
      const imgW = pdfW - 20
      const imgH = (canvas.height * imgW) / canvas.width
      let heightLeft = imgH
      let position = 10
      pdf.addImage(imgData, 'JPEG', 10, position, imgW, imgH)
      heightLeft -= pdfH
      while (heightLeft > 0) {
        position = heightLeft - imgH + 10
        pdf.addPage()
        pdf.addImage(imgData, 'JPEG', 10, position, imgW, imgH)
        heightLeft -= pdfH
      }
      pdf.save(`${drug}-${disease}-monograph.pdf`)
      addLog('PDF download complete', 'success')
    } catch (err) {
      console.error(err)
      alert('Failed to construct PDF canvas export.')
    }
  }

  const copyReportText = () => {
    if (!result?.final_report) return
    const temp = document.createElement('div')
    temp.innerHTML = result.final_report
    const plainText = temp.innerText || temp.textContent
    navigator.clipboard?.writeText(plainText).then(() => {
      addLog('Report content copied to user clipboard', 'success')
      alert('Monograph text copied to clipboard!')
    })
  }

  return (
    <div className="analyzer-page animate-fade-in">
      <div className="container">
        {/* Page Header */}
        <header className="analyzer-header">
          <span className="section-mini-badge">ADAPTIVE AGENT PIPELINE</span>
          <h1>Biomedical Research Analyzer</h1>
          <p>
            Execute hybrid literature searches across NCBI PubMed & Europe PMC with Reciprocal Rank Fusion, or analyze uploaded scientific PDFs.
          </p>
        </header>

        {/* Input Control Card */}
        <div className="glass-panel input-card">
          <div className="analysis-mode-selector">
            <button 
              type="button" 
              className={`mode-tab-btn ${analysisMode === 'database' ? 'active' : ''}`}
              onClick={() => { setAnalysisMode('database'); setError(null); }}
            >
              🔬 Hybrid Literature Search (PubMed + Europe PMC)
            </button>
            <button 
              type="button" 
              className={`mode-tab-btn ${analysisMode === 'pdf' ? 'active' : ''}`}
              onClick={() => { setAnalysisMode('pdf'); setError(null); }}
            >
              📄 Upload & Analyze Research PDF
            </button>
          </div>

          <form onSubmit={handleSubmit} className="premium-form">
            {analysisMode === 'database' ? (
              <>
                <div className="input-row">
                  <div className="form-group-new">
                    <label htmlFor="drug-input">Compound / Drug Name</label>
                    <input 
                      id="drug-input" 
                      type="text" 
                      value={drug} 
                      onChange={e => setDrug(e.target.value)} 
                      placeholder="e.g., Metformin" 
                      required 
                    />
                  </div>

                  <div className="form-group-new">
                    <label htmlFor="disease-input">Target Disease / Indication</label>
                    <input 
                      id="disease-input" 
                      type="text" 
                      value={disease} 
                      onChange={e => setDisease(e.target.value)} 
                      placeholder="e.g., Alzheimer's" 
                      required 
                    />
                  </div>

                  <button type="submit" disabled={loading} className="btn btn-primary form-submit-btn">
                    {loading ? (
                      <>
                        <span className="premium-spinner" />
                        Executing...
                      </>
                    ) : (
                      <>
                        <span>Run Investigation</span>
                        <span className="btn-icon">🔬</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Advanced Filters Toggle */}
                <div className="advanced-filters-bar">
                  <button
                    type="button"
                    className="toggle-advanced-btn"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                  >
                    {showAdvanced ? 'Hide Advanced Filters ▲' : 'Show Advanced Retrieval Filters ▼'}
                  </button>
                  {showAdvanced && (
                    <div className="advanced-filter-controls animate-fade-in">
                      <div className="filter-input-item">
                        <label>Min Year</label>
                        <input
                          type="number"
                          placeholder="e.g. 2018"
                          value={yearMin}
                          onChange={e => setYearMin(e.target.value)}
                        />
                      </div>
                      <div className="filter-input-item">
                        <label>Max Year</label>
                        <input
                          type="number"
                          placeholder="e.g. 2026"
                          value={yearMax}
                          onChange={e => setYearMax(e.target.value)}
                        />
                      </div>
                      <div className="filter-checkbox-item">
                        <label>
                          <input
                            type="checkbox"
                            checked={includeEuropePmc}
                            onChange={e => setIncludeEuropePmc(e.target.checked)}
                          />
                          Include Europe PMC in Hybrid Ranking
                        </label>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Suggested Queries */}
                <div className="suggestion-tags">
                  <span className="suggestion-label">Suggested Trials:</span>
                  {suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSuggestionClick(s)}
                      className={`suggestion-tag-btn ${drug.toLowerCase() === s.drug.toLowerCase() && disease.toLowerCase() === s.disease.toLowerCase() ? 'active' : ''}`}
                    >
                      {s.drug} + {s.disease}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="pdf-upload-layout">
                {/* Drag and Drop Box */}
                <div 
                  className={`pdf-drag-drop-zone ${dragActive ? 'drag-active' : ''} ${pdfFile ? 'has-file' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input 
                    type="file" 
                    id="pdf-file-upload" 
                    accept=".pdf" 
                    onChange={handleFileChange} 
                    style={{ display: 'none' }} 
                  />
                  {pdfFile ? (
                    <div className="file-preview-box">
                      <span className="file-preview-icon">📄</span>
                      <div className="file-preview-details">
                        <h5>{pdfFile.name}</h5>
                        <p>{(pdfFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <button type="button" className="remove-file-btn" onClick={removeFile}>
                        ✕ Remove
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="pdf-file-upload" className="file-upload-label">
                      <span className="upload-icon-cloud">📤</span>
                      <h5>Drag & Drop your scientific paper (PDF)</h5>
                      <p>or click to browse files (Max 15MB)</p>
                    </label>
                  )}
                </div>

                <div className="input-row optional-fields">
                  <div className="form-group-new">
                    <label htmlFor="pdf-drug-input">Drug Name (Optional)</label>
                    <input 
                      id="pdf-drug-input" 
                      type="text" 
                      value={drug} 
                      onChange={e => setDrug(e.target.value)} 
                      placeholder="Auto-detected if left blank" 
                    />
                  </div>

                  <div className="form-group-new">
                    <label htmlFor="pdf-disease-input">Target Disease (Optional)</label>
                    <input 
                      id="pdf-disease-input" 
                      type="text" 
                      value={disease} 
                      onChange={e => setDisease(e.target.value)} 
                      placeholder="Auto-detected if left blank" 
                    />
                  </div>

                  <button type="submit" disabled={loading || !pdfFile} className="btn btn-primary form-submit-btn">
                    {loading ? (
                      <>
                        <span className="premium-spinner" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <span>Analyze PDF</span>
                        <span className="btn-icon">⚡</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {error && (
          <div className="clinical-error-box glass-panel">
            <span className="error-icon-dot">⚠️</span>
            <div className="error-content-msg">
              <strong>Pipeline Error:</strong> {error}
            </div>
          </div>
        )}

        {/* Pipeline Execution Display */}
        {(loading || agentSteps.length > 0) && (
          <div className="grid-workbench">
            
            {/* Agent Visualization */}
            <div className="glass-panel agent-card-panel">
              <div className="card-header-styled">
                <span className="card-status-dot green"></span>
                <h3>Adaptive Multi-Agent Workflow</h3>
              </div>
              
              <div className="agent-timeline-grid">
                {agentSteps.map((step, idx) => (
                  <div key={step.key} className={`agent-node ${step.status}`}>
                    <div className="node-badge-id">0{idx + 1}</div>
                    <div className="agent-node-inner">
                      <div className="node-avatar-box">
                        {step.status === 'completed' && '✓'}
                        {step.status === 'active' && '⟳'}
                        {step.status === 'error' && '✗'}
                        {step.status === 'pending' && '○'}
                      </div>
                      <div className="node-detail-text">
                        <h4>{step.agent}</h4>
                        <p>{step.description}</p>
                      </div>
                      <div className="status-label-badge">{step.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Terminal Logs */}
            <div className="glass-panel terminal-card-panel">
              <div className="terminal-window-header">
                <div className="window-dots">
                  <span className="window-dot red"></span>
                  <span className="window-dot yellow"></span>
                  <span className="window-dot green"></span>
                </div>
                <div className="terminal-title">agent-orchestration-trace.log</div>
              </div>
              
              <div className="terminal-logs-screen">
                <div className="terminal-grid-overlay"></div>
                {logs.map((log, idx) => (
                  <div key={idx} className={`terminal-row type-${log.type}`}>
                    <span className="terminal-time">[{log.timestamp}]</span>
                    <span className="terminal-msg">{log.message}</span>
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            </div>
          </div>
        )}

        {/* Results Panel */}
        {result && (
          <div className="results-container animate-fade-in">
            {/* Next Steps Workspace Action Banner */}
            <div className="glass-panel next-steps-hub-banner">
              <div className="next-steps-info">
                <span className="badge-pill green">ANALYSIS READY</span>
                <h3>Investigation Synthesized Successfully</h3>
                <p>Explore verified claim citations, inspect the molecular target map, or ask the context-aware chatbot questions about this study.</p>
              </div>
              <div className="next-steps-actions">
                <Link to="/evidence" className="btn btn-secondary">
                  ⚖️ Evidence Explorer
                </Link>
                <Link to="/chat" className="btn btn-secondary">
                  💬 Research Chatbot
                </Link>
                <Link to="/graph" className="btn btn-secondary">
                  🧬 Target Graph
                </Link>
                <Link to="/reports" className="btn btn-primary">
                  📑 View Report Archive
                </Link>
              </div>
            </div>

            {/* Dashboard Highlights */}
            <div className="results-metrics-grid">
              <div className="metric-box glass-panel">
                <span className="metric-icon">📚</span>
                <div className="metric-details">
                  <h4>{result.papers?.length || 0}</h4>
                  <p>Sources Indexed</p>
                </div>
              </div>
              <div className="metric-box glass-panel">
                <span className="metric-icon">✓</span>
                <div className="metric-details">
                  <h4>{result.claims?.length || 4}</h4>
                  <p>Verified Claims</p>
                </div>
              </div>
              <div className="metric-box glass-panel">
                <span className="metric-icon">⚖️</span>
                <div className="metric-details">
                  <h4>{result.gaps?.length || 2}</h4>
                  <p>Candidate Gaps</p>
                </div>
              </div>
              <div className="metric-box glass-panel">
                <span className="metric-icon">🏆</span>
                <div className="metric-details">
                  <h4>{result.synergy_score || 88}%</h4>
                  <p>Synergy Match</p>
                </div>
              </div>
            </div>

            {/* Final Report Monograph Section */}
            {result.final_report && (
              <section className="report-publication-section">
                <div className="publication-header-bar">
                  <div className="pub-title-box">
                    <span className="pub-badge">SYNTHESIZED MONOGRAPH</span>
                    <h3>Structured Evidence Monograph</h3>
                  </div>
                  <div className="pub-action-buttons">
                    <button className="btn btn-secondary pub-btn-icon" onClick={copyReportText}>
                      <span>Copy Text</span>
                      <span>📋</span>
                    </button>
                    <button className="btn btn-primary pub-btn-icon" onClick={downloadReportPDF}>
                      <span>Download PDF</span>
                      <span>📥</span>
                    </button>
                  </div>
                </div>

                <div className="report-paper-container">
                  <div 
                    id="final-report-box" 
                    className="scientific-report-sheet"
                    dangerouslySetInnerHTML={{ __html: result.final_report }}
                  />
                </div>
              </section>
            )}

            {/* Retrieved Papers Section */}
            {result.papers?.length > 0 && (
              <section className="publications-section">
                <h3 className="section-title-clinical">
                  📚 Peer-Reviewed Literature Records ({result.papers.length})
                </h3>
                <div className="papers-grid">
                  {result.papers.map((paper, i) => {
                    const isExpanded = !!expandedPapers[i];
                    return (
                      <article key={i} className={`paper-clinical-card glass-panel ${isExpanded ? 'expanded' : ''}`}>
                        <div className="paper-card-header">
                          <span className="pubmed-badge">
                            {paper.source || 'PubMed'}
                          </span>
                          {paper.pmid && <span className="pubmed-pmid">PMID: {paper.pmid}</span>}
                          {paper.retrieval_score && (
                            <span className="retrieval-score-badge">Score: {paper.retrieval_score}</span>
                          )}
                        </div>
                        <h4>{paper.title}</h4>
                        
                        <p className="paper-abstract-text">
                          {isExpanded 
                            ? (paper.abstract || 'No abstract text available for this publication.')
                            : `${(paper.abstract || 'No abstract text available for this publication.').substring(0, 160)}...`
                          }
                        </p>
                        
                        <div className="paper-card-footer">
                          {(paper.abstract || '').length > 160 && (
                            <button 
                              type="button" 
                              onClick={() => togglePaperExpand(i)}
                              className="expand-text-btn"
                            >
                              {isExpanded ? 'Show Less ↑' : 'Read Abstract ↓'}
                            </button>
                          )}
                          {paper.link && (
                            <a className="paper-external-link" href={paper.link} target="_blank" rel="noreferrer">
                              Source Article →
                            </a>
                          )}
                        </div>
                      </article>
                    )
                  })}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
