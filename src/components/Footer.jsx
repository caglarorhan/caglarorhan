import './Footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-grid"></div>
      
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-logo">
              <span className="bracket">[</span>
              <span className="text">CAGLAR.ORHAN</span>
              <span className="bracket">]</span>
            </span>
            <p className="footer-tagline">Full-Stack Developer & AI Architect</p>
          </div>
          
          <div className="footer-links">
            <div className="link-group">
              <h4 className="link-title">Navigation</h4>
              <a href="#about" className="footer-link hoverable">About</a>
              <a href="#projects" className="footer-link hoverable">Projects</a>
              <a href="#experience" className="footer-link hoverable">Experience</a>
              <a href="#contact" className="footer-link hoverable">Contact</a>
            </div>
            
            <div className="link-group">
              <h4 className="link-title">Connect</h4>
              <a href="https://github.com/caglarorhan" target="_blank" rel="noopener noreferrer" className="footer-link hoverable">GitHub</a>
              <a href="https://linkedin.com/in/caglarorhan" target="_blank" rel="noopener noreferrer" className="footer-link hoverable">LinkedIn</a>
              <a href="https://twitter.com/caglarorhan" target="_blank" rel="noopener noreferrer" className="footer-link hoverable">Twitter</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-status">
            <span className="status-indicator"></span>
            <span className="status-text">SYSTEM OPERATIONAL</span>
          </div>
          
          <div className="footer-copyright">
            <span className="copyright-symbol">©</span>
            <span className="copyright-year">{currentYear}</span>
            <span className="copyright-text">CAGLAR ORHAN // ALL RIGHTS RESERVED</span>
          </div>
          
          <div className="footer-version">
            <span className="version-label">BUILD:</span>
            <span className="version-number">v2.0.{currentYear % 100}</span>
          </div>
        </div>
      </div>
      
      <div className="footer-scan-line"></div>
    </footer>
  )
}

export default Footer
