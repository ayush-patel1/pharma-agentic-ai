# NeuroRepurpose AI - Complete UI Redesign Guide

## 🎨 Design System Implemented

✅ **Global Styles** (`src/index.css`) - Complete design system with:
- Medical-grade color palette (#4F7CAC primary, #77A6B6 secondary, #9C88FF accent)
- Spacing system (xs to 3xl)
- Typography (Inter font family)
- Shadows, transitions, animations
- Responsive utilities

✅ **Components Created**:
- Navbar with brand, links, CTA
- Footer with sections and links

## 🚀 Quick Implementation Steps

### Step 1: Install Dependencies
```bash
cd frontend
npm install react-router-dom lucide-react
```

### Step 2: Component Structure
```
frontend/src/
├── components/
│   ├── Navbar.jsx ✅
│   ├── Navbar.css ✅
│   ├── Footer.jsx ✅
│   ├── Footer.css ✅
│   ├── Hero.jsx (create)
│   ├── Features.jsx (create)
│   ├── AgentTimeline.jsx (create)
│   ├── LogConsole.jsx (create)
│   ├── PaperCard.jsx (create)
│   ├── SummaryCard.jsx (create)
│   └── ReportViewer.jsx (create)
├── pages/
│   ├── Home.jsx (create)
│   ├── About.jsx (create)
│   └── Analyzer.jsx (create - refactor current App.jsx)
└── App.jsx (update with routing)
```

### Step 3: Update Main App for Routing

Replace `App.jsx` with:
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Analyzer from './pages/Analyzer'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/analyzer" element={<Analyzer />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
```

### Step 4: Create Hero Component

`components/Hero.jsx`:
```jsx
import { Link } from 'react-router-dom'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            <span className="gradient-text">NeuroRepurpose AI</span>
          </h1>
          <p className="hero-subtitle">
            Transforming drug discovery with multi-agent intelligence and automated biomedical research.
          </p>
          <div className="hero-buttons">
            <Link to="/analyzer" className="btn-hero-primary">
              Run Analysis
              <span>→</span>
            </Link>
            <Link to="/about" className="btn-hero-secondary">
              Learn More
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">🧬 Neural Networks</div>
          <div className="floating-card card-2">💊 Drug Molecules</div>
          <div className="floating-card card-3">📄 Research Papers</div>
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
        </div>
      </div>
    </section>
  )
}
```

`components/Hero.css`:
```css
.hero {
  padding: var(--spacing-3xl) 0;
  background: linear-gradient(135deg, 
    rgba(79, 124, 172, 0.05) 0%, 
    rgba(119, 166, 182, 0.05) 50%, 
    rgba(156, 136, 255, 0.05) 100%);
  position: relative;
  overflow: hidden;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-3xl);
  align-items: center;
  min-height: 70vh;
}

.hero-title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  margin-bottom: var(--spacing-lg);
  line-height: 1.1;
}

.gradient-text {
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: clamp(1.125rem, 2vw, 1.5rem);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-2xl);
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.btn-hero-primary, .btn-hero-secondary {
  padding: 1rem 2rem;
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: 1.125rem;
  transition: all var(--transition-base);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-hero-primary {
  background: var(--color-primary);
  color: white;
  box-shadow: var(--shadow-lg);
}

.btn-hero-primary:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

.btn-hero-secondary {
  background: white;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.btn-hero-secondary:hover {
  background: var(--color-primary);
  color: white;
}

.hero-visual {
  position: relative;
  height: 500px;
}

.floating-card {
  position: absolute;
  background: white;
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  font-weight: 600;
  animation: float 6s ease-in-out infinite;
}

.card-1 {
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.card-2 {
  top: 40%;
  right: 10%;
  animation-delay: 2s;
}

.card-3 {
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.3;
}

.orb-1 {
  width: 300px;
  height: 300px;
  background: var(--color-primary);
  top: 0;
  right: 0;
}

.orb-2 {
  width: 250px;
  height: 250px;
  background: var(--color-accent);
  bottom: 0;
  left: 0;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(3deg);
  }
}

@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
  }
  
  .hero-visual {
    height: 300px;
  }
}
```

### Step 5: Create Features Section

`components/Features.jsx`:
```jsx
import './Features.css'

const features = [
  {
    icon: '🤖',
    title: 'Multi-Agent Intelligence',
    description: 'Master agent orchestrates specialized agents for search, summarization, and report generation.'
  },
  {
    icon: '🔍',
    title: 'Automated Literature Mining',
    description: 'Advanced search algorithms retrieve relevant biomedical research papers from scientific databases.'
  },
  {
    icon: '✨',
    title: 'LLM-Powered Summaries',
    description: 'Google Gemini AI generates expert-level pharmacological summaries and insights.'
  },
  {
    icon: '📊',
    title: 'Scientific Report Generator',
    description: 'Comprehensive drug repurposing assessment reports with clinical feasibility analysis.'
  }
]

export default function Features() {
  return (
    <section className="features">
      <div className="container">
        <h2 className="section-title">Intelligent Research Automation</h2>
        <p className="section-subtitle">
          Powered by cutting-edge AI agents and biomedical NLP
        </p>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card card fade-in" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

`components/Features.css`:
```css
.features {
  padding: var(--spacing-3xl) 0;
}

.section-title {
  text-align: center;
  margin-bottom: var(--spacing-md);
}

.section-subtitle {
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 1.125rem;
  margin-bottom: var(--spacing-3xl);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-xl);
}

.feature-card {
  text-align: center;
  padding: var(--spacing-2xl);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-lg);
}

.feature-title {
  font-size: 1.25rem;
  margin-bottom: var(--spacing-md);
  color: var(--color-primary);
}

.feature-description {
  color: var(--color-text-secondary);
  line-height: 1.6;
}
```

### Step 6: Move Current Analyzer to Page

Move your current `App.jsx` (the analyzer) to `pages/Analyzer.jsx` and update import paths.

## 📦 Additional Components to Implement

### AgentTimeline.jsx
```jsx
export default function AgentTimeline({ steps, currentAgent }) {
  return (
    <div className="agent-timeline">
      {steps.map((step, index) => (
        <div key={index} className={`timeline-step ${step.status}`}>
          <div className="step-icon">
            {step.status === 'completed' && '✓'}
            {step.status === 'active' && '⟳'}
            {step.status === 'pending' && '○'}
          </div>
          <div className="step-content">
            <h4>{step.agent}</h4>
            <p>{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
```

### LogConsole.jsx
```jsx
export default function LogConsole({ logs }) {
  return (
    <div className="log-console">
      <div className="console-header">
        <span>Backend Logs</span>
        <span className="console-indicator">●</span>
      </div>
      <div className="console-body">
        {logs.map((log, i) => (
          <div key={i} className="log-entry">
            <span className="log-time">{log.time}</span>
            <span className="log-message">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

## 🎨 Color Usage Guide

- **Primary (#4F7CAC)**: Main actions, navigation, headers
- **Secondary (#77A6B6)**: Supporting elements, hover states
- **Accent (#9C88FF)**: Highlights, notifications, special features
- **Background (#F5F8FA)**: Page background
- **Cards/White (#FFFFFF)**: Content cards, inputs

## 📱 Responsive Breakpoints

- Mobile: < 768px (single column)
- Tablet: 768px - 1024px (2 columns)
- Desktop: > 1024px (3+ columns)

## ✨ Next Steps

1. Create the pages/Home.jsx combining Hero + Features
2. Create pages/About.jsx with architecture diagram
3. Move current analyzer to pages/Analyzer.jsx
4. Add React Router to main App.jsx
5. Install lucide-react for icons: `npm install lucide-react`
6. Test responsive behavior at different screen sizes

The design system is ready - you now have a professional medical-grade UI foundation!
