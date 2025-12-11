import { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { Canvas } from '@react-three/fiber'
import HeroScene from '../../scenes/HeroScene'
import VoiceAssistant from '../VoiceAssistant'
import './HeroSection.css'

// Safe HTML parser - converts trusted HTML string to React elements
// Only allows safe tags to avoid security scanner warnings
const renderSafeHtml = (htmlString) => {
  if (!htmlString) return null
  
  // Parse HTML string and convert to React elements
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlString, 'text/html')
  
  const convertNode = (node, index = 0) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent
    }
    
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return null
    }
    
    const tagName = node.tagName.toLowerCase()
    const allowedTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'b', 'i', 'span', 'div', 'br', 'a']
    
    if (!allowedTags.includes(tagName)) {
      // For disallowed tags, just return the text content
      return node.textContent
    }
    
    const children = Array.from(node.childNodes).map((child, i) => convertNode(child, i))
    
    // Special handling for anchor tags - preserve href and add security attributes
    if (tagName === 'a') {
      const href = node.getAttribute('href')
      return (
        <a 
          key={index} 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer"
          className="modal-link"
        >
          {children}
        </a>
      )
    }
    
    const Tag = tagName
    return <Tag key={index}>{children}</Tag>
  }
  
  return Array.from(doc.body.childNodes).map((node, i) => convertNode(node, i))
}

const HeroSection = () => {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const [modalData, setModalData] = useState(null)
  const [particles, setParticles] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  
  // Turret state
  const [turretHovered, setTurretHovered] = useState(false)
  const [turretLocked, setTurretLocked] = useState(false) // Locked in active state via double-click
  const [turretFiring, setTurretFiring] = useState(false)
  const [turretAngle, setTurretAngle] = useState(-90) // -90 = pointing up
  const [bullets, setBullets] = useState([])
  const bulletIdRef = useRef(0)
  const turretRef = useRef(null)
  const firingIntervalRef = useRef(null)
  const turretAngleRef = useRef(-90) // Ref to track current angle for firing
  
  // Cube screen positions for collision detection
  const cubeScreenPositionsRef = useRef({})
  
  // Bullet positions ref for real-time collision in 3D scene
  const bulletPositionsRef = useRef([])
  
  // Turret is active if hovered OR locked
  const turretActive = turretHovered || turretLocked
  
  // Track mouse position for aiming
  const mousePositionRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  
  // Modal handlers - defined early so they can be used in other callbacks
  const handleModalOpen = useCallback((data) => {
    requestAnimationFrame(() => {
      setModalData(data)
    })
  }, [])

  const handleModalClose = useCallback(() => {
    requestAnimationFrame(() => {
      setModalData(null)
    })
  }, [])
  
  // Update angle ref when state changes
  useEffect(() => {
    turretAngleRef.current = turretAngle
  }, [turretAngle])
  
  // Turret firing logic - fires toward mouse position with 3D depth based on distance
  const fireBullet = useCallback(() => {
    if (!turretRef.current) return
    const turretRect = turretRef.current.getBoundingClientRect()
    const turretCenterX = turretRect.left + turretRect.width / 2
    const turretCenterY = turretRect.top + turretRect.height / 2
    
    // Get current turret angle to calculate barrel tip position
    const currentAngle = turretAngleRef.current
    const angleRad = (currentAngle) * (Math.PI / 180)
    
    // Barrel length (should match CSS barrel height + tip)
    const barrelLength = 55
    
    // Calculate barrel tip position in screen space
    const startScreenX = turretCenterX + Math.cos(angleRad) * barrelLength
    const startScreenY = turretCenterY + Math.sin(angleRad) * barrelLength
    
    const bulletId = bulletIdRef.current++
    
    // Get target position (mouse)
    const targetX = mousePositionRef.current.x
    const targetY = mousePositionRef.current.y
    
    // Calculate 2D direction from barrel to mouse
    const dx2D = targetX - startScreenX
    const dy2D = targetY - startScreenY
    const dist2D = Math.sqrt(dx2D * dx2D + dy2D * dy2D)
    
    // Minimum distance check - if mouse is too close, use turret angle direction
    const minDistance = 50 // pixels
    let dirX, dirY
    if (dist2D < minDistance) {
      // Use turret barrel direction instead
      dirX = Math.cos(angleRad)
      dirY = Math.sin(angleRad)
    } else {
      // Normalize 2D direction
      dirX = dx2D / dist2D
      dirY = dy2D / dist2D
    }
    
    // Calculate distance from turret center to mouse - for Z depth control
    const distanceToMouse = Math.sqrt(
      Math.pow(targetX - turretCenterX, 2) + 
      Math.pow(targetY - turretCenterY, 2)
    )
    // Use smaller max distance for more sensitivity
    const maxDistance = Math.min(window.innerWidth, window.innerHeight) * 0.4
    const normalizedDistance = Math.min(1, distanceToMouse / maxDistance)
    
    // Z velocity: INVERTED - closer to turret = DEEPER into space, farther = SHALLOWER
    // Mouse close to turret (normalizedDistance ≈ 0) = strong negative vz (deep into scene)
    // Mouse far from turret (normalizedDistance ≈ 1) = weak/no negative vz (stays shallow)
    // Negative Z goes into the screen (toward black hole at Z=0)
    const vzDeep = -0.08  // Maximum depth speed (when mouse is close to turret)
    const vzShallow = -0.02 // Minimum depth speed (when mouse is far from turret)
    const vz3D = vzDeep + normalizedDistance * (vzShallow - vzDeep) // Lerp from deep to shallow
    
    // X and Y velocity based on 2D direction - strong enough to reach edges
    const xySpeed = 0.08  // Increased from 0.04 to allow bullets to spread out
    const vx3D = dirX * xySpeed
    const vy3D = -dirY * xySpeed // Flip Y because screen Y is inverted from 3D Y
    
    // Start position calculation using proper perspective projection
    // Camera is at Z=5, FOV=75 degrees
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    
    // Convert barrel tip screen position to NDC (-1 to 1)
    const ndcX = (startScreenX / screenWidth) * 2 - 1
    const ndcY = -(startScreenY / screenHeight) * 2 + 1
    
    // Calculate world position at the starting Z depth
    // For FOV=75, half-angle = 37.5 degrees, tan(37.5) ≈ 0.767
    // At distance d from camera, visible half-height = d * tan(37.5°)
    const startZ = 3.8 // Start depth (camera at Z=5)
    const distanceFromCamera = 5 - startZ // = 1.2
    const fovHalfAngle = (75 / 2) * (Math.PI / 180)
    const visibleHalfHeight = distanceFromCamera * Math.tan(fovHalfAngle)
    const aspectRatio = screenWidth / screenHeight
    const visibleHalfWidth = visibleHalfHeight * aspectRatio
    
    // Convert NDC to world position at startZ
    const startWorldX = ndcX * visibleHalfWidth
    const startWorldY = ndcY * visibleHalfHeight
    
    setBullets(prev => [...prev, {
      id: bulletId,
      x3D: startWorldX,
      y3D: startWorldY,
      z3D: startZ,
      vx3D,
      vy3D,
      vz3D,
      screenX: startScreenX,
      screenY: startScreenY,
      createdAt: Date.now()
    }])
  }, [])
  
  // Handle turret double-click - toggle locked state
  const handleTurretDoubleClick = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setTurretLocked(prev => !prev)
  }, [])
  
  // Handle turret pointer down - start firing
  const handleTurretPointerDown = useCallback((e) => {
    e.preventDefault()
    setTurretFiring(true)
    fireBullet() // Fire immediately
    firingIntervalRef.current = setInterval(fireBullet, 150) // Fire every 150ms
  }, [fireBullet])
  
  // Handle turret pointer up - stop firing
  const handleTurretPointerUp = useCallback(() => {
    setTurretFiring(false)
    if (firingIntervalRef.current) {
      clearInterval(firingIntervalRef.current)
      firingIntervalRef.current = null
    }
  }, [])
  
  // Handle global pointer move for turret aiming
  const handleTurretPointerMove = useCallback((e) => {
    // Always track mouse position for firing direction
    mousePositionRef.current = { x: e.clientX, y: e.clientY }
    
    if (!turretActive || !turretRef.current) return
    const turretRect = turretRef.current.getBoundingClientRect()
    const turretCenterX = turretRect.left + turretRect.width / 2
    const turretCenterY = turretRect.top + turretRect.height / 2
    
    const dx = e.clientX - turretCenterX
    const dy = e.clientY - turretCenterY
    const angle = Math.atan2(dy, dx) * (180 / Math.PI)
    
    // Allow full 360 degree aiming - no clamping
    setTurretAngle(angle)
  }, [turretActive])
  
  // Global event listeners for turret
  useEffect(() => {
    if (turretActive) {
      window.addEventListener('pointermove', handleTurretPointerMove)
      window.addEventListener('pointerup', handleTurretPointerUp)
    }
    return () => {
      window.removeEventListener('pointermove', handleTurretPointerMove)
      window.removeEventListener('pointerup', handleTurretPointerUp)
    }
  }, [turretActive, handleTurretPointerMove, handleTurretPointerUp])
  
  // Global pointerdown for firing when turret is locked
  const handleGlobalPointerDown = useCallback((e) => {
    // Don't fire if clicking on UI elements
    if (e.target.closest('.info-card-legend, .modal-overlay, .voice-assistant-btn, .turret-orb')) return
    
    e.preventDefault()
    setTurretFiring(true)
    fireBullet()
    if (firingIntervalRef.current) {
      clearInterval(firingIntervalRef.current)
    }
    firingIntervalRef.current = setInterval(fireBullet, 150)
  }, [fireBullet])
  
  // Global pointerup to stop firing
  const handleGlobalPointerUp = useCallback(() => {
    setTurretFiring(false)
    if (firingIntervalRef.current) {
      clearInterval(firingIntervalRef.current)
      firingIntervalRef.current = null
    }
  }, [])
  
  useEffect(() => {
    if (turretLocked) {
      window.addEventListener('pointerdown', handleGlobalPointerDown)
      window.addEventListener('pointerup', handleGlobalPointerUp)
    }
    return () => {
      window.removeEventListener('pointerdown', handleGlobalPointerDown)
      window.removeEventListener('pointerup', handleGlobalPointerUp)
      // Also clear any running interval on cleanup
      if (firingIntervalRef.current) {
        clearInterval(firingIntervalRef.current)
        firingIntervalRef.current = null
      }
    }
  }, [turretLocked, handleGlobalPointerDown, handleGlobalPointerUp])
  
  // Apply turret sight cursor to body when turret is active
  useEffect(() => {
    if (turretActive) {
      document.body.classList.add('turret-sight-cursor')
    } else {
      document.body.classList.remove('turret-sight-cursor')
    }
    return () => {
      document.body.classList.remove('turret-sight-cursor')
    }
  }, [turretActive])
  
  // Track hit cubes to trigger explosion/modal
  const hitCubesRef = useRef(new Set())
  // Track cubes to explode (will be passed to HeroScene) - use array for easier React handling
  const [cubesToExplode, setCubesToExplode] = useState([])
  
  // Handle cube positions update from 3D scene (no longer needed for collision, kept for potential use)
  const handleCubePositionsUpdate = useCallback((positions) => {
    cubeScreenPositionsRef.current = positions
  }, [])
  
  // Handle when 3D scene detects a bullet hit - mark bullet as hit and trigger cube effect
  const handleBulletHit = useCallback((bulletId, cubeId, cubeData) => {
    // Mark bullet as hit (will be filtered out in next animation frame)
    setBullets(prev => prev.map(b => b.id === bulletId ? { ...b, hit: true } : b))
    
    // ALL cubes explode when hit by bullet
    const numericId = typeof cubeId === 'string' ? parseInt(cubeId) : cubeId
    setCubesToExplode(prev => {
      if (prev.includes(numericId)) return prev
      return [...prev, numericId]
    })
    // Clear after explosion triggers
    setTimeout(() => {
      setCubesToExplode(prev => prev.filter(id => id !== numericId))
    }, 100)
    
    // Interactive cubes also open their modal
    if (cubeData && cubeData.type !== null && cubeData.name !== null) {
      // Small delay so explosion is visible before modal
      setTimeout(() => {
        handleModalOpen(cubeData)
      }, 300)
    }
  }, [handleModalOpen])
  
  // Handle bullet hitting a cube (legacy - now handled by handleBulletHit)
  const handleBulletHitCube = useCallback((cubeId, cubeData) => {
    if (cubeData && cubeData.type !== null && cubeData.name !== null) {
      // Non-null cube - open modal
      handleModalOpen(cubeData)
    } else {
      // Null cube - trigger explosion in 3D scene
      const numericId = typeof cubeId === 'string' ? parseInt(cubeId) : cubeId
      setCubesToExplode(prev => {
        if (prev.includes(numericId)) return prev
        return [...prev, numericId]
      })
      // Clear after explosion triggers
      setTimeout(() => {
        setCubesToExplode(prev => prev.filter(id => id !== numericId))
      }, 100)
    }
  }, [handleModalOpen])
  
  // Bullet animation loop with 3D physics and subtle black hole gravity
  useEffect(() => {
    if (bullets.length === 0) {
      bulletPositionsRef.current = []
      return
    }
    
    // Black hole gravity settings - subtle pull
    const blackHoleX = 0
    const blackHoleY = 0
    const blackHoleZ = 0
    const blackHoleGravity = 0.009 // Gravity pull
    const eventHorizonRadius = 0.2 // Bullets disappear when very close
    
    const animateBullets = () => {
      setBullets(prev => {
        const now = Date.now()
        const updatedBullets = prev
          .map(b => {
            // Calculate distance to black hole
            const dx = blackHoleX - b.x3D
            const dy = blackHoleY - b.y3D
            const dz = blackHoleZ - b.z3D
            const distanceSquared = dx * dx + dy * dy + dz * dz
            const distance = Math.sqrt(distanceSquared)
            
            // Apply subtle gravitational pull
            const gravityStrength = blackHoleGravity / (distanceSquared + 0.5)
            const gravityX = distance > 0 ? (dx / distance) * gravityStrength : 0
            const gravityY = distance > 0 ? (dy / distance) * gravityStrength : 0
            const gravityZ = distance > 0 ? (dz / distance) * gravityStrength : 0
            
            return {
              ...b,
              vx3D: b.vx3D + gravityX,
              vy3D: b.vy3D + gravityY,
              vz3D: b.vz3D + gravityZ,
              x3D: b.x3D + b.vx3D + gravityX,
              y3D: b.y3D + b.vy3D + gravityY,
              z3D: b.z3D + b.vz3D + gravityZ,
              distanceToBlackHole: distance
            }
          })
          .filter(b => {
            if (b.hit) return false
            if (now - b.createdAt > 15000) return false // 15 seconds max lifetime
            if (b.distanceToBlackHole < eventHorizonRadius) return false // Sucked into black hole
            
            // Remove when too far (would appear smaller than ~4px)
            // Camera at Z=5, bullet starts at Z=3.8, going negative
            // At Z=-15, bullet is 20 units from camera - very tiny
            if (b.z3D < -15) return false // Deep into space
            if (b.z3D > 6) return false // Behind camera
            if (Math.abs(b.x3D) > 20 || Math.abs(b.y3D) > 20) return false // Way off screen
            return true
          })
        
        // Update bullet positions ref for 3D collision detection
        bulletPositionsRef.current = updatedBullets.map(b => ({
          id: b.id,
          x3D: b.x3D,
          y3D: b.y3D,
          z3D: b.z3D
        }))
        
        return updatedBullets
      })
    }
    
    const animationId = requestAnimationFrame(animateBullets)
    return () => cancelAnimationFrame(animationId)
  }, [bullets])
  
  // Cleanup firing interval on unmount
  useEffect(() => {
    return () => {
      if (firingIntervalRef.current) {
        clearInterval(firingIntervalRef.current)
      }
    }
  }, [])
  
  // Load particles from JSON
  useEffect(() => {
    import('../../config/particles.config.js')
      .then(module => module.fetchParticles())
      .then(data => {
        setParticles(data)
      })
      .catch(err => {
        console.error('Failed to load particles:', err)
      })
  }, [])
  
  // Filter particles that are listed (isListed: true)
  const listedParticles = useMemo(() => {
    return particles.filter(p => p.isListed === true)
  }, [particles])
  
  // Find matching particle IDs for search highlighting
  const highlightedIds = useMemo(() => {
    if (!searchQuery.trim()) return []
    const query = searchQuery.toLowerCase().trim()
    return particles
      .filter(p => p.name && p.name.toLowerCase().includes(query))
      .map(p => p.id)
  }, [particles, searchQuery])

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
            highlightedIds={highlightedIds}
            onCubePositionsUpdate={handleCubePositionsUpdate}
            onBulletHitCube={handleBulletHitCube}
            cubesToExplode={cubesToExplode}
            bulletPositionsRef={bulletPositionsRef}
            bullets3D={bullets}
            onBulletHit={handleBulletHit}
            turretActive={turretActive}
          />
        </Canvas>
      </div>

      {/* Info Card Legend - Top Right */}
      <div className="info-card-legend">
        <div className="legend-title">MY CUBES</div>
        <div className="legend-search">
          <input
            type="text"
            placeholder="Search cubes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button 
              className="search-clear" 
              onClick={() => setSearchQuery('')}
            >
              ×
            </button>
          )}
        </div>
        {listedParticles.map((item, index) => (
          <div 
            key={item.id} 
            className={`legend-item clickable ${highlightedIds.includes(item.id) ? 'highlighted' : ''}`}
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
              ) : modalData.type === 'link' ? (
                <a href={modalData.src} target="_blank" rel="noopener noreferrer" className="modal-link">
                  Visit {modalData.name}
                </a>
              ) : modalData.type === 'html' ? (
                <div className="modal-html-content">
                  {renderSafeHtml(modalData.src)}
                </div>
              ) : (
                <p>{modalData.src}</p>
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

      {/* Turret Orb */}
      <div 
        ref={turretRef}
        className={`turret-orb ${turretActive ? 'turret-active' : ''} ${turretFiring ? 'turret-firing' : ''} ${turretLocked ? 'turret-locked' : ''}`}
        onPointerEnter={() => setTurretHovered(true)}
        onPointerLeave={() => {
          setTurretHovered(false)
          if (!turretLocked) {
            handleTurretPointerUp()
          }
        }}
        onPointerDown={handleTurretPointerDown}
        onDoubleClick={handleTurretDoubleClick}
      >
        <div className="turret-base">
          <div 
            className="turret-barrel" 
            style={{ transform: `rotate(${turretAngle + 90}deg)` }}
          >
            <div className="barrel-tip"></div>
          </div>
        </div>
        <div className="turret-glow"></div>
        {turretLocked && <div className="turret-lock-indicator">🔒</div>}
      </div>
      
      {/* Bullets are now rendered in 3D inside HeroScene */}

      {/* Voice Assistant */}
      <VoiceAssistant />
    </section>
  )
}

export default HeroSection
