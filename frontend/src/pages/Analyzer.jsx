import { useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import './Analyzer.css'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

export default function Analyzer() {
  const [searchParams] = useSearchParams()
  const [drug, setDrug] = useState('')
  const [disease, setDisease] = useState('')
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
    { key: 'master', agent: 'Master Agent', description: 'Orchestrating analysis plan', duration: 900 },
    { key: 'search', agent: 'Search Agent', description: 'Mining scientific publications', duration: 1800 },
    { key: 'summarize', agent: 'Summarizer Agent', description: 'Extracting study findings via LLM', duration: 3000 },
    { key: 'report', agent: 'Report Agent', description: 'Compiling structured monograph', duration: 1400 }
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

  // Drag and drop handlers
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
      e.target.value = ''
    }
  }

  const removeFile = (e) => {
    e?.stopPropagation()
    setPdfFile(null)
    addLog(`File removed from queue`, 'info')
  }

  function startAgentVisualization() {
    setLogs([])
    setAgentSteps([{
      key: 'request',
      agent: 'Analysis request',
      description: analysisMode === 'pdf' ? 'Waiting for the uploaded document analysis response' : 'Waiting for the literature analysis response',
      status: 'active'
    }])
    setCurrentAgent('Waiting for backend response')
    addLog('Analysis request submitted', 'info')
  }

  function finishAgentVisualization() {
    setAgentSteps(prev => prev.map(s => ({ ...s, status: 'completed' })))
    setCurrentAgent(null)
    addLog('Analysis response received', 'success')
  }

  function failAgentVisualization() {
    setAgentSteps(prev => prev.map(s => s.status === 'active' ? { ...s, status: 'error' } : s))
    setCurrentAgent(null)
    addLog('Analysis request failed', 'error')
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (analysisMode === 'pdf' && !pdfFile) {
      setError('Choose a PDF document before starting the analysis.')
      return
    }
    setError(null)
    setResult(null)
    setLogs([])
    setLoading(true)
    startAgentVisualization()

    let abortTimeout
    try {
      const controller = new AbortController()
      abortTimeout = setTimeout(() => controller.abort(), 90000)

      addLog(`Sending fetch request to backend gateway...`, 'info')
      
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
          body: JSON.stringify({ drug, disease }),
          signal: controller.signal
        })
      }
      
      clearTimeout(abortTimeout)
      addLog(`Gateway response established (Status: ${res.status})`, 'info')
      
      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Server returned ${res.status}: ${text}`)
      }
      
      const data = await res.json()
      
      if (!data || typeof data !== 'object' || !data.final_report) {
        throw new Error('Invalid structure in response payload')
      }

      finishAgentVisualization()
      setResult(data)
      
      // Update local input state if backend auto-detected drug/disease from PDF
      if (data.drug) setDrug(data.drug)
      if (data.disease) setDisease(data.disease)
      
      addLog(`Success! Scientific monograph loaded (${data.final_report.length} chars)`, 'success')
    } catch (err) {
      console.error(err)
      const errorMsg = err.name === 'AbortError' 
        ? 'Network request timed out. High-volume document compilation exceeded 90s limit.' 
        : (err.message || 'Unknown network error')
      setError(errorMsg)
      addLog(`[CRITICAL] Connection failure: ${errorMsg}`, 'error')
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
      const canvas = await html2canvas(el, { 
        scale: 1.5,
        useCORS: true,
        logging: false,
        windowWidth: 1200
      })
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
      addLog('PDF download triggered successfully', 'success')
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
      alert('Clinical report text copied to clipboard!')
    }).catch(err => {
      console.error(err)
      alert('Clipboard copy operation failed.')
    })
  }

  return (
    <div className="analyzer-page">
      <div className="container">
        {/* Page Header */}
        <header className="analyzer-header">
          <span className="section-mini-badge">NEW ANALYSIS</span>
          <h1>Explore a research question</h1>
          <p>
            Search PubMed for a compound and indication, or analyze a research PDF alongside related publications.
          </p>
        </header>

        {/* Input Control Card */}
        <div className="glass-panel input-card">
          <div className="analysis-mode-selector">
            <button 
              type="button" 
              className={`mode-tab-btn ${analysisMode === 'database' ? 'active' : ''}`}
              onClick={() => {
                setAnalysisMode('database')
                setError(null)
              }}
            >
              Search PubMed
            </button>
            <button 
              type="button" 
              className={`mode-tab-btn ${analysisMode === 'pdf' ? 'active' : ''}`}
              onClick={() => {
                setAnalysisMode('pdf')
                setError(null)
              }}
            >
              Analyze an uploaded PDF
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
                        <span>Run Analysis</span>
                        <span className="btn-icon">🔬</span>
                      </>
                    )}
                  </button>
                </div>
                
                {/* Suggested Queries */}
                <div className="suggestion-tags">
                  <span className="suggestion-label">Try a PubMed query:</span>
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

                <p className="file-processing-notice">
                  Extracted document text is sent to the configured AI provider for analysis. Do not upload confidential or identifiable information.
                </p>

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
                  <strong>Analysis could not be completed:</strong> {error}
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
                <h3>Request status</h3>
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
                    {idx < agentSteps.length - 1 && (
                      <div className={`arrow-path-connector ${step.status === 'completed' ? 'active' : ''}`}>
                        <div className="flow-dash"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="system-data-readout">
                <div className="readout-title">Analysis details</div>
                <div className="readout-row">
                  <span className="readout-label">Analysis Target:</span>
                  <span className="readout-value">
                    {analysisMode === 'pdf' && pdfFile ? `Uploaded document (${pdfFile.name}) + PubMed` : 'PubMed literature search'}
                  </span>
                </div>
                <div className="readout-row">
                  <span className="readout-label">Research question:</span>
                  <span className="readout-value">{drug && disease ? `${drug} + ${disease}` : 'Detected from uploaded document'}</span>
                </div>
                {currentAgent && (
                  <div className="readout-row active-readout">
                    <span className="readout-label">Processing Stage:</span>
                    <span className="readout-value glowing-cyan">{currentAgent}</span>
                  </div>
                )}
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
                <div className="terminal-title">analysis-request.log</div>
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
            {/* Dashboard Highlights */}
            <div className="results-metrics-grid">
              <div className="metric-box glass-panel">
                <span className="metric-icon">📚</span>
                <div className="metric-details">
                  <h4>{result.papers?.length || 0}</h4>
                  <p>{analysisMode === 'pdf' ? 'Sources Reviewed' : 'PubMed Records'}</p>
                </div>
              </div>
              <div className="metric-box glass-panel">
                <span className="metric-icon">✨</span>
                <div className="metric-details">
                  <h4>{result.summaries?.length || 0}</h4>
                  <p>AI Summaries</p>
                </div>
              </div>
              <div className="metric-box glass-panel">
                <span className="metric-icon">📄</span>
                <div className="metric-details">
                  <h4>{(result.final_report.length / 1024).toFixed(1)} KB</h4>
                  <p>Report Compiled</p>
                </div>
              </div>
              <div className="metric-box glass-panel">
                <span className="metric-icon">🏆</span>
                <div className="metric-details">
                  <h4>{analysisMode === 'pdf' ? 'PDF + PubMed' : 'PubMed literature'}</h4>
                  <p>Source used</p>
                </div>
              </div>
            </div>

            <div className="results-source-note">
              <span className="results-note-mark" aria-hidden="true">!</span>
              <div>
                <h3>Evidence scope</h3>
                <p>
                  {analysisMode === 'pdf'
                    ? 'This review includes extracted text from the uploaded document and related PubMed records when available.'
                    : 'Literature records were retrieved from PubMed using both research terms in titles or abstracts.'}
                  {' '}Generated summaries and reports need to be checked against their original sources. No clinical safety, efficacy, or regulatory assessment is provided.
                </p>
              </div>
            </div>

            {/* Final Report Monograph Section */}
            {result.final_report && (
              <section className="report-publication-section">
                <div className="publication-header-bar">
                  <div className="pub-title-box">
                    <span className="pub-badge">FINAL REPORT</span>
                    <h3>Structured Repurposing Monograph</h3>
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
                  {analysisMode === 'pdf' ? '📚 Uploaded Document & Retrieved Literature' : '📚 PubMed Literature'}
                </h3>
                <div className="papers-grid">
                  {result.papers.map((paper, i) => {
                    const isExpanded = !!expandedPapers[i];
                    return (
                      <article key={i} className={`paper-clinical-card glass-panel ${isExpanded ? 'expanded' : ''}`}>
                        <div className="paper-card-header">
                          <span className="pubmed-badge">
                            {paper.source === 'uploaded_pdf' ? 'Uploaded PDF' : 'PubMed'}
                          </span>
                          {paper.pmid && <span className="pubmed-pmid">PMID: {paper.pmid}</span>}
                        </div>
                        <h4>{paper.title}</h4>
                        
                        <p className="paper-abstract-text">
                          {isExpanded 
                            ? (paper.abstract || 'No abstract is available for this PubMed record.')
                            : `${(paper.abstract || 'No abstract is available for this PubMed record.').substring(0, 160)}...`
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

            {/* AI Generated Summaries Section */}
            {result.summaries?.length > 0 && (
              <section className="summaries-section">
                <h3 className="section-title-clinical">✨ AI-Generated Study Summaries</h3>
                <div className="summaries-grid">
                  {result.summaries.map((s, i) => (
                    <div key={i} className="summary-clinical-card glass-panel">
                      <div className="summary-card-header">
                        <span className="nlp-badge">Generated summary</span>
                      </div>
                      <h4>{s.title}</h4>
                      <div className="summary-highlights-list">
                        {s.summary_raw.split('\n').map((line, idx) => {
                          const trimmed = line.trim()
                          if (!trimmed) return null
                          const content = trimmed.startsWith('*') || trimmed.startsWith('-')
                            ? trimmed.substring(1).trim()
                            : trimmed
                          const formattedContent = content.split(/(\*\*.*?\*\*)/g).map((part, partIndex) => (
                            part.startsWith('**') && part.endsWith('**')
                              ? <strong key={partIndex}>{part.slice(2, -2)}</strong>
                              : part
                          ))
                          
                          if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
                            return (
                              <div key={idx} className="summary-bullet">
                                <span className="bullet-dot-teal"></span>
                                <p>{formattedContent}</p>
                              </div>
                            )
                          }
                          
                          return (
                            <p 
                              key={idx} 
                              className="summary-paragraph" 
                            >{formattedContent}</p>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
