import { useRef, useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Canvas } from '@react-three/fiber'
import HeroScene from '../../scenes/HeroScene'
import './HeroSection.css'

// Cube legend data with colors and types
const LEGEND_ITEMS = [
  { id: 1, name: 'About Me', color: '#ffffff', type: 'html', src: '<h2>About Me</h2><p>Full-stack developer passionate about creating immersive web experiences.</p>' },
  { id: 4, name: 'Portfolio', color: '#ff00ff', type: 'photo', src: 'https://via.placeholder.com/400x300/0a0a1a/00f5ff?text=Portfolio' },
  { id: 5, name: 'Contact', color: '#00ff88', type: 'html', src: '<h2>Contact</h2><p>Email: hello@example.com</p><p>Let\'s build something amazing together.</p>' },
]

const HeroSection = () => {
  const sectionRef = useRef(null)
  const [modalData, setModalData] = useState(null)

  const handleModalOpen = useCallback((data) => {
    // Defer state update to next frame to avoid blocking animation
    requestAnimationFrame(() => {
      setModalData(data)
    })
  }, [])

  const handleModalClose = useCallback(() => {
    requestAnimationFrame(() => {
      setModalData(null)
    })
  }, [])

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && modalData) {
        handleModalClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [modalData])

  return (
    <section id="hero" ref={sectionRef} className="hero-section section">
      {/* 3D Background */}
      <div className="hero-canvas">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <HeroScene 
            onModalOpen={handleModalOpen}
          />
        </Canvas>
      </div>

      {/* Info Card Legend - Top Right */}
      <div className="info-card-legend">
        <div className="legend-title">MY CUBES</div>
        {LEGEND_ITEMS.map((item, index) => (
          <div 
            key={item.name} 
            className="legend-item clickable" 
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => handleModalOpen(item)}
          >
            <div 
              className="legend-cube-3d" 
              style={{ 
                '--cube-color': item.color,
                '--rotation-duration': `${6 + index * 3}s`,
                '--rotation-delay': `${index * -1.4}s`,
                '--rotation-direction': index % 2 === 0 ? 'normal' : 'reverse'
              }}
            >
              <div className="cube-face front"></div>
              <div className="cube-face back"></div>
              <div className="cube-face right"></div>
              <div className="cube-face left"></div>
              <div className="cube-face top"></div>
              <div className="cube-face bottom"></div>
            </div>
            <span className="legend-name" style={{ color: item.color }}>{item.name}</span>
          </div>
        ))}
      </div>

      {/* Modal Overlay - rendered via portal to avoid affecting Canvas */}
      {modalData && createPortal(
        <div className="modal-overlay" style={{ backdropFilter: 'none' }} onClick={handleModalClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleModalClose}>×</button>
            <h2 className="modal-title">{modalData.name}</h2>
            <div className="modal-body">
              {modalData.type === 'photo' ? (
                <img src={modalData.src} alt={modalData.name} className="modal-image" />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: modalData.src }} />
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Grid Floor */}
      <div className="hero-grid"></div>
      
      {/* Scanlines */}
      <div className="hero-scanlines"></div>

      {/* HUD Corners */}
      <div className="hud-corner top-left"></div>
      <div className="hud-corner top-right"></div>
      <div className="hud-corner bottom-left"></div>
      <div className="hud-corner bottom-right"></div>
    </section>
  )
}

export default HeroSection
