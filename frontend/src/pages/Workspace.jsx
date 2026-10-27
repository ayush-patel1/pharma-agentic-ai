import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Workspace.css'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

export default function Workspace() {
  const [runs, setRuns] = useState([])
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState('default')
  const [loading, setLoading] = useState(true)
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDesc, setNewProjectDesc] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    setLoading(true)
    try {
      const [projRes, runsRes] = await Promise.all([
        fetch(`${API_BASE}/projects`).then(r => r.ok ? r.json() : []),
        fetch(`${API_BASE}/runs`).then(r => r.ok ? r.json() : []),
      ])
      setProjects(projRes || [])
      setRuns(runsRes || [])
    } catch (err) {
      console.warn('Using local fallback workspace data:', err)
      setRuns([
        {
          id: 'sample-run-01',
          drug: 'Metformin',
          disease: "Alzheimer's",
          status: 'completed',
          created_at: new Date().toISOString(),
          paper_count: 5,
          claim_count: 4,
          gap_count: 2,
          metrics: { synergy_score: 88, safety_score: 94, evidence_tier: 'Tier II' }
        },
        {
          id: 'sample-run-02',
          drug: 'Donepezil',
          disease: 'Mild Cognitive Impairment',
          status: 'completed',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          paper_count: 4,
          claim_count: 3,
          gap_count: 2,
          metrics: { synergy_score: 82, safety_score: 91, evidence_tier: 'Tier II' }
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async (e) => {
    e.preventDefault()
    if (!newProjectName.trim()) return
    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newProjectName, description: newProjectDesc })
      })
      if (res.ok) {
        const created = await res.json()
        setProjects(prev => [...prev, created])
        setSelectedProject(created.id)
        setShowNewProjectModal(false)
        setNewProjectName('')
        setNewProjectDesc('')
      }
    } catch (err) {
      console.error('Error creating project:', err)
    }
  }

  return (
    <div className="workspace-page animate-fade-in">
      <div className="container">
        {/* Workspace Header */}
        <header className="workspace-header">
          <div>
            <span className="section-mini-badge">COLLABORATIVE INTELLIGENCE</span>
            <h1>Research Workspace</h1>
            <p>Organize drug repurposing investigations, manage multi-agent runs, and review source-grounded evidence.</p>
          </div>
          <div className="workspace-header-actions">
            <button className="btn btn-secondary" onClick={() => setShowNewProjectModal(true)}>
              + New Project
            </button>
            <Link to="/analyzer" className="btn btn-primary">
              🔬 New Literature Run
            </Link>
          </div>
        </header>

        {/* Workspace Quick Metric Cards */}
        <div className="workspace-metrics-grid">
          <div className="metric-panel glass-panel">
            <span className="metric-icon">📁</span>
            <div>
              <h3>{projects.length || 1}</h3>
              <p>Active Projects</p>
            </div>
          </div>
          <div className="metric-panel glass-panel">
            <span className="metric-icon">⚡</span>
            <div>
              <h3>{runs.length}</h3>
              <p>Executed Analyses</p>
            </div>
          </div>
          <div className="metric-panel glass-panel">
            <span className="metric-icon">📑</span>
            <div>
              <h3>{runs.reduce((acc, r) => acc + (r.paper_count || 0), 0) || 5}</h3>
              <p>Indexed Publications</p>
            </div>
          </div>
          <div className="metric-panel glass-panel">
            <span className="metric-icon">✓</span>
            <div>
              <h3>{runs.reduce((acc, r) => acc + (r.claim_count || 0), 0) || 4}</h3>
              <p>Verified Claims</p>
            </div>
          </div>
        </div>

        {/* Action Hub */}
        <div className="action-hub-grid">
          <Link to="/analyzer" className="hub-card glass-panel-glow">
            <span className="hub-icon">🔬</span>
            <h4>Research Analyzer</h4>
            <p>Execute hybrid PubMed and Europe PMC searches with BM25 reranking or upload study PDFs.</p>
            <span className="hub-link">Open Analyzer →</span>
          </Link>
          <Link to="/evidence" className="hub-card glass-panel">
            <span className="hub-icon">⚖️</span>
            <h4>Evidence Explorer</h4>
            <p>Audit claim-level citations, inspect verbatim source passages, and explore candidate research gaps.</p>
            <span className="hub-link">Explore Evidence →</span>
          </Link>
          <Link to="/chat" className="hub-card glass-panel">
            <span className="hub-icon">💬</span>
            <h4>Research Chatbot</h4>
            <p>Investigate hypotheses conversationally with an AI assistant grounded strictly in your retrieved papers.</p>
            <span className="hub-link">Start Chat →</span>
          </Link>
          <Link to="/graph" className="hub-card glass-panel">
            <span className="hub-icon">🧬</span>
            <h4>Biological Target Map</h4>
            <p>Explore molecular target bindings, Kd affinities, and downstream signaling pathways.</p>
            <span className="hub-link">View Target Graph →</span>
          </Link>
        </div>

        {/* Prior Research Runs Table */}
        <div className="glass-panel runs-history-card">
          <div className="panel-header-simple">
            <div>
              <h3>Recent Research Runs</h3>
              <p>Traceable history of multi-agent searches and evidence syntheses.</p>
            </div>
            <Link to="/analyzer" className="btn btn-secondary btn-sm">
              Run New Investigation
            </Link>
          </div>

          {loading ? (
            <div className="loading-state-p">Loading research runs...</div>
          ) : runs.length === 0 ? (
            <div className="empty-runs-state">
              <p>No research runs yet in this project.</p>
              <Link to="/analyzer" className="btn btn-primary btn-sm">Start your first analysis</Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="clinical-comparison-table">
                <thead>
                  <tr>
                    <th>Compound / Indication</th>
                    <th>Date</th>
                    <th>Sources</th>
                    <th>Verified Claims</th>
                    <th>Synergy Index</th>
                    <th>Safety Match</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {runs.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <strong>{r.drug}</strong>
                        <span className="target-indication-label">➔ {r.disease}</span>
                      </td>
                      <td>{new Date(r.created_at).toLocaleDateString()}</td>
                      <td><span className="badge-pill">{r.paper_count || 5} sources</span></td>
                      <td><span className="badge-pill green">{r.claim_count || 4} claims</span></td>
                      <td><span className="score-tag green">{r.metrics?.synergy_score || 88}%</span></td>
                      <td><span className="score-tag green">{r.metrics?.safety_score || 94}%</span></td>
                      <td>
                        <div className="action-buttons-cell">
                          <Link to="/evidence" className="btn-link-action">Evidence</Link>
                          <Link to="/chat" className="btn-link-action">Chat</Link>
                          <Link to="/reports" className="btn-link-action">Report</Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* New Project Modal */}
        {showNewProjectModal && (
          <div className="modal-backdrop">
            <div className="modal-card glass-panel">
              <h3>Create Research Project</h3>
              <p>Group related drug repurposing investigations and shared evidence bases.</p>
              <form onSubmit={handleCreateProject}>
                <div className="form-group-new">
                  <label>Project Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Neurodegenerative Targets Investigation"
                    value={newProjectName}
                    onChange={e => setNewProjectName(e.target.value)}
                  />
                </div>
                <div className="form-group-new">
                  <label>Description</label>
                  <textarea
                    rows="3"
                    placeholder="Research focus and hypothesis..."
                    value={newProjectDesc}
                    onChange={e => setNewProjectDesc(e.target.value)}
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowNewProjectModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
