import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ProjectsSection.css'

gsap.registerPlugin(ScrollTrigger)

const ProjectsSection = () => {
  const sectionRef = useRef(null)
  const [activeProject, setActiveProject] = useState(null)

  const projects = [
    {
      id: 1,
      title: 'Neural Commerce',
      category: 'AI / E-Commerce',
      description: 'AI-powered e-commerce platform with predictive analytics, personalized recommendations, and automated inventory management.',
      tech: ['React', 'Node.js', 'TensorFlow', 'PostgreSQL'],
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600',
      color: '#00f5ff',
      link: '#'
    },
    {
      id: 2,
      title: 'Quantum Dashboard',
      category: 'Data Visualization',
      description: 'Real-time analytics dashboard processing millions of data points with stunning 3D visualizations and predictive insights.',
      tech: ['Vue.js', 'D3.js', 'Python', 'WebGL'],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600',
      color: '#ff00ff',
      link: '#'
    },
    {
      id: 3,
      title: 'SynthVoice AI',
      category: 'Machine Learning',
      description: 'Advanced voice synthesis platform using deep learning for natural speech generation and real-time voice cloning.',
      tech: ['Python', 'PyTorch', 'FastAPI', 'Docker'],
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600',
      color: '#8b00ff',
      link: '#'
    },
    {
      id: 4,
      title: 'CryptoGuard',
      category: 'Blockchain / Security',
      description: 'Decentralized security platform for digital asset protection with multi-signature wallets and smart contract auditing.',
      tech: ['Solidity', 'React', 'Web3.js', 'Hardhat'],
      image: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=600',
      color: '#00ff88',
      link: '#'
    },
    {
      id: 5,
      title: 'MetaSpace VR',
      category: 'Virtual Reality',
      description: 'Immersive virtual reality workspace for remote teams with spatial audio, 3D whiteboards, and real-time collaboration.',
      tech: ['Unity', 'C#', 'WebXR', 'Three.js'],
      image: 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=600',
      color: '#0066ff',
      link: '#'
    },
    {
      id: 6,
      title: 'AutoPilot CMS',
      category: 'Content Management',
      description: 'AI-driven content management system with automatic SEO optimization, content generation, and multi-platform publishing.',
      tech: ['Next.js', 'GraphQL', 'OpenAI', 'MongoDB'],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600',
      color: '#ff6600',
      link: '#'
    }
  ]

  useEffect(() => {
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
  }, [])

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
