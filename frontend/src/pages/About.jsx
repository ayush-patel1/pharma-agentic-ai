import { Link } from 'react-router-dom'
import './About.css'

export default function About() {
  return (
    <div className="about-page method-page">
      <section className="method-hero">
        <div className="container">
          <p className="workspace-kicker"><span>NR</span> METHODOLOGY & SCOPE</p>
          <h1>Understand the evidence behind each report.</h1>
          <p>
            NeuroRepurpose is an exploratory research tool. It helps organize a narrow set of literature signals and paper summaries; it does not assess whether a treatment is safe or effective.
          </p>
        </div>
      </section>

      <section className="method-sources">
        <div className="container method-source-grid">
          <article className="method-source method-source-blue">
            <span className="method-index">01 / LITERATURE</span>
            <h2>PubMed literature search</h2>
            <p>
              Literature queries retrieve records from PubMed that mention both the compound and indication in their title or abstract. This focused search is not a systematic review, and relevant records may be missed.
            </p>
          </article>
          <article className="method-source method-source-yellow">
            <span className="method-index">02 / DOCUMENT</span>
            <h2>Your uploaded PDF</h2>
            <p>
              PDF analysis extracts text from up to the first eight pages, searches PubMed for related records, and sends the extracted text and available abstracts to the configured AI service for source-linked summaries. Scanned/image-only PDFs are not supported. Do not upload confidential or identifiable documents.
            </p>
          </article>
        </div>
      </section>

      <section className="method-workflow">
        <div className="container">
          <div className="method-heading">
            <p className="workspace-kicker">WORKFLOW</p>
            <h2>What the system does</h2>
          </div>
          <ol className="method-steps">
            <li>
              <span>01</span>
              <div>
                <h3>Match source material</h3>
                <p>Retrieve PubMed records or extract text from the supplied document.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>Generate summaries</h3>
                <p>A language model creates summaries from the matched papers or extracted text.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>Review and export</h3>
                <p>Inspect the returned report and source material, then copy it or export a PDF.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section className="method-limits">
        <div className="container method-limits-inner">
          <span className="method-warning" aria-hidden="true">!</span>
          <div>
            <p className="workspace-kicker">IMPORTANT LIMITS</p>
            <h2>Use the output as a starting point, not a conclusion.</h2>
            <ul>
              <li>Generated text can contain errors or unsupported conclusions.</li>
              <li>Always verify statements against original publications and qualified experts.</li>
              <li>This tool does not provide medical advice or clinical, safety, efficacy, or regulatory assessments.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="method-action">
        <div className="container method-action-inner">
          <h2>Ready to explore a question?</h2>
          <Link to="/analyzer" className="btn btn-primary">Start an analysis <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </div>
  )
}
