import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import './App.css'
import './design-system.css'

// Load every route stylesheet before the shared theme. This prevents lazy-loaded
// page CSS from changing colors, surfaces, or typography partway down a page.
import './pages/Home.css'
import './pages/About.css'
import './pages/Workspace.css'
import './pages/Analyzer.css'
import './pages/EvidenceExplorer.css'
import './pages/ResearchChat.css'
import './pages/KnowledgeGraph.css'
import './pages/ReportsPage.css'

// Keep this last: it is the single source of truth for visual tokens and surfaces.
import './clay-theme.css'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Workspace = lazy(() => import('./pages/Workspace'))
const Analyzer = lazy(() => import('./pages/Analyzer'))
const EvidenceExplorer = lazy(() => import('./pages/EvidenceExplorer'))
const ResearchChat = lazy(() => import('./pages/ResearchChat'))
const KnowledgeGraph = lazy(() => import('./pages/KnowledgeGraph'))
const ReportsPage = lazy(() => import('./pages/ReportsPage'))

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main id="main-content" className="main-content">
          <Suspense fallback={<div className="route-loading" role="status">Loading workspace…</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/workspace" element={<Workspace />} />
              <Route path="/analyzer" element={<Analyzer />} />
              <Route path="/evidence" element={<EvidenceExplorer />} />
              <Route path="/chat" element={<ResearchChat />} />
              <Route path="/graph" element={<KnowledgeGraph />} />
              <Route path="/reports" element={<ReportsPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
