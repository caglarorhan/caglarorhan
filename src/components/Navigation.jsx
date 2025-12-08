import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import './Navigation.css'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const navRef = useRef(null)

  const navItems = [
    { id: 'hero', label: 'Home', icon: '◈' },
    { id: 'about', label: 'About', icon: '◇' },
    { id: 'projects', label: 'Projects', icon: '▣' },
    { id: 'experience', label: 'Experience', icon: '◎' },
    { id: 'blog', label: 'Blog', icon: '◆' },
    { id: 'skills', label: 'Skills', icon: '⬡' },
    { id: 'contact', label: 'Contact', icon: '◉' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      
      // Find active section
      const sections = navItems.map(item => document.getElementById(item.id))
      const scrollPos = window.scrollY + window.innerHeight / 3
      
      sections.forEach((section, index) => {
        if (section) {
          const top = section.offsetTop
          const bottom = top + section.offsetHeight
          if (scrollPos >= top && scrollPos < bottom) {
            setActiveSection(navItems[index].id)
          }
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isOpen) {
      gsap.to('.nav-menu', {
        clipPath: 'circle(150% at 95% 5%)',
        duration: 0.6,
        ease: 'power3.inOut'
      })
      gsap.to('.nav-item', {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        delay: 0.2,
        ease: 'power3.out'
      })
    } else {
      gsap.to('.nav-item', {
        opacity: 0,
        y: 20,
        stagger: 0.05,
        ease: 'power3.in'
      })
      gsap.to('.nav-menu', {
        clipPath: 'circle(0% at 95% 5%)',
        duration: 0.4,
        delay: 0.3,
        ease: 'power3.inOut'
      })
    }
  }, [isOpen])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsOpen(false)
    }
  }

  return (
    <nav ref={navRef} className={`navigation ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* Logo */}
        <a href="#hero" className="nav-logo hoverable" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>
          <span className="logo-bracket">[</span>
          <span className="logo-text">C.O</span>
          <span className="logo-bracket">]</span>
          <span className="logo-sub">// SYSTEM</span>
        </a>

        {/* Desktop Nav */}
        <div className="nav-links">
          {navItems.map((item) => (
            <a 
              key={item.id}
              href={`#${item.id}`}
              className={`nav-link hoverable ${activeSection === item.id ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); scrollToSection(item.id); }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </a>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={`nav-toggle hoverable ${isOpen ? 'open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span className="toggle-line"></span>
          <span className="toggle-line"></span>
          <span className="toggle-line"></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className="nav-menu">
        <div className="nav-menu-inner">
          <div className="menu-header">
            <span className="menu-title">NAVIGATION</span>
            <span className="menu-version">v2.0.25</span>
          </div>
          <div className="menu-items">
            {navItems.map((item) => (
              <a 
                key={item.id}
                href={`#${item.id}`}
                className={`nav-item hoverable ${activeSection === item.id ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); scrollToSection(item.id); }}
              >
                <span className="item-icon">{item.icon}</span>
                <span className="item-label">{item.label}</span>
                <span className="item-arrow">→</span>
              </a>
            ))}
          </div>
          <div className="menu-footer">
            <span className="status-dot"></span>
            <span className="status-text">System Online</span>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
