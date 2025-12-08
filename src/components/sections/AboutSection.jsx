import { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AboutScene from '../../scenes/AboutScene'
import './AboutSection.css'

gsap.registerPlugin(ScrollTrigger)

const AboutSection = () => {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)

  const skills = [
    { name: 'React', level: 95 },
    { name: 'Node.js', level: 90 },
    { name: 'Python', level: 88 },
    { name: 'TypeScript', level: 92 },
    { name: 'AI/ML', level: 85 },
    { name: 'Three.js', level: 80 },
  ]

  const stats = [
    { label: 'CLEARANCE', value: 'LEVEL 5' },
    { label: 'STATUS', value: 'ACTIVE' },
    { label: 'SPECIALIZATION', value: 'FULL-STACK' },
    { label: 'AI INTEGRATION', value: 'ENABLED' },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Data streams animation
      gsap.to('.data-stream', {
        y: '100%',
        duration: 3,
        ease: 'none',
        repeat: -1,
        stagger: 0.5
      })

      // Skill bars animation
      gsap.from('.skill-fill', {
        width: 0,
        duration: 1.5,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.skills-grid',
          start: 'top 80%',
        }
      })

      // Stats animation
      gsap.from('.stat-card', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.stats-grid',
          start: 'top 80%',
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="about-section section">
      {/* Data Streams */}
      <div className="data-streams">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="data-stream" style={{ left: `${(i + 1) * 12}%` }}>
            {[...Array(20)].map((_, j) => (
              <span key={j}>{Math.random() > 0.5 ? '1' : '0'}</span>
            ))}
          </div>
        ))}
      </div>

      <div className="about-container">
        {/* Left Panel - 3D Head */}
        <div className="about-visual">
          <div className="visual-frame">
            <div className="frame-corner tl"></div>
            <div className="frame-corner tr"></div>
            <div className="frame-corner bl"></div>
            <div className="frame-corner br"></div>
            
            <div className="canvas-container">
              <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <AboutScene />
              </Canvas>
            </div>
            
            <div className="visual-overlay">
              <span className="overlay-text">NEURAL SCAN COMPLETE</span>
            </div>
          </div>
          
          <div className="visual-stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <span className="stat-label">{stat.label}</span>
                <span className="stat-value">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Dossier */}
        <div ref={contentRef} className="about-content glass-panel">
          <div className="dossier-header">
            <span className="dossier-icon">◈</span>
            <span className="dossier-title">SUBJECT DOSSIER</span>
            <span className="dossier-id">ID: CO-2025-001</span>
          </div>

          <div className="dossier-body">
            <div className="dossier-section">
              <h3 className="section-title">
                <span className="title-bracket">[</span>
                PROFILE
                <span className="title-bracket">]</span>
              </h3>
              <p className="section-text">
                A passionate Full-Stack Developer and AI Architect with over a decade 
                of experience crafting intelligent systems and immersive digital experiences. 
                Specialized in building scalable applications that push the boundaries of 
                what's possible at the intersection of code and creativity.
              </p>
            </div>

            <div className="dossier-section">
              <h3 className="section-title">
                <span className="title-bracket">[</span>
                MISSION
                <span className="title-bracket">]</span>
              </h3>
              <p className="section-text">
                To architect the future through innovative software solutions, 
                leveraging cutting-edge AI technologies to solve complex problems 
                and create experiences that inspire and empower.
              </p>
            </div>

            <div className="dossier-section">
              <h3 className="section-title">
                <span className="title-bracket">[</span>
                CORE SYSTEMS
                <span className="title-bracket">]</span>
              </h3>
              <div className="skills-grid">
                {skills.map((skill, index) => (
                  <div key={index} className="skill-item">
                    <div className="skill-header">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-level">{skill.level}%</span>
                    </div>
                    <div className="skill-bar">
                      <div 
                        className="skill-fill" 
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="dossier-footer">
            <span className="footer-text">CLASSIFICATION: PUBLIC</span>
            <span className="footer-timestamp">UPDATED: {new Date().toLocaleDateString()}</span>
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

export default AboutSection
