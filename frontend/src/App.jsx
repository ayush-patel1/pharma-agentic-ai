import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import './App.css'
import './design-system.css'

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
