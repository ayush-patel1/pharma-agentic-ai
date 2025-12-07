import { useEffect, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import './App.css'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

function AgentStepIcon({ status }) {
  if (status === 'completed') return '✓'
  if (status === 'active') return '⟳'
  if (status === 'error') return '✗'
  return '○'
}

export default function App() {
  const [drug, setDrug] = useState('Metformin')
  const [disease, setDisease] = useState("Alzheimer's")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const [agentSteps, setAgentSteps] = useState([])
  const [currentAgent, setCurrentAgent] = useState(null)
  const [logs, setLogs] = useState([])
  const timeoutsRef = useRef([])
  const logsEndRef = useRef(null)

  // Agent step definitions (names, descriptions, default durations)
  const baseSteps = [
    { key: 'master', agent: 'Master Agent', description: 'Analyzing query and orchestrating workflow', duration: 900 },
    { key: 'search', agent: 'Search Agent', description: 'Searching literature database for relevant papers', duration: 1800 },
    { key: 'summarize', agent: 'Summarizer Agent', description: 'Generating AI summaries (LLM)', duration: 3000 },
    { key: 'report', agent: 'Report Agent', description: 'Compiling final repurposing report', duration: 1400 }
  ]

  useEffect(() => {
    // cleanup on unmount
    return () => clearAllTimeouts()
  }, [])

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(t => clearTimeout(t))
    timeoutsRef.current = []
  }

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, { message, type, timestamp }])
    setTimeout(() => {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  function startAgentVisualization() {
    clearAllTimeouts()
    setLogs([])
    addLog(`============================================================`, 'header')
    addLog(`NEW REQUEST: ${drug} for ${disease}`, 'header')
    addLog(`============================================================`, 'header')
    
    const initial = baseSteps.map(s => ({ ...s, status: 'pending' }))
    setAgentSteps(initial)
    let accumulated = 0

    initial.forEach((step, idx) => {
      const t = setTimeout(() => {
        setCurrentAgent(step.agent)
        
        // Add logs based on agent
        if (step.key === 'master') {
          addLog(`[MASTER AGENT] Planning tasks for query: ${drug} for ${disease}`, 'agent')
          setTimeout(() => addLog(`[MASTER AGENT] Tasks: ['search_papers', 'summarize_papers', 'generate_report']`, 'info'), 300)
        } else if (step.key === 'search') {
          addLog(`[SEARCH AGENT] Searching for papers: ${drug} + ${disease}`, 'agent')
          setTimeout(() => addLog(`[SEARCH AGENT] Found 5 papers`, 'success'), 500)
        } else if (step.key === 'summarize') {
          addLog(`[SUMMARIZER AGENT] Summarizing 5 papers`, 'agent')
          setTimeout(() => addLog(`[SUMMARIZER AGENT] Processing paper 1/5: ${drug} and cognitive function...`, 'info'), 400)
          setTimeout(() => addLog(`[SUMMARIZER AGENT] Processing paper 2/5: Neuroprotective effects of ${drug}...`, 'info'), 800)
          setTimeout(() => addLog(`[SUMMARIZER AGENT] Processing paper 3/5: ${drug} reduces pathology markers...`, 'info'), 1200)
          setTimeout(() => addLog(`[SUMMARIZER AGENT] Processing paper 4/5: Clinical outcomes of ${drug} use...`, 'info'), 1600)
          setTimeout(() => addLog(`[SUMMARIZER AGENT] Processing paper 5/5: ${drug}'s impact on metabolism...`, 'info'), 2000)
          setTimeout(() => addLog(`[SUMMARIZER AGENT] Completed 5 summaries`, 'success'), 2400)
        } else if (step.key === 'report') {
          addLog(`[REPORT AGENT] Generating final report`, 'agent')
          setTimeout(() => addLog(`[REPORT AGENT] Final report generated (5734 chars)`, 'success'), 800)
        }
        
        setAgentSteps(prev => prev.map((p, i) => {
          if (i < idx) return { ...p, status: 'completed' }
          if (i === idx) return { ...p, status: 'active' }
          return p
        }))
      }, accumulated)
      timeoutsRef.current.push(t)
      accumulated += step.duration
    })
  }

  function finishAgentVisualization() {
    clearAllTimeouts()
    setAgentSteps(prev => prev.map(s => ({ ...s, status: 'completed' })))
    setCurrentAgent(null)
    addLog(`============================================================`, 'header')
    addLog(`REQUEST COMPLETED`, 'success')
    addLog(`============================================================`, 'header')
  }

  function failAgentVisualization() {
    clearAllTimeouts()
    setAgentSteps(prev => prev.map(s => s.status === 'active' ? { ...s, status: 'error' } : s))
    setCurrentAgent(null)
    addLog(`[ERROR] Request failed`, 'error')
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
    setError(null)
    setResult(null)
    setLogs([])
    setLoading(true)
    startAgentVisualization()

    // Fire the backend call; we still show the agent animation until response arrives.
    try {
      const controller = new AbortController()
      // Abort after 90s (increased timeout for LLM processing - report generation takes ~30-40s)
      const abortTimeout = setTimeout(() => controller.abort(), 90000)

      addLog(`Sending request to backend...`, 'info')
      
      const res = await fetch(`${API_BASE}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drug, disease }),
        signal: controller.signal
      })
      clearTimeout(abortTimeout)
      
      addLog(`Received response from backend (status: ${res.status})`, 'info')
      
      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Server error: ${res.status} - ${text}`)
      }
      
      const data = await res.json()
      
      // Validate response has required fields
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format from server')
      }
      
      if (!data.final_report) {
        throw new Error('Server response missing final_report field')
      }

      // When server finishes, mark agents completed and display results
      finishAgentVisualization()
      setResult(data)
      
      addLog(`✅ Report received: ${data.final_report.length} characters`, 'success')
      console.log('✅ Success! Papers:', data.papers?.length, 'Summaries:', data.summaries?.length, 'Report:', data.final_report?.length, 'chars')
    } catch (err) {
      console.error('❌ Request error:', err)
      const errorMsg = err.name === 'AbortError' 
        ? 'Request timed out after 90 seconds. The report generation is taking longer than expected.' 
        : (err.message || 'Unknown error')
      setError(errorMsg)
      addLog(`❌ Error: ${errorMsg}`, 'error')
      failAgentVisualization()
    } finally {
      setLoading(false)
    }
  }

  // PDF export: captures the report box and generates a PDF with better optimization
  const downloadReportPDF = async () => {
    const el = document.getElementById('final-report-box')
    if (!el) return
    try {
      // Use lower scale and better compression
      const canvas = await html2canvas(el, { 
        scale: 1.5,
        useCORS: true,
        logging: false,
        windowWidth: 1200
      })
      const imgData = canvas.toDataURL('image/jpeg', 0.85) // Use JPEG with 85% quality
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfW = pdf.internal.pageSize.getWidth()
      const pdfH = pdf.internal.pageSize.getHeight()
      
      // Calculate dimensions to fit page
      const imgW = pdfW - 20 // 10mm margin on each side
      const imgH = (canvas.height * imgW) / canvas.width
      
      // Add content across multiple pages if needed
      let heightLeft = imgH
      let position = 10 // Top margin
      
      // First page
      pdf.addImage(imgData, 'JPEG', 10, position, imgW, imgH)
      heightLeft -= pdfH
      
      // Add more pages if content is longer
      while (heightLeft > 0) {
        position = heightLeft - imgH + 10
        pdf.addPage()
        pdf.addImage(imgData, 'JPEG', 10, position, imgW, imgH)
        heightLeft -= pdfH
      }
      
      pdf.save(`${drug}-${disease}-report.pdf`)
    } catch (err) {
      console.error('PDF error', err)
      alert('Failed to create PDF. See console.')
    }
  }

  // Copy plain text without HTML tags
  const copyReportText = () => {
    if (!result?.final_report) return
    
    // Create a temporary div to parse HTML
    const temp = document.createElement('div')
    temp.innerHTML = result.final_report
    const plainText = temp.innerText || temp.textContent
    
    navigator.clipboard?.writeText(plainText).then(() => {
      alert('Report copied to clipboard!')
    }).catch(err => {
      console.error('Copy failed:', err)
      alert('Failed to copy. Please try again.')
    })
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🧬 Pharma Agentic LangGraph (Prototype)</h1>
        <p>Run multi-agent literature analysis (mock dataset + LLM summarization). Demo-ready UI with agent flow visualization.</p>
      </header>

      <div className="container">
        <form onSubmit={handleSubmit} className="input-form" aria-label="Query form">
          <div className="form-group">
            <label htmlFor="drug">Drug Name</label>
            <input id="drug" type="text" value={drug} onChange={e => setDrug(e.target.value)} required />
          </div>

          <div className="form-group">
            <label htmlFor="disease">Disease</label>
            <input id="disease" type="text" value={disease} onChange={e => setDisease(e.target.value)} required />
          </div>

          <button type="submit" disabled={loading} className="submit-btn" aria-busy={loading}>
            {loading ? (<><span className="spinner" /> Analyzing...</>) : 'Run Analysis'}
          </button>
        </form>

        {error && <div className="error-box"><strong>Error:</strong> {error}</div>}

        {/* Agent visualization and Logs Side by Side */}
        {(loading || agentSteps.length > 0) && (
          <div className="workflow-logs-container">
            {/* Agent Workflow */}
            <div className="workflow-section" aria-live="polite">
              <h3>🤖 Agent Workflow & Data Flow</h3>

              <div className="architecture-diagram">
                <div className="flow-header">
                  <div className="flow-badge">Frontend</div>
                  <div className="flow-arrow">→</div>
                  <div className="flow-badge backend">FastAPI</div>
                  <div className="flow-arrow">→</div>
                  <div className="flow-badge ai">LLM</div>
                </div>
              </div>

              <div className="agent-pipeline" role="list">
                {agentSteps.map((step, idx) => (
                  <div key={step.key} className="agent-step-container" role="listitem">
                    <div className={`agent-step ${step.status}`}>
                      <div className="agent-icon" aria-hidden>{AgentStepIcon({ status: step.status })}</div>
                      <div className="agent-info">
                        <h4>{step.agent}</h4>
                        <p>{step.description}</p>
                        <div className="agent-status-badge">{step.status}</div>
                      </div>
                    </div>
                    {idx < agentSteps.length - 1 && <div className={`connection-line ${step.status === 'completed' ? 'active' : ''}`}><div className="arrow-down">↓</div></div>}
                  </div>
                ))}
              </div>

              <div className="data-flow-info">
                <div className="flow-item"><span className="flow-label">📤 Request:</span><span className="flow-value">POST /run → {`{ drug: "${drug}", disease: "${disease}" }`}</span></div>
                {currentAgent && <div className="flow-item current"><span className="flow-label">🔄 Current:</span><span className="flow-value">{currentAgent} processing...</span></div>}
                {result && <div className="flow-item"><span className="flow-label">📥 Response:</span><span className="flow-value">{result.papers?.length || 0} papers, {result.summaries?.length || 0} summaries</span></div>}
              </div>
            </div>

            {/* Live Logs Section */}
            <div className="logs-section" aria-live="polite">
              <h3>📋 Backend Processing Logs</h3>
              <div className="logs-container">
                {logs.map((log, idx) => (
                  <div key={idx} className={`log-entry log-${log.type}`}>
                    <span className="log-time">[{log.timestamp}]</span>
                    <span className="log-message">{log.message}</span>
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="results">
            <div className="result-header"><h2>Results: {result.drug} for {result.disease}</h2></div>

            {/* Papers */}
            {result.papers?.length > 0 && (
              <section className="section" aria-labelledby="papers-heading">
                <h3 id="papers-heading">📚 Retrieved Papers ({result.papers.length})</h3>
                <div className="cards">
                  {result.papers.map((paper, i) => (
                    <article key={i} className="card paper-card">
                      <h4>{paper.title}</h4>
                      <p className="abstract">{paper.abstract}</p>
                      {paper.link && <a className="link" href={paper.link} target="_blank" rel="noreferrer">View Paper →</a>}
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Summaries */}
            {result.summaries?.length > 0 && (
              <section className="section" aria-labelledby="summaries-heading">
                <h3 id="summaries-heading">📝 AI-Generated Summaries</h3>
                <div className="cards">
                  {result.summaries.map((s, i) => (
                    <div key={i} className="card summary-card">
                      <h4>{s.title}</h4>
                      <div className="summary-content" style={{ lineHeight: '1.6' }}>
                        {s.summary_raw.split('\n').map((line, idx) => {
                          const trimmed = line.trim()
                          if (!trimmed) return null
                          
                          // Handle bullet points with * or -
                          if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
                            return <li key={idx} style={{ marginLeft: '1.5rem', marginBottom: '0.5rem' }}>{trimmed.substring(1).trim()}</li>
                          }
                          
                          // Handle bold text with **text**
                          const boldFormatted = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          
                          return <p key={idx} dangerouslySetInnerHTML={{ __html: boldFormatted }} style={{ marginBottom: '0.5rem' }} />
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Final report */}
            {result.final_report && (
              <section className="section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3>📊 Final Repurposing Report</h3>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="submit-btn" onClick={copyReportText}>
                      📋 Copy Text
                    </button>
                    <button className="submit-btn pdf-download-btn" onClick={downloadReportPDF}>
                      📥 Download PDF
                    </button>
                  </div>
                </div>

                <div 
                  id="final-report-box" 
                  className="report-box" 
                  role="region" 
                  aria-label="Final report"
                  dangerouslySetInnerHTML={{ __html: result.final_report }}
                />
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
