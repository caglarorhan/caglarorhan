import { useState } from 'react'
import './FloatingLinks.css'
import FuturisticModal from './FuturisticModal'

const FloatingLinks = () => {
  const [activeModal, setActiveModal] = useState(null)

  const links = [
    {
      id: 'about',
      label: 'ABOUT',
      icon: '◈',
      position: { x: 75, y: 30 },
      color: '#00f5ff',
      content: {
        title: 'About Me',
        body: `Your bio goes here. Tell visitors about yourself, your background, 
               your passion for technology, and what drives you as a developer.
               
               This is placeholder text - replace it with your real information.`
      }
    }
  ]

  const openModal = (link) => {
    setActiveModal(link)
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  return (
    <>
      <div className="floating-links">
        {links.map((link) => (
          <button
            key={link.id}
            className="floating-link hoverable"
            style={{
              left: `${link.position.x}%`,
              top: `${link.position.y}%`,
              '--link-color': link.color
            }}
            onClick={() => openModal(link)}
          >
            <div className="link-particle">
              <div className="particle-core">
                <span className="particle-icon">{link.icon}</span>
              </div>
              <div className="particle-ring"></div>
              <div className="particle-ring ring-2"></div>
              <div className="particle-glow"></div>
            </div>
            <span className="link-label">{link.label}</span>
          </button>
        ))}
      </div>

      <FuturisticModal 
        isOpen={activeModal !== null}
        onClose={closeModal}
        title={activeModal?.content?.title || 'Info'}
        color={activeModal?.color || '#00f5ff'}
        content={{
          text: activeModal?.content?.body || ''
        }}
      />
    </>
  )
}

export default FloatingLinks
