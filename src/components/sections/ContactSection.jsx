import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ContactScene from '../../scenes/ContactScene'
import './ContactSection.css'

gsap.registerPlugin(ScrollTrigger)

const ContactSection = () => {
  const sectionRef = useRef(null)
  const formRef = useRef(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/caglarorhan', icon: '◈' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/caglarorhan', icon: '◇' },
    { name: 'Twitter', url: 'https://twitter.com/caglarorhan', icon: '◆' },
    { name: 'Email', url: 'mailto:contact@caglarorhan.com', icon: '◉' },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-content', {
        opacity: 0,
        x: -50,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        }
      })

      gsap.from('.contact-form', {
        opacity: 0,
        x: 50,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        }
      })

      gsap.from('.social-link', {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.social-links',
          start: 'top 80%',
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSending(true)
    
    // Simulate sending
    setTimeout(() => {
      setSending(false)
      setSent(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      
      setTimeout(() => setSent(false), 3000)
    }, 2000)
  }

  return (
    <section id="contact" ref={sectionRef} className="contact-section section">
      {/* 3D Portal Background */}
      <div className="contact-canvas">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <ContactScene />
        </Canvas>
      </div>

      <div className="contact-container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">[ ESTABLISH CONNECTION ]</span>
          <h2 className="section-title">
            <span className="title-icon">◉</span>
            Neural Link
          </h2>
          <p className="section-subtitle">
            Ready to collaborate? Let's build something extraordinary together.
          </p>
        </div>

        <div className="contact-grid">
          {/* Left - Contact Info */}
          <div className="contact-content">
            <div className="contact-intro glass-panel">
              <h3 className="intro-title">
                <span className="title-bracket">[</span>
                Let's Connect
                <span className="title-bracket">]</span>
              </h3>
              <p className="intro-text">
                Whether you have a project in mind, want to discuss opportunities, 
                or just want to say hello — my inbox is always open. I'll try my 
                best to get back to you within 24 hours.
              </p>

              <div className="contact-details">
                <div className="detail-item">
                  <span className="detail-icon">◈</span>
                  <div className="detail-info">
                    <span className="detail-label">Location</span>
                    <span className="detail-value">Available Worldwide</span>
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">◇</span>
                  <div className="detail-info">
                    <span className="detail-label">Response Time</span>
                    <span className="detail-value">Within 24 Hours</span>
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">◆</span>
                  <div className="detail-info">
                    <span className="detail-label">Status</span>
                    <span className="detail-value status-active">
                      <span className="status-dot"></span>
                      Available for Work
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="social-links">
              {socialLinks.map((link, index) => (
                <a 
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link hoverable"
                >
                  <span className="social-icon">{link.icon}</span>
                  <span className="social-name">{link.name}</span>
                  <span className="social-arrow">→</span>
                </a>
              ))}
            </div>
          </div>

          {/* Right - Contact Form */}
          <div className="contact-form glass-panel">
            <div className="form-header">
              <span className="form-icon">◈</span>
              <span className="form-title">TRANSMISSION CONSOLE</span>
              <span className="form-status">
                <span className={`status-indicator ${sending ? 'sending' : ''} ${sent ? 'sent' : ''}`}></span>
                {sending ? 'TRANSMITTING...' : sent ? 'SENT!' : 'READY'}
              </span>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="form-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">IDENTIFIER</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your Name"
                    className="form-input hoverable"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">COMM CHANNEL</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="form-input hoverable"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">SUBJECT PROTOCOL</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Project Inquiry / Collaboration / Hello"
                  className="form-input hoverable"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">MESSAGE PAYLOAD</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell me about your project..."
                  className="form-input form-textarea hoverable"
                  rows={5}
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className={`cyber-btn primary form-submit hoverable ${sending ? 'sending' : ''}`}
                disabled={sending}
              >
                {sending ? (
                  <>
                    <span className="btn-loader"></span>
                    Transmitting...
                  </>
                ) : sent ? (
                  <>
                    <span className="btn-icon">✓</span>
                    Message Sent!
                  </>
                ) : (
                  <>
                    <span className="btn-icon">▶</span>
                    Send Transmission
                  </>
                )}
              </button>
            </form>

            <div className="form-footer">
              <span className="footer-text">ENCRYPTED CONNECTION • SECURE CHANNEL</span>
            </div>
          </div>
        </div>
      </div>

      {/* HUD Elements */}
      <div className="hud-corner top-left"></div>
      <div className="hud-corner top-right"></div>
      <div className="hud-corner bottom-left"></div>
      <div className="hud-corner bottom-right"></div>
    </section>
  )
}

export default ContactSection
