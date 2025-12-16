import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ProjectsSection.css'

gsap.registerPlugin(ScrollTrigger)

const ProjectsSection = () => {
  const sectionRef = useRef(null)
  const [activeProject, setActiveProject] = useState(null)
  const [projects, setProjects] = useState([])

  useEffect(() => {
    // Load projects using particles config
    import('../../config/particles.config.js')
      .then(module => module.fetchParticles())
      .then(data => {
        // Portfolio section is managed in particles.json (id: 4)
        // Projects section displays showcase projects only
        setProjects([])
      })
      .catch(err => console.error('Error loading projects:', err))
  }, [])

  useEffect(() => {
    if (projects.length === 0) return
    
    const ctx = gsap.context(() => {
      gsap.from('.project-card', {
        opacity: 0,
        y: 80,
        scale: 0.9,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.projects-grid',
          start: 'top 80%',
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [projects])

  const handleProjectHover = (project) => {
    setActiveProject(project)
    gsap.to(`.project-card-${project.id}`, {
      scale: 1.02,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  const handleProjectLeave = (project) => {
    setActiveProject(null)
    gsap.to(`.project-card-${project.id}`, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  return (
    <section id="projects" ref={sectionRef} className="projects-section section">
      {/* Background Effect */}
      <div className="projects-bg">
        <div className="bg-grid"></div>
        <div className="bg-glow" style={{ 
          background: activeProject 
            ? `radial-gradient(circle at 50% 50%, ${activeProject.color}20, transparent 70%)`
            : 'none'
        }}></div>
      </div>

      <div className="projects-container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">[ DEPLOYED SYSTEMS ]</span>
          <h2 className="section-title">
            <span className="title-icon">◈</span>
            Projects
          </h2>
          <p className="section-subtitle">
            A collection of digital solutions engineered to push boundaries
          </p>
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {projects.map((project) => (
            <div 
              key={project.id}
              className={`project-card project-card-${project.id} hoverable`}
              onMouseEnter={() => handleProjectHover(project)}
              onMouseLeave={() => handleProjectLeave(project)}
              style={{ '--accent-color': project.color }}
            >
              {/* Card Frame */}
              <div className="card-frame">
                <div className="frame-line top"></div>
                <div className="frame-line right"></div>
                <div className="frame-line bottom"></div>
                <div className="frame-line left"></div>
              </div>

              {/* Card Image */}
              <div className="card-image">
                <img src={project.image} alt={project.title} loading="lazy" />
                <div className="image-overlay"></div>
                <div className="image-scanline"></div>
              </div>

              {/* Card Content */}
              <div className="card-content">
                <span className="card-category">{project.category}</span>
                <h3 className="card-title">{project.title}</h3>
                <p className="card-description">{project.description}</p>
                
                <div className="card-tech">
                  {project.tech.map((tech, index) => (
                    <span key={index} className="tech-tag">{tech}</span>
                  ))}
                </div>

                <a href={project.link} className="card-link hoverable">
                  <span className="link-text">View Project</span>
                  <span className="link-icon">→</span>
                </a>
              </div>

              {/* Card Glow */}
              <div className="card-glow"></div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="projects-footer">
          <a href="https://github.com/caglarorhan" target="_blank" rel="noopener noreferrer" className="cyber-btn hoverable">
            <span className="btn-icon">◇</span>
            View All Projects
          </a>
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

export default ProjectsSection
