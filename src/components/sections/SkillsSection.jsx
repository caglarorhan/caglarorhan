import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SkillsScene from '../../scenes/SkillsScene'
import './SkillsSection.css'

gsap.registerPlugin(ScrollTrigger)

const SkillsSection = () => {
  const sectionRef = useRef(null)
  const [activeSkill, setActiveSkill] = useState(null)

  const skillCategories = [
    {
      name: 'Frontend',
      icon: '◈',
      color: '#00f5ff',
      skills: [
        { name: 'React', level: 95 },
        { name: 'Vue.js', level: 85 },
        { name: 'TypeScript', level: 92 },
        { name: 'Three.js', level: 80 },
        { name: 'Next.js', level: 88 },
        { name: 'GSAP', level: 85 },
      ]
    },
    {
      name: 'Backend',
      icon: '◇',
      color: '#ff00ff',
      skills: [
        { name: 'Node.js', level: 90 },
        { name: 'Python', level: 88 },
        { name: 'GraphQL', level: 85 },
        { name: 'PostgreSQL', level: 82 },
        { name: 'MongoDB', level: 80 },
        { name: 'Redis', level: 75 },
      ]
    },
    {
      name: 'AI/ML',
      icon: '⬡',
      color: '#8b00ff',
      skills: [
        { name: 'TensorFlow', level: 82 },
        { name: 'PyTorch', level: 78 },
        { name: 'OpenAI', level: 90 },
        { name: 'LangChain', level: 85 },
        { name: 'Scikit-learn', level: 80 },
        { name: 'NLP', level: 75 },
      ]
    },
    {
      name: 'DevOps',
      icon: '◎',
      color: '#00ff88',
      skills: [
        { name: 'Docker', level: 88 },
        { name: 'Kubernetes', level: 75 },
        { name: 'AWS', level: 85 },
        { name: 'CI/CD', level: 90 },
        { name: 'Terraform', level: 70 },
        { name: 'Linux', level: 85 },
      ]
    }
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Skill cards animation
      gsap.from('.skill-category', {
        opacity: 0,
        y: 50,
        scale: 0.95,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.skills-grid',
          start: 'top 80%',
        }
      })

      // Skill bars animation
      gsap.from('.skill-bar-fill', {
        scaleX: 0,
        transformOrigin: 'left',
        stagger: 0.05,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.skills-grid',
          start: 'top 70%',
        }
      })

      // Pulse animation for active nodes
      gsap.to('.node-pulse', {
        scale: 1.5,
        opacity: 0,
        repeat: -1,
        duration: 2,
        ease: 'power2.out',
        stagger: 0.3
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="skills" ref={sectionRef} className="skills-section section">
      {/* 3D Background */}
      <div className="skills-canvas">
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
          <SkillsScene />
        </Canvas>
      </div>

      <div className="skills-container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">[ NEURAL CAPABILITIES ]</span>
          <h2 className="section-title">
            <span className="title-icon">⬡</span>
            Skills Matrix
          </h2>
          <p className="section-subtitle">
            A comprehensive map of technical proficiencies and expertise
          </p>
        </div>

        {/* Skills Grid */}
        <div className="skills-grid">
          {skillCategories.map((category, categoryIndex) => (
            <div 
              key={category.name}
              className="skill-category glass-panel hoverable"
              style={{ '--category-color': category.color }}
              onMouseEnter={() => setActiveSkill(category.name)}
              onMouseLeave={() => setActiveSkill(null)}
            >
              {/* Category Header */}
              <div className="category-header">
                <div className="category-icon-wrapper">
                  <span className="category-icon">{category.icon}</span>
                  <span className="node-pulse"></span>
                </div>
                <h3 className="category-name">{category.name}</h3>
                <span className="category-count">{category.skills.length} Skills</span>
              </div>

              {/* Skills List */}
              <div className="category-skills">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skill.name} className="skill-item">
                    <div className="skill-info">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-level">{skill.level}%</span>
                    </div>
                    <div className="skill-bar">
                      <div 
                        className="skill-bar-fill"
                        style={{ 
                          width: `${skill.level}%`,
                          background: `linear-gradient(90deg, ${category.color}, ${category.color}80)`
                        }}
                      ></div>
                      <div className="skill-bar-glow" style={{ background: category.color }}></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Category Glow */}
              <div className="category-glow"></div>

              {/* Connection Lines */}
              <svg className="connection-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
                <line x1="50" y1="0" x2="50" y2="15" />
                <line x1="0" y1="50" x2="15" y2="50" />
                <line x1="100" y1="50" x2="85" y2="50" />
                <line x1="50" y1="100" x2="50" y2="85" />
              </svg>
            </div>
          ))}
        </div>

        {/* Additional Skills */}
        <div className="additional-skills">
          <h3 className="additional-title">
            <span className="title-bracket">[</span>
            Additional Technologies
            <span className="title-bracket">]</span>
          </h3>
          <div className="tech-tags">
            {['Git', 'REST APIs', 'WebSockets', 'Webpack', 'Vite', 'Jest', 'Cypress', 
              'Figma', 'Agile', 'Scrum', 'Web3', 'Solidity', 'Unity', 'Blender'].map((tech, index) => (
              <span key={tech} className="tech-tag hoverable">{tech}</span>
            ))}
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

export default SkillsSection
