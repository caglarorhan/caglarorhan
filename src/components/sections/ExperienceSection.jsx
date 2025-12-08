import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ExperienceSection.css'

gsap.registerPlugin(ScrollTrigger)

const ExperienceSection = () => {
  const sectionRef = useRef(null)
  const timelineRef = useRef(null)

  const experiences = [
    {
      id: 1,
      year: '2024 - Present',
      title: 'Senior AI Architect',
      company: 'Neural Dynamics Corp',
      location: 'San Francisco, CA',
      description: 'Leading the development of next-generation AI systems, architecting scalable machine learning pipelines, and mentoring engineering teams.',
      achievements: [
        'Architected AI platform processing 10M+ requests daily',
        'Reduced model inference time by 60%',
        'Led team of 12 engineers across 3 time zones'
      ],
      color: '#00f5ff'
    },
    {
      id: 2,
      year: '2021 - 2024',
      title: 'Full-Stack Lead Developer',
      company: 'Quantum Tech Solutions',
      location: 'New York, NY',
      description: 'Spearheaded full-stack development initiatives, implementing microservices architecture and leading digital transformation projects.',
      achievements: [
        'Built enterprise SaaS platform with 500K+ users',
        'Implemented CI/CD reducing deployment time by 80%',
        'Established coding standards adopted company-wide'
      ],
      color: '#ff00ff'
    },
    {
      id: 3,
      year: '2018 - 2021',
      title: 'Software Engineer',
      company: 'CyberCore Industries',
      location: 'Austin, TX',
      description: 'Developed high-performance web applications and RESTful APIs, focusing on security-first development practices.',
      achievements: [
        'Developed real-time trading platform',
        'Implemented OAuth 2.0 security protocols',
        'Optimized database queries improving speed 3x'
      ],
      color: '#8b00ff'
    },
    {
      id: 4,
      year: '2015 - 2018',
      title: 'Junior Developer',
      company: 'StartUp Nexus',
      location: 'Seattle, WA',
      description: 'Started my professional journey building web applications, learning best practices, and contributing to agile development teams.',
      achievements: [
        'Built 20+ client websites from scratch',
        'Learned React, Node.js, and cloud technologies',
        'Contributed to open-source projects'
      ],
      color: '#00ff88'
    }
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline line animation
      gsap.fromTo('.timeline-line-progress', 
        { height: '0%' },
        {
          height: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: 1
          }
        }
      )

      // Timeline items animation
      gsap.utils.toArray('.timeline-item').forEach((item, index) => {
        gsap.from(item, {
          opacity: 0,
          x: index % 2 === 0 ? -100 : 100,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
          }
        })
      })

      // Node pulse animation
      gsap.utils.toArray('.timeline-node').forEach((node) => {
        gsap.to(node, {
          boxShadow: '0 0 30px var(--neon-cyan), 0 0 60px var(--neon-cyan)',
          repeat: -1,
          yoyo: true,
          duration: 1.5,
          ease: 'sine.inOut'
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="experience" ref={sectionRef} className="experience-section section">
      {/* Background */}
      <div className="experience-bg">
        <div className="bg-circuit"></div>
      </div>

      <div className="experience-container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">[ CAREER TRAJECTORY ]</span>
          <h2 className="section-title">
            <span className="title-icon">◎</span>
            Experience
          </h2>
          <p className="section-subtitle">
            A decade of building, learning, and evolving in the digital realm
          </p>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="timeline">
          {/* Timeline Line */}
          <div className="timeline-line">
            <div className="timeline-line-progress"></div>
          </div>

          {/* Timeline Items */}
          {experiences.map((exp, index) => (
            <div 
              key={exp.id} 
              className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
              style={{ '--accent-color': exp.color }}
            >
              {/* Node */}
              <div className="timeline-node">
                <span className="node-inner"></span>
              </div>

              {/* Content */}
              <div className="timeline-content glass-panel">
                <div className="content-header">
                  <span className="exp-year">{exp.year}</span>
                  <span className="exp-location">{exp.location}</span>
                </div>

                <h3 className="exp-title">{exp.title}</h3>
                <span className="exp-company">{exp.company}</span>
                
                <p className="exp-description">{exp.description}</p>

                <div className="exp-achievements">
                  <span className="achievements-label">Key Achievements:</span>
                  <ul className="achievements-list">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="achievement-item">
                        <span className="achievement-icon">▹</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
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

export default ExperienceSection
