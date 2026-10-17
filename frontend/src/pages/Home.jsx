import { Link } from 'react-router-dom'
import './Home.css'

const frequentlyAskedQuestions = [
  {
    question: 'Where does the literature search get its papers?',
    answer: 'Search retrieves records from PubMed that mention both the compound and indication in their title or abstract. The search is not a systematic review, and relevant records may be missed.',
  },
  {
    question: 'Can I analyze a research PDF?',
    answer: 'Yes. The document workflow extracts text from up to the first eight pages, then uses the available text as input to the research workflow. Results depend on whether the PDF contains extractable text.',
  },
  {
    question: 'What does the AI-generated report tell me?',
    answer: 'It organizes source material into summaries and a structured report for exploratory review. Generated statements can be incomplete or incorrect, so verify them against the original publications.',
  },
  {
    question: 'Are the example evidence labels or scores clinically validated?',
    answer: 'No. The landing-page workspace is illustrative, and the tool does not provide validated clinical scores or assess treatment safety, efficacy, or suitability.',
  },
  {
    question: 'Can I upload confidential or identifiable documents?',
    answer: 'Do not upload confidential or identifiable documents. PDF text is sent through the configured AI service as part of analysis; review your deployment and data-handling requirements before using real documents.',
  },
  {
    question: 'Does this platform provide medical advice?',
    answer: 'No. It is a research exploration aid, not medical advice or a substitute for qualified scientific, clinical, or regulatory review.',
  },
]

export default function Home() {
  return (
    <div className="home-page research-home">
      <section className="instrument-hero" id="workspace">
        <div className="container instrument-hero-grid">
          <div className="instrument-copy">
            <p className="mono-kicker"><span>NR / 01</span> OPEN RESEARCH INSTRUMENT</p>
            <h1>
              <span>EXPLORE A NEW</span>
              <span>USE FOR AN</span>
              <span>EXISTING</span>
              <span className="headline-last">COMPOUND.</span>
            </h1>
            <p className="instrument-deck">
              Trace a research question through source material, model-generated synthesis, and a structured report.
            </p>
            <div className="instrument-actions">
              <Link to="/analyzer?mode=database" className="btn btn-primary">
                Open the analyzer <span aria-hidden="true">↗</span>
              </Link>
              <Link to="/analyzer?mode=pdf" className="plain-action">Analyze a PDF <span aria-hidden="true">→</span></Link>
            </div>
            <p className="instrument-caveat">EXPLORATORY OUTPUT · VERIFY AGAINST ORIGINAL PUBLICATIONS</p>
          </div>

          <figure className="molecular-plate" aria-labelledby="molecular-plate-title">
            <div className="plate-header mono-label">
              <span id="molecular-plate-title">RELATIONSHIP STUDY / PLATE 01</span>
              <span>FIG. 001</span>
            </div>
            <div className="molecular-field">
              <div className="field-coordinate coordinate-top">X 04.8 / Y 11.2</div>
              <div className="field-coordinate coordinate-bottom">FIELD 03 <span>NOT TO SCALE</span></div>
              <span className="crosshair crosshair-a" aria-hidden="true">+</span>
              <span className="crosshair crosshair-b" aria-hidden="true">+</span>
              <svg className="molecular-lines" viewBox="0 0 640 390" preserveAspectRatio="none" aria-hidden="true">
                <path className="helix-strand helix-strand-a" d="M280 42 C400 82 400 122 280 162 C160 202 160 242 280 282 C400 322 400 352 280 390" />
                <path className="helix-strand helix-strand-b" d="M360 42 C240 82 240 122 360 162 C480 202 480 242 360 282 C240 322 240 352 360 390" />
                <path className="helix-rung rung-blue" d="M324 62 L316 62" />
                <path className="helix-rung" d="M365 82 L275 82" />
                <path className="helix-rung rung-yellow" d="M385 102 L255 102" />
                <path className="helix-rung" d="M376 122 L264 122" />
                <path className="helix-rung rung-red" d="M341 142 L299 142" />
                <path className="helix-rung" d="M300 162 L340 162" />
                <path className="helix-rung rung-yellow" d="M263 182 L377 182" />
                <path className="helix-rung" d="M245 202 L395 202" />
                <path className="helix-rung rung-blue" d="M250 222 L390 222" />
                <path className="helix-rung" d="M280 242 L360 242" />
                <path className="helix-rung rung-red" d="M330 262 L310 262" />
                <path className="helix-rung" d="M370 282 L270 282" />
                <path className="helix-rung rung-yellow" d="M390 302 L250 302" />
                <path className="helix-rung" d="M370 322 L270 322" />
                <path className="helix-rung rung-blue" d="M336 342 L304 342" />
                <path className="helix-branch" d="M144 93 C186 93 207 106 252 125" />
                <path className="helix-branch" d="M496 93 C454 93 433 106 388 125" />
                <path className="helix-branch" d="M144 298 C186 298 207 284 252 264" />
                <path className="helix-branch" d="M496 298 C454 298 433 284 388 264" />
              </svg>
              <div className="molecule-node node-source">
                <span className="node-symbol symbol-square" />
                <span className="node-name">SOURCE</span>
                <span className="node-id">PAPER / 01</span>
              </div>
              <div className="molecule-node node-compound">
                <span className="node-symbol symbol-circle" />
                <span className="node-name">COMPOUND</span>
                <span className="node-id">ENTITY / A</span>
              </div>
              <div className="molecule-node node-target">
                <span className="node-symbol symbol-square symbol-yellow" />
                <span className="node-name">TARGET</span>
                <span className="node-id">ENTITY / B</span>
              </div>
              <div className="molecule-node node-indication">
                <span className="node-symbol symbol-circle symbol-red" />
                <span className="node-name">INDICATION</span>
                <span className="node-id">ENTITY / C</span>
              </div>
              <div className="relationship-node">
                <span>?</span>
                <small>HYPOTHESIS</small>
              </div>
              <span className="edge-label edge-label-one">REF. 01</span>
              <span className="edge-label edge-label-two">ASSOCIATION</span>
            </div>
            <figcaption className="plate-footer">
              <span className="mono-label">SCHEMATIC / STATIC</span>
              <a href="#methodology">METHOD / 03 ↗</a>
              <span className="plate-index">NR—FIG.001</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="pipeline-section" aria-labelledby="pipeline-heading">
        <div className="container">
          <div className="section-masthead">
            <p className="mono-kicker"><span>02 / EXECUTION</span> SYSTEM MAP</p>
            <p className="mono-note">STATIC REFERENCE · NO LIVE REQUEST</p>
          </div>
          <h2 className="sr-only" id="pipeline-heading">Research pipeline</h2>
          <div className="technical-pipeline">
            <article className="pipeline-stage">
              <div className="pipeline-stage-top"><span>01</span><span>DEFINED</span></div>
              <h3>INPUT</h3>
              <p className="stage-agent">MASTER AGENT</p>
              <p>Plans a compound–indication research query or accepts a PDF.</p>
            </article>
            <article className="pipeline-stage">
              <div className="pipeline-stage-top"><span>02</span><span>LOCAL SOURCE</span></div>
              <h3>EXTRACTION</h3>
              <p className="stage-agent">PUBMED / PYPDF</p>
              <p>Retrieves PubMed records or extracts text from an uploaded PDF.</p>
            </article>
            <article className="pipeline-stage">
              <div className="pipeline-stage-top"><span>03</span><span>MODEL CALL</span></div>
              <h3>SYNTHESIS</h3>
              <p className="stage-agent">SUMMARIZER AGENT</p>
              <p>AI synthesis produces summaries from the available source text.</p>
            </article>
            <article className="pipeline-stage">
              <div className="pipeline-stage-top"><span>04</span><span>ON RESPONSE</span></div>
              <h3>REPORT</h3>
              <p className="stage-agent">REPORT AGENT</p>
              <p>Generates structured HTML, with user-triggered PDF export.</p>
            </article>
          </div>
          <div className="pipeline-caption mono-note">
            LANGGRAPH COORDINATES MASTER → SEARCH → SUMMARIZER → REPORT
          </div>
        </div>
      </section>

      <section className="blueprint-section" id="methodology" aria-labelledby="blueprint-title">
        <div className="container blueprint-grid">
          <div className="blueprint-copy">
            <p className="mono-kicker"><span>03 / ENGINEERING</span> PROJECT NOTES</p>
            <h2 id="blueprint-title">OPEN BY DESIGN. TRACEABLE BY DEFAULT.</h2>
            <p>
              Follow the path from interface to generated monograph. Source material and model output remain visible for human review; literature searches retrieve matching PubMed records.
            </p>
            <a className="source-code-link" href="#methodology">
              TRACE THE METHOD <span aria-hidden="true">↓</span>
            </a>
          </div>

          <div className="architecture-blueprint" aria-label="Platform architecture schematic">
            <div className="blueprint-heading mono-label"><span>NR / ARCH-01</span><span>REQUEST PATH</span></div>
            <div className="architecture-flow">
              <div className="architecture-module module-ui"><span>01</span><strong>REACT / VITE</strong><small>Browser interface</small></div>
              <div className="architecture-connector"><span>JSON / MULTIPART</span><i /></div>
              <div className="architecture-module module-api"><span>02</span><strong>FASTAPI GATEWAY</strong><small>POST /run · POST /run-pdf</small></div>
              <div className="architecture-connector"><span>STATE GRAPH</span><i /></div>
              <div className="architecture-module module-graph"><span>03</span><strong>LANGGRAPH ORCHESTRATION</strong><small>Master → Search → Summarize → Report</small></div>
              <div className="architecture-branches">
                <div className="architecture-module module-extract"><span>04A</span><strong>EXTRACTION</strong><small>PDF text · first 8 pages</small></div>
                <div className="architecture-module module-gemini"><span>04B</span><strong>AI SYNTHESIS</strong><small>Model-generated summaries</small></div>
              </div>
              <div className="architecture-connector"><span>HTML REPORT</span><i /></div>
              <div className="architecture-module module-report"><span>05</span><strong>STRUCTURED MONOGRAPH</strong><small>Source-linked references · PDF export</small></div>
            </div>
            <div className="blueprint-footnote mono-note">FLOW DESCRIPTION · NOT A LIVE SYSTEM TRACE</div>
          </div>
        </div>
      </section>

      <section className="preview-section" aria-labelledby="preview-title">
        <div className="container">
          <div className="preview-intro">
            <div>
              <p className="mono-kicker"><span>04 / INTERFACE STUDY</span> WORKSPACE PREVIEW</p>
              <h2 id="preview-title">A research surface, not a black box.</h2>
            </div>
            <p>Illustrative layout only. No analysis is running and no scores shown here are validated clinical results.</p>
          </div>

          <div className="research-preview">
            <div className="preview-topbar">
              <span className="mono-label">NEUROREPURPOSE / ANALYZER</span>
              <span className="preview-warning">ILLUSTRATIVE DATA · NOT A RESULT</span>
              <span className="mono-label">VIEW 01</span>
            </div>
            <div className="preview-query-row">
              <div className="preview-input"><span>COMPOUND</span><strong>Metformin</strong></div>
              <span className="query-cross">×</span>
              <div className="preview-input"><span>INDICATION</span><strong>Alzheimer's disease</strong></div>
              <span className="preview-submit">SAMPLE QUERY ↗</span>
            </div>
            <div className="preview-main-grid">
              <div className="preview-evidence">
                <div className="preview-subhead"><h3>PUBLICATION EVIDENCE</h3><span>DEMO / 02 RECORDS</span></div>
                <div className="evidence-table-wrap">
                  <table className="evidence-table">
                    <thead><tr><th>REF.</th><th>PUBLICATION</th><th>TYPE</th><th>TIER</th></tr></thead>
                    <tbody>
                      <tr><td>EX—01</td><td>Metformin and cognitive function in Alzheimer's disease: A systematic review</td><td>Review</td><td><span>NOT ASSESSED</span></td></tr>
                      <tr><td>EX—02</td><td>Neuroprotective effects of metformin in neurodegenerative diseases</td><td>Preclinical</td><td><span>NOT ASSESSED</span></td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="preview-subhead candidate-subhead"><h3>CANDIDATE COMPARISON</h3><span>NO RANKING GENERATED</span></div>
                <div className="candidate-row"><strong>Metformin</strong><span>QUERY COMPOUND</span><span>—</span></div>
                <div className="candidate-row"><strong>Candidate B</strong><span>ILLUSTRATIVE ONLY</span><span>—</span></div>
              </div>
              <aside className="preview-side">
                <div className="preview-subhead"><h3>WORKFLOW</h3><span>STATIC MAP</span></div>
                <ol className="preview-agent-list">
                  <li><span>01</span><strong>Master Agent</strong><small>PLANNING</small></li>
                  <li><span>02</span><strong>Search Agent</strong><small>SOURCE MATCH</small></li>
                  <li><span>03</span><strong>Summarizer Agent</strong><small>AI</small></li>
                  <li><span>04</span><strong>Report Agent</strong><small>HTML</small></li>
                </ol>
                <div className="preview-report">
                  <span>REPORT / PREVIEW</span>
                  <strong>Structured monograph</strong>
                  <p>Generated sections appear after a real analysis. This panel contains no report output.</p>
                  <div className="report-rules" aria-hidden="true"><i /><i /><i /><i /></div>
                </div>
              </aside>
            </div>
            <div className="preview-bottom mono-note"><span>EXAMPLE CONTENT ONLY</span><span>NO LIVE BACKEND · NO CLINICAL SCORES</span></div>
          </div>
        </div>
      </section>

      <section className="faq-section" id="faq" aria-labelledby="faq-title">
        <div className="container faq-layout">
          <div className="faq-heading">
            <p className="mono-kicker"><span>06 / FAQ</span> A QUESTION OF SCOPE</p>
            <h2 id="faq-title">BEFORE YOU BEGIN.</h2>
            <p>Practical notes on sources, documents, and interpretation.</p>
          </div>
          <div className="faq-list">
            {frequentlyAskedQuestions.map(({ question, answer }, index) => (
              <details className="faq-entry" key={question} open={index === 0}>
                <summary>
                  <span className="faq-index">Q / {String(index + 1).padStart(2, '0')}</span>
                  <span className="faq-question">{question}</span>
                  <span className="faq-mark" aria-hidden="true" />
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="scope-disclosure" id="source-limitations" aria-labelledby="scope-title">
        <div className="container">
          <div className="scope-heading">
            <p className="mono-kicker"><span>05 / DISCLOSURE</span> SOURCE NOTES</p>
            <h2 id="scope-title">KNOW WHAT THE ANALYSIS IS BASED ON.</h2>
          </div>
          <ol className="scope-facts">
            <li><span className="scope-ref">[01]</span><span className="scope-symbol" aria-hidden="true">!</span><p>Literature search retrieves PubMed records matching both terms in their title or abstract; it is not a systematic search.</p></li>
            <li><span className="scope-ref">[02]</span><span className="scope-symbol" aria-hidden="true">!</span><p>Uploaded PDFs pass through document extraction; only the first eight pages are read.</p></li>
            <li><span className="scope-ref">[03]</span><span className="scope-symbol" aria-hidden="true">!</span><p>Generated summaries require verification against original publications.</p></li>
          </ol>
          <Link to="/about" className="scope-method-link">FULL METHODOLOGY & LIMITATIONS ↗</Link>
        </div>
      </section>
    </div>
  )
}
