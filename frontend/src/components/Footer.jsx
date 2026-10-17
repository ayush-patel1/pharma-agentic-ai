import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-manifest">
          <p className="footer-index">FIELD NOTE / 01 <span>EXPLORATORY RESEARCH</span></p>
          <a className="footer-wordmark" href="/#workspace" aria-label="NeuroRepurpose AI home">
            NEURO<span>REPURPOSE</span><b>AI</b>
          </a>
          <p className="footer-description">A study in how existing compounds meet new questions.</p>
        </div>

        <div className="footer-figure" aria-hidden="true">
          <span className="footer-figure-coordinate">N 04 / E 17</span>
          <i className="footer-figure-line footer-line-a" />
          <i className="footer-figure-line footer-line-b" />
          <i className="footer-figure-node footer-node-a" />
          <i className="footer-figure-node footer-node-b" />
          <i className="footer-figure-node footer-node-c" />
          <span className="footer-figure-core">NR</span>
          <span className="footer-figure-caption">RELATION / STUDY</span>
        </div>

        <nav className="footer-navigation" aria-label="Footer navigation">
          <span className="footer-label">CONTENTS / 01—04</span>
          <a href="/#workspace"><span>01</span> Workspace</a>
          <a href="/#methodology"><span>02</span> Methodology</a>
          <a href="/#faq"><span>03</span> FAQ</a>
          <a href="/#source-limitations"><span>04</span> Source limitations</a>
        </nav>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <span>NR—01 · RESEARCH INTERFACE</span>
          <span>NOT MEDICAL ADVICE · VERIFY ORIGINAL SOURCES</span>
          <span>EDITION 01 <i /> © {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  )
}
