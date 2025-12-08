import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './CustomCursor.css'

const CustomCursor = () => {
  const cursorRef = useRef(null)
  const cursorDotRef = useRef(null)
  const cursorRingRef = useRef(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)

  useEffect(() => {
    const cursor = cursorRef.current
    const dot = cursorDotRef.current
    const ring = cursorRingRef.current

    const moveCursor = (e) => {
      gsap.to(dot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
      })
      gsap.to(ring, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: 'power2.out'
      })
    }

    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, .hoverable, input, textarea')
      // Don't change cursor for modal elements
      if (target && !e.target.closest('.modal-overlay, .modal-content, .modal-close')) {
        setIsHovering(true)
      }
    }

    const handleMouseOut = (e) => {
      const target = e.target.closest('a, button, .hoverable, input, textarea')
      if (target && !e.target.closest('.modal-overlay, .modal-content, .modal-close')) {
        setIsHovering(false)
      }
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    window.addEventListener('mousemove', moveCursor)
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  return (
    <div ref={cursorRef} className="custom-cursor">
      <div 
        ref={cursorDotRef} 
        className={`cursor-dot ${isHovering ? 'hovering' : ''} ${isClicking ? 'clicking' : ''}`}
      >
        <div className="cursor-dot-inner"></div>
      </div>
      <div 
        ref={cursorRingRef} 
        className={`cursor-ring ${isHovering ? 'hovering' : ''} ${isClicking ? 'clicking' : ''}`}
      >
        <svg viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" />
        </svg>
      </div>
    </div>
  )
}

export default CustomCursor
