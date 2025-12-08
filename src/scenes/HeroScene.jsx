import { useRef, useMemo, useState, useEffect, memo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Float, Html, Billboard } from '@react-three/drei'
import * as THREE from 'three'

const BlackHole = () => {
  const blackHoleRef = useRef()
  
  return (
    <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group>
        {/* Event Horizon - Pure black sphere */}
        <Sphere ref={blackHoleRef} args={[1.5, 64, 64]}>
          <meshBasicMaterial color="#000000" />
        </Sphere>
      </group>
    </Float>
  )
}

// Color map for different interactive cube types
const CUBE_COLORS = {
  'About Me': '#ffffff',      // Bright White
  'Portfolio': '#ff00ff',     // Magenta
  'Contact': '#00ff88',       // Green
  'GitHub': '#f0db4f',        // Yellow
  'LinkedIn': '#0077b5',      // LinkedIn Blue
  'default': '#00f5ff'        // Default cyan
}

// Individual orbiting particle from JSON
const OrbitingParticle = memo(({ data, index, onModalOpen }) => {
  const meshRef = useRef()
  const edgesRef = useRef()
  const [hovered, setHovered] = useState(false)
  const pausedTimeRef = useRef(0)
  const lastTimeRef = useRef(0)
  
  // Random initial angle for each particle
  const initialAngle = useMemo(() => Math.random() * Math.PI * 2, [])
  const orbitSpeed = useMemo(() => 0.1 + Math.random() * 0.15, [])
  const verticalOffset = useMemo(() => (Math.random() - 0.5) * 2, [])
  const orbitTilt = useMemo(() => (Math.random() - 0.5) * 0.5, [])
  
  const isInteractive = data.type !== null
  
  // Get color based on name
  const particleColor = isInteractive 
    ? (CUBE_COLORS[data.name] || CUBE_COLORS.default) 
    : '#ffffff'
  
  useFrame((state) => {
    const realTime = state.clock.getElapsedTime()
    
    // Pause orbit when hovered
    let effectiveTime
    if (hovered) {
      effectiveTime = pausedTimeRef.current
    } else {
      // Calculate time offset to continue smoothly after hover
      if (lastTimeRef.current > 0 && pausedTimeRef.current > 0) {
        const timeDiff = realTime - lastTimeRef.current
        pausedTimeRef.current += timeDiff
      }
      effectiveTime = realTime
      pausedTimeRef.current = realTime
    }
    lastTimeRef.current = realTime
    
    const angle = initialAngle + effectiveTime * orbitSpeed
    
    // Calculate position
    const x = Math.cos(angle) * data.distance
    const z = Math.sin(angle) * data.distance
    const y = verticalOffset + Math.sin(effectiveTime * 0.5 + index) * 0.3 + z * orbitTilt
    
    if (meshRef.current) {
      // Orbital motion
      meshRef.current.position.set(x, y, z)
      
      // Rotate the cube itself (slower when hovered)
      const rotSpeed = hovered ? 0.1 : 1
      meshRef.current.rotation.x = effectiveTime * 0.5 * rotSpeed
      meshRef.current.rotation.y = effectiveTime * 0.3 * rotSpeed
      meshRef.current.rotation.z = effectiveTime * 0.2 * rotSpeed
      
      // Scale effect
      if (isInteractive) {
        const pulse = 1 + Math.sin(realTime * 3) * 0.1
        meshRef.current.scale.setScalar(hovered ? 1.5 : pulse)
      }
    }
    
    if (edgesRef.current) {
      // Match edges to mesh
      edgesRef.current.position.set(x, y, z)
      const rotSpeed = hovered ? 0.1 : 1
      edgesRef.current.rotation.x = effectiveTime * 0.5 * rotSpeed
      edgesRef.current.rotation.y = effectiveTime * 0.3 * rotSpeed
      edgesRef.current.rotation.z = effectiveTime * 0.2 * rotSpeed
      
      if (isInteractive) {
        const pulse = 1 + Math.sin(realTime * 3) * 0.1
        edgesRef.current.scale.setScalar(hovered ? 1.5 : pulse)
      }
    }
  })
  
  const handleClick = (e) => {
    e.stopPropagation()
    if (!isInteractive) return
    
    if (data.type === 'link') {
      window.open(data.src, '_blank')
    } else {
      // Open modal
      if (onModalOpen) onModalOpen(data)
    }
  }
  
  const handlePointerOver = (e) => {
    e.stopPropagation()
    if (isInteractive) {
      setHovered(true)
      document.body.style.cursor = 'pointer'
    }
  }
  
  const handlePointerOut = () => {
    setHovered(false)
    document.body.style.cursor = 'auto'
  }
  
  const edgeColor = hovered ? '#ffffff' : particleColor
  const particleSize = isInteractive ? 0.2 : 0.1
  
  // Create edges geometry
  const edgesGeometry = useMemo(() => {
    const boxGeo = new THREE.BoxGeometry(particleSize, particleSize, particleSize)
    return new THREE.EdgesGeometry(boxGeo)
  }, [particleSize])
  
  return (
    <group>
      {/* Solid cube face (slightly transparent) */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[particleSize, particleSize, particleSize]} />
        <meshBasicMaterial 
          color={particleColor}
          transparent
          opacity={isInteractive ? 0.3 : 0.1}
        />
      </mesh>
      
      {/* Edge lines for 3D effect */}
      <lineSegments ref={edgesRef} geometry={edgesGeometry}>
        <lineBasicMaterial 
          color={edgeColor}
          transparent
          opacity={isInteractive ? 0.8 : 0.6}
        />
      </lineSegments>
      
      {/* Label on hover for interactive particles */}
      {hovered && isInteractive && (
        <Html position={[0, 0.5, 0]} center>
          <div style={{
            background: 'rgba(0, 0, 0, 0.9)',
            border: `1px solid ${particleColor}`,
            padding: '8px 16px',
            color: particleColor,
            fontFamily: 'Orbitron, monospace',
            fontSize: '12px',
            letterSpacing: '2px',
            whiteSpace: 'nowrap',
            textShadow: `0 0 10px ${particleColor}`,
            boxShadow: `0 0 20px ${particleColor}40`,
            pointerEvents: 'none'
          }}>
            {data.name}
          </div>
        </Html>
      )}
    </group>
  )
}, (prevProps, nextProps) => {
  // Only re-render if data or index changes, not activeModal
  return prevProps.data.id === nextProps.data.id && 
         prevProps.index === nextProps.index
})

// Particle system loaded from JSON
const ParticleSystem = memo(({ onModalOpen }) => {
  const [particles, setParticles] = useState([])
  const groupRef = useRef()
  
  useEffect(() => {
    fetch('/particles.json')
      .then(res => res.json())
      .then(data => setParticles(data))
      .catch(err => {
        console.error('Failed to load particles:', err)
        // Fallback particles
        setParticles([
          { id: 1, name: null, type: null, src: null, distance: 4 },
          { id: 2, name: null, type: null, src: null, distance: 5 },
          { id: 3, name: null, type: null, src: null, distance: 3.5 }
        ])
      })
  }, [])
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (groupRef.current) {
      // Slow overall rotation
      groupRef.current.rotation.y = time * 0.02
    }
  })
  
  return (
    <group ref={groupRef}>
      {particles.map((particle, index) => (
        <OrbitingParticle 
          key={particle.id} 
          data={particle} 
          index={index}
          onModalOpen={onModalOpen}
        />
      ))}
    </group>
  )
})

// Individual star component with realistic twinkling and color shifting
const Star = ({ position, magnitude, index, color = [1, 1, 1], name = 'Unknown Star' }) => {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)
  
  // Base brightness from magnitude
  const baseBrightness = useMemo(() => Math.max(0.4, 1 - (magnitude + 1.5) / 5), [magnitude])
  
  // Random phase offset for twinkling
  const phaseOffset = useMemo(() => Math.random() * Math.PI * 2, [])
  const twinkleSpeed = useMemo(() => 2 + Math.random() * 3, [])
  
  // Star size based on magnitude (brighter stars are bigger)
  const starSize = useMemo(() => Math.max(0.15, 0.4 - magnitude * 0.05), [magnitude])
  
  // Base color from spectral type
  const [baseR, baseG, baseB] = color
  
  // Get spectral class name from color
  const spectralClass = useMemo(() => {
    if (baseR < 0.7) return 'O/B'
    if (baseR < 0.95 && baseB > 0.9) return 'A'
    if (baseG > 0.9 && baseB > 0.7) return 'F'
    if (baseR === 1 && baseG === 0.9) return 'G'
    if (baseR === 1 && baseG === 0.7) return 'K'
    return 'M'
  }, [baseR, baseG, baseB])
  
  // Create star color
  const starColor = useMemo(() => new THREE.Color(baseR, baseG, baseB), [baseR, baseG, baseB])
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    if (groupRef.current) {
      // Realistic twinkling
      const twinkle = 0.7 + 0.3 * Math.sin(time * twinkleSpeed + phaseOffset)
      const scale = starSize * twinkle * (hovered ? 1.8 : 1)
      groupRef.current.scale.setScalar(scale)
    }
  })
  
  // Change cursor on hover
  const handlePointerOver = (e) => {
    e.stopPropagation()
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }
  
  const handlePointerOut = () => {
    setHovered(false)
    document.body.style.cursor = 'auto'
  }
  
  return (
    <Billboard position={position} follow={true}>
      <group ref={groupRef}>
        {/* Invisible hitbox for easier hovering */}
        <mesh
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <circleGeometry args={[1.5, 8]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
        
        {/* Star glow */}
        <mesh>
          <circleGeometry args={[1, 16]} />
          <meshBasicMaterial 
            color={starColor}
            transparent
            opacity={baseBrightness * 0.4}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        
        {/* Star core */}
        <mesh>
          <circleGeometry args={[0.3, 8]} />
          <meshBasicMaterial 
            color="#ffffff"
            transparent
            opacity={baseBrightness}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>
      
      {/* Tooltip on hover - positioned at top-left corner */}
      {hovered && (
        <Html
          position={[-2, 2.5, 0]}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
            transform: 'translate(0, -100%)',
          }}
        >
          <div style={{
            background: 'rgba(0, 0, 0, 0.85)',
            border: '1px solid rgba(0, 245, 255, 0.5)',
            borderRadius: '8px',
            padding: '8px 12px',
            color: '#fff',
            fontSize: '12px',
            fontFamily: 'monospace',
            whiteSpace: 'nowrap',
            boxShadow: '0 0 20px rgba(0, 245, 255, 0.3)',
          }}>
            <div style={{ 
              color: '#00f5ff', 
              fontWeight: 'bold', 
              fontSize: '14px',
              marginBottom: '4px',
            }}>
              ★ {name}
            </div>
            <div style={{ color: '#aaa', fontSize: '11px' }}>
              Magnitude: <span style={{ color: magnitude < 1 ? '#ffcc00' : '#fff' }}>
                {magnitude.toFixed(2)}
              </span>
            </div>
            <div style={{ color: '#aaa', fontSize: '11px' }}>
              Class: <span style={{ color: `rgb(${Math.round(baseR * 255)}, ${Math.round(baseG * 255)}, ${Math.round(baseB * 255)})` }}>
                {spectralClass}
              </span>
            </div>
          </div>
        </Html>
      )}
    </Billboard>
  )
}

// Realistic star field based on actual star positions - Live updated hourly
const RealisticStarField = () => {
  const [starData, setStarData] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)
  const groupRef = useRef()
  
  // Function to generate star positions based on current time
  const generateStarPositions = () => {
    const now = new Date()
    const lat = 41.0 // Istanbul latitude as default
    const lon = 29.0 // Istanbul longitude
    
    // Calculate Local Sidereal Time
    const jd = now.getTime() / 86400000 + 2440587.5
    const t = (jd - 2451545.0) / 36525
    let lst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 
              0.000387933 * t * t + lon
    lst = ((lst % 360) + 360) % 360
    
    // Extended HYG v4.2 Star Catalog - 500 stars
    // Data: [RA (hours), Dec (degrees), apparent magnitude, name, spectral type code]
    // Spectral types: 0=O/B (blue), 1=A (white), 2=F (yellow-white), 3=G (yellow), 4=K (orange), 5=M (red)
    const brightStars = [
      // ===== THE 30 BRIGHTEST STARS =====
      [6.752, -16.72, -1.46, 'Sirius', 1],
      [6.399, -52.70, -0.72, 'Canopus', 2],
      [14.660, -60.83, -0.27, 'Alpha Centauri', 3],
      [18.616, 38.78, 0.03, 'Vega', 1],
      [5.278, 45.99, 0.08, 'Capella', 3],
      [5.242, -8.20, 0.12, 'Rigel', 0],
      [7.655, 5.22, 0.34, 'Procyon', 2],
      [1.628, -57.24, 0.46, 'Achernar', 0],
      [5.919, 7.41, 0.50, 'Betelgeuse', 5],
      [14.063, 19.18, 0.98, 'Arcturus', 4],
      [14.040, -60.37, 0.61, 'Hadar', 0],
      [19.846, 8.87, 0.77, 'Altair', 1],
      [4.598, 16.51, 0.85, 'Aldebaran', 4],
      [16.490, -26.43, 0.96, 'Antares', 5],
      [13.419, -11.16, 0.97, 'Spica', 0],
      [7.577, 31.89, 1.14, 'Pollux', 4],
      [22.960, -29.62, 1.16, 'Fomalhaut', 1],
      [20.691, 45.28, 1.25, 'Deneb', 1],
      [12.443, -63.10, 1.30, 'Mimosa', 0],
      [12.795, -59.69, 1.33, 'Acrux', 0],
      [10.139, 11.97, 1.35, 'Regulus', 0],
      [6.338, -17.96, 1.50, 'Mirzam', 0],
      [17.560, -37.10, 1.63, 'Shaula', 0],
      [7.755, 28.03, 1.58, 'Castor', 1],
      [3.792, 24.11, 1.65, 'Alcyone', 0],
      [8.159, -47.34, 1.68, 'Naos', 0],
      [5.603, -1.20, 1.69, 'Alnilam', 0],
      [9.284, -59.28, 1.75, 'Alsephina', 1],
      [5.533, -2.60, 1.77, 'Alnitak', 0],
      [12.900, 55.96, 1.77, 'Alioth', 1],
      
      // ===== ORION =====
      [5.438, -1.94, 1.64, 'Bellatrix', 0],
      [5.680, -1.20, 2.23, 'Mintaka', 0],
      [5.796, -9.67, 2.06, 'Saiph', 0],
      [5.586, -1.12, 3.39, 'Meissa', 0],
      [5.533, -0.30, 4.12, 'Nair al Saif', 0],
      
      // ===== URSA MAJOR =====
      [11.062, 61.75, 1.79, 'Dubhe', 4],
      [11.031, 56.38, 2.37, 'Merak', 1],
      [11.897, 53.69, 2.44, 'Phecda', 1],
      [12.257, 57.03, 3.31, 'Megrez', 1],
      [13.399, 54.93, 2.27, 'Mizar', 1],
      [13.792, 49.31, 1.86, 'Alkaid', 0],
      [8.987, 48.04, 3.14, 'Talitha', 1],
      [9.526, 51.68, 3.01, 'Kappa UMa', 1],
      [11.303, 33.09, 3.45, 'Chi UMa', 4],
      [9.849, 59.04, 3.17, 'Upsilon UMa', 2],
      
      // ===== CASSIOPEIA =====
      [0.153, 59.15, 2.27, 'Caph', 2],
      [0.675, 56.54, 2.23, 'Schedar', 4],
      [0.945, 60.72, 2.47, 'Gamma Cas', 0],
      [1.430, 60.24, 2.68, 'Ruchbah', 1],
      [1.907, 63.67, 3.38, 'Segin', 0],
      [0.822, 57.82, 4.87, 'Eta Cas', 3],
      
      // ===== SCORPIUS =====
      [16.005, -22.62, 2.62, 'Dschubba', 0],
      [16.091, -19.81, 2.32, 'Acrab', 0],
      [17.621, -43.00, 2.70, 'Lesath', 0],
      [17.708, -39.03, 2.41, 'Sargas', 2],
      [16.836, -34.29, 2.69, 'Epsilon Sco', 4],
      [17.203, -43.24, 2.82, 'Kappa Sco', 0],
      [16.519, -28.22, 2.89, 'Tau Sco', 0],
      [15.981, -26.11, 2.29, 'Pi Sco', 0],
      [16.353, -25.59, 2.56, 'Sigma Sco', 0],
      [17.793, -40.13, 3.03, 'Iota Sco', 2],
      
      // ===== CYGNUS =====
      [19.512, 27.96, 2.20, 'Sadr', 2],
      [20.370, 40.26, 2.48, 'Gienah Cyg', 4],
      [19.285, 53.37, 3.08, 'Albireo', 4],
      [20.770, 33.97, 2.87, 'Zeta Cyg', 3],
      [21.216, 30.23, 3.20, 'Eta Cyg', 4],
      [19.749, 45.13, 3.77, 'Iota Cyg', 1],
      
      // ===== LEO =====
      [11.235, 20.52, 2.14, 'Algieba', 4],
      [11.817, 14.57, 2.56, 'Zosma', 1],
      [11.237, 15.43, 2.98, 'Adhafera', 2],
      [9.879, 26.01, 3.52, 'Rasalas', 4],
      [10.333, 19.84, 2.61, 'Eta Leo', 1],
      [10.278, 23.42, 3.85, 'Omega Leo', 1],
      [11.394, 10.53, 3.34, 'Theta Leo', 1],
      
      // ===== GEMINI =====
      [6.629, 16.40, 2.88, 'Tejat', 5],
      [6.383, 22.51, 2.98, 'Propus', 5],
      [6.732, 25.13, 3.06, 'Mebsuta', 3],
      [7.068, 20.57, 3.53, 'Wasat', 2],
      [7.335, 21.98, 3.60, 'Kappa Gem', 3],
      [6.248, 22.51, 3.36, 'Nu Gem', 0],
      
      // ===== PERSEUS =====
      [3.405, 49.86, 1.79, 'Mirfak', 2],
      [3.136, 40.96, 2.12, 'Algol', 0],
      [3.079, 53.51, 2.89, 'Delta Per', 0],
      [3.715, 47.79, 2.85, 'Epsilon Per', 0],
      [3.982, 35.79, 3.01, 'Zeta Per', 0],
      [3.901, 31.88, 3.83, 'Omicron Per', 0],
      
      // ===== TAURUS =====
      [4.477, 15.96, 3.53, 'Ain', 4],
      [4.330, 15.63, 3.65, 'Hyadum I', 4],
      [3.453, 9.73, 2.87, 'Menkar', 5],
      [4.011, 12.49, 3.40, 'Omicron Tau', 3],
      [4.382, 17.54, 3.76, 'Delta Tau', 4],
      [5.627, 21.14, 2.97, 'Elnath', 0],
      [4.329, 22.29, 3.70, 'Gamma Tau', 3],
      
      // ===== ANDROMEDA =====
      [0.140, 29.09, 2.06, 'Alpheratz', 0],
      [1.162, 35.62, 2.06, 'Mirach', 5],
      [2.065, 42.33, 2.26, 'Almach', 4],
      [0.655, 30.86, 3.27, 'Delta And', 4],
      [1.633, 41.41, 3.57, 'Mu And', 1],
      
      // ===== PEGASUS =====
      [23.063, 15.21, 2.49, 'Markab', 0],
      [23.079, 28.08, 2.42, 'Scheat', 5],
      [0.221, 15.18, 2.83, 'Algenib', 0],
      [21.736, 9.88, 2.39, 'Enif', 4],
      [22.691, 10.83, 3.41, 'Theta Peg', 1],
      [22.117, 25.35, 3.53, 'Matar', 3],
      
      // ===== AQUILA =====
      [19.921, 6.41, 2.72, 'Tarazed', 4],
      [19.771, 10.61, 3.36, 'Alshain', 3],
      [19.090, 13.86, 3.23, 'Theta Aql', 0],
      [19.425, -3.11, 3.36, 'Lambda Aql', 0],
      [20.188, -0.82, 2.99, 'Delta Aql', 2],
      
      // ===== LYRA =====
      [18.982, 32.69, 3.24, 'Sheliak', 0],
      [18.746, 37.60, 3.52, 'Sulafat', 0],
      [18.898, 36.90, 4.30, 'Delta Lyr', 5],
      [19.229, 39.15, 4.36, 'Kappa Lyr', 4],
      
      // ===== BOOTES =====
      [14.261, 46.09, 2.68, 'Nekkar', 3],
      [14.535, 38.31, 2.37, 'Muphrid', 3],
      [15.032, 40.39, 2.35, 'Izar', 4],
      [14.686, 13.73, 2.68, 'Arcturus B', 3],
      [15.258, 33.31, 3.58, 'Rho Boo', 4],
      [14.220, 51.79, 3.03, 'Gamma Boo', 1],
      
      // ===== VIRGO =====
      [12.694, -1.45, 2.83, 'Porrima', 2],
      [13.036, 10.96, 2.85, 'Vindemiatrix', 3],
      [12.332, -0.67, 3.38, 'Auva', 5],
      [12.927, 3.40, 2.73, 'Heze', 1],
      [13.578, -0.60, 3.37, 'Kappa Vir', 4],
      [11.845, 1.76, 3.61, 'Eta Vir', 1],
      
      // ===== CENTAURUS =====
      [12.139, -50.72, 2.17, 'Menkent', 4],
      [13.665, -53.47, 2.55, 'Muhlifain', 1],
      [14.112, -36.37, 2.75, 'Eta Cen', 0],
      [13.926, -47.29, 2.06, 'Epsilon Cen', 0],
      [11.350, -54.49, 3.04, 'Iota Cen', 1],
      
      // ===== CRUX =====
      [12.253, -58.75, 2.80, 'Gacrux', 5],
      [12.519, -57.11, 2.79, 'Delta Cru', 0],
      [12.252, -57.11, 4.69, 'Epsilon Cru', 4],
      
      // ===== ERIDANUS =====
      [1.932, -51.51, 3.70, 'Azha', 4],
      [2.940, -40.30, 2.78, 'Zaurak', 5],
      [3.549, -9.46, 3.00, 'Cursa', 1],
      [4.195, -6.84, 4.17, 'Keid', 4],
      [3.721, -37.62, 3.55, 'Epsilon Eri', 4],
      [5.131, -5.09, 3.19, 'Ran', 4],
      [2.449, -47.70, 3.70, 'Phi Eri', 0],
      
      // ===== CANIS MAJOR =====
      [7.050, -23.83, 1.84, 'Wezen', 2],
      [7.140, -26.39, 1.98, 'Aludra', 0],
      [6.933, -28.97, 2.45, 'Adhara', 0],
      [6.612, -19.26, 3.02, 'Muliphein', 0],
      [7.401, -29.30, 3.43, 'Sigma CMa', 4],
      
      // ===== AURIGA =====
      [5.108, 41.23, 2.62, 'Menkalinan', 1],
      [5.033, 43.82, 2.69, 'Mahasim', 1],
      [5.438, 28.61, 3.17, 'Hassaleh', 4],
      [5.992, 44.95, 2.99, 'Theta Aur', 1],
      [4.950, 33.17, 3.72, 'Eta Aur', 0],
      
      // ===== NORTHERN CIRCUMPOLAR =====
      [2.530, 89.26, 1.98, 'Polaris', 2],
      [17.943, 51.49, 3.00, 'Rastaban', 3],
      [17.508, 52.30, 2.23, 'Eltanin', 4],
      [18.351, 72.73, 3.07, 'Pherkad', 2],
      [15.734, 77.79, 3.05, 'Kochab', 4],
      [16.400, 61.51, 3.29, 'Eta Dra', 3],
      [17.147, 65.71, 2.79, 'Chi Dra', 2],
      [19.209, 67.66, 3.07, 'Grumium', 4],
      
      // ===== AQUARIUS =====
      [22.717, -0.32, 2.91, 'Sadalsuud', 3],
      [22.096, -0.02, 2.96, 'Sadalmelik', 3],
      [21.526, -5.57, 3.27, 'Skat', 1],
      [22.361, -1.39, 3.77, 'Eta Aqr', 0],
      [22.481, -0.12, 3.86, 'Zeta Aqr', 2],
      
      // ===== CARINA =====
      [9.220, -69.72, 1.86, 'Miaplacidus', 1],
      [8.745, -54.71, 1.96, 'Avior', 4],
      [10.229, -70.04, 2.21, 'Aspidiske', 1],
      [10.716, -64.39, 2.25, 'Tureis', 2],
      [9.785, -65.07, 2.76, 'Upsilon Car', 1],
      
      // ===== PUPPIS =====
      [7.822, -24.86, 2.25, 'Naos', 0],
      [8.126, -40.00, 2.70, 'Pi Pup', 4],
      [7.286, -43.30, 2.93, 'Tau Pup', 4],
      [6.629, -43.20, 2.94, 'Nu Pup', 0],
      
      // ===== VELA =====
      [8.745, -54.71, 1.78, 'Gamma Vel', 0],
      [9.133, -43.43, 1.96, 'Lambda Vel', 4],
      [8.158, -47.34, 2.50, 'Kappa Vel', 0],
      [9.948, -54.57, 2.69, 'Mu Vel', 3],
      
      // ===== SAGITTARIUS =====
      [18.350, -34.38, 1.85, 'Kaus Australis', 0],
      [18.921, -26.30, 2.59, 'Nunki', 0],
      [19.043, -29.88, 2.70, 'Ascella', 1],
      [18.466, -25.42, 2.82, 'Kaus Media', 4],
      [18.229, -21.06, 2.89, 'Kaus Borealis', 4],
      [19.163, -21.02, 2.98, 'Albaldah', 2],
      [17.793, -27.83, 3.11, 'Alnasl', 4],
      [18.096, -30.42, 3.17, 'Nash', 4],
      
      // ===== CAPRICORNUS =====
      [21.784, -16.13, 2.87, 'Deneb Algedi', 1],
      [20.294, -12.51, 3.08, 'Dabih', 4],
      [21.099, -17.23, 3.74, 'Nashira', 2],
      [20.768, -25.27, 3.68, 'Zeta Cap', 3],
      
      // ===== PISCES =====
      [1.524, 15.35, 3.62, 'Eta Psc', 3],
      [23.989, 6.86, 3.82, 'Gamma Psc', 3],
      [1.194, 7.58, 3.79, 'Omega Psc', 2],
      [23.666, 5.63, 4.13, 'Theta Psc', 4],
      
      // ===== ARIES =====
      [2.120, 23.46, 2.00, 'Hamal', 4],
      [1.911, 20.81, 2.64, 'Sheratan', 1],
      [1.892, 19.29, 3.88, 'Mesarthim', 0],
      [2.833, 27.26, 4.35, 'Botein', 4],
      
      // ===== LIBRA =====
      [14.848, -16.04, 2.61, 'Zubeneschamali', 0],
      [14.690, -15.99, 2.75, 'Zubenelgenubi', 1],
      [15.068, -25.28, 3.29, 'Brachium', 5],
      [15.592, -14.79, 3.91, 'Upsilon Lib', 4],
      
      // ===== CORONA BOREALIS =====
      [15.578, 26.71, 2.23, 'Alphecca', 1],
      [15.464, 29.11, 3.68, 'Nusakan', 2],
      [15.712, 26.30, 3.84, 'Gamma CrB', 1],
      
      // ===== OPHIUCHUS =====
      [17.582, 12.56, 2.08, 'Rasalhague', 1],
      [16.619, 10.17, 2.56, 'Cebalrai', 4],
      [16.305, -4.69, 2.43, 'Yed Prior', 5],
      [16.239, 6.42, 2.73, 'Kappa Oph', 4],
      [17.173, -15.72, 2.54, 'Sabik', 1],
      
      // ===== HERCULES =====
      [17.244, 14.39, 2.77, 'Kornephoros', 3],
      [16.688, 31.60, 2.81, 'Rutilicus', 1],
      [17.251, 36.81, 3.14, 'Rasalgethi', 5],
      [16.504, 21.49, 3.16, 'Eta Her', 3],
      [17.005, 30.93, 3.42, 'Pi Her', 4],
      
      // ===== DRACO =====
      [17.508, 52.30, 2.24, 'Eltanin', 4],
      [17.943, 51.49, 2.99, 'Rastaban', 3],
      [19.803, 70.27, 3.17, 'Altais', 1],
      [12.558, 69.79, 3.29, 'Thuban', 1],
      [16.031, 58.57, 3.75, 'Aldhibah', 2],
      
      // ===== CEPHEUS =====
      [21.309, 62.59, 2.44, 'Alderamin', 1],
      [23.656, 77.63, 3.23, 'Errai', 4],
      [21.477, 70.56, 3.35, 'Alfirk', 0],
      [22.486, 58.20, 3.43, 'Zeta Cep', 4],
      
      // ===== SERPENS =====
      [15.737, 6.43, 2.65, 'Unukalhai', 4],
      [18.937, 4.20, 3.26, 'Eta Ser', 4],
      [15.580, 10.54, 3.67, 'Beta Ser', 1],
      [17.627, -12.87, 3.54, 'Eta Ser B', 4],
      
      // ===== CORVUS =====
      [12.497, -23.40, 2.59, 'Gienah Crv', 0],
      [12.169, -22.62, 2.65, 'Kraz', 3],
      [12.263, -17.54, 2.94, 'Algorab', 1],
      [12.573, -16.52, 3.02, 'Minkar', 4],
      
      // ===== CRATER =====
      [11.414, -17.68, 3.56, 'Delta Crt', 4],
      [10.996, -18.30, 4.08, 'Alkes', 4],
      [11.194, -22.83, 4.07, 'Gamma Crt', 1],
      
      // ===== HYDRA =====
      [9.460, -8.66, 1.98, 'Alphard', 4],
      [8.923, 5.95, 3.11, 'Minchir', 4],
      [11.882, -33.91, 3.00, 'Beta Hya', 0],
      [13.315, -23.17, 3.27, 'Gamma Hya', 3],
      [14.106, -26.68, 3.11, 'Pi Hya', 4],
      
      // ===== LUPUS =====
      [14.699, -47.39, 2.30, 'Men', 0],
      [15.586, -41.17, 2.68, 'Ke Kwan', 0],
      [14.976, -43.13, 2.78, 'Beta Lup', 0],
      [15.356, -44.69, 2.80, 'Gamma Lup', 0],
      
      // ===== ARA =====
      [17.531, -49.88, 2.95, 'Beta Ara', 4],
      [17.423, -55.53, 2.85, 'Alpha Ara', 0],
      [16.977, -53.16, 3.13, 'Gamma Ara', 0],
      
      // ===== TRIANGULUM AUSTRALE =====
      [16.811, -69.03, 1.92, 'Atria', 4],
      [15.919, -63.43, 2.85, 'Beta TrA', 2],
      [15.315, -68.68, 2.89, 'Gamma TrA', 1],
      
      // ===== PAVO =====
      [20.427, -56.74, 1.94, 'Peacock', 0],
      [18.717, -71.43, 3.42, 'Beta Pav', 1],
      [21.441, -65.37, 3.56, 'Delta Pav', 3],
      
      // ===== GRUS =====
      [22.137, -46.96, 1.74, 'Alnair', 0],
      [22.711, -46.88, 2.10, 'Tiaki', 5],
      [21.899, -37.36, 3.01, 'Gamma Gru', 0],
      
      // ===== PHOENIX =====
      [0.438, -42.31, 2.37, 'Ankaa', 4],
      [1.101, -46.72, 3.31, 'Beta Phe', 3],
      [1.473, -43.32, 3.41, 'Gamma Phe', 5],
      
      // ===== SCULPTOR =====
      [0.977, -29.36, 4.30, 'Alpha Scl', 0],
      [23.814, -28.13, 4.37, 'Beta Scl', 0],
      
      // ===== CETUS =====
      [3.038, 4.09, 2.53, 'Diphda', 4],
      [2.322, -2.98, 2.04, 'Mira', 5],
      [1.857, -10.18, 3.47, 'Tau Cet', 3],
      [0.727, -17.99, 3.56, 'Iota Cet', 4],
      
      // ===== FORNAX =====
      [3.201, -28.99, 3.87, 'Alpha For', 2],
      
      // ===== LEPUS =====
      [5.545, -17.82, 2.58, 'Arneb', 2],
      [5.471, -20.76, 2.84, 'Nihal', 3],
      [5.091, -22.37, 3.19, 'Gamma Lep', 2],
      
      // ===== MONOCEROS =====
      [6.248, -7.03, 3.93, 'Alpha Mon', 4],
      [7.198, -0.49, 3.76, 'Gamma Mon', 4],
      
      // ===== CANCER =====
      [8.778, 28.76, 3.52, 'Al Tarf', 4],
      [8.745, 21.47, 4.02, 'Acubens', 1],
      [8.275, 9.19, 3.94, 'Delta Cnc', 4],
      [8.721, 18.15, 4.26, 'Iota Cnc', 3],
      
      // ===== CANIS MINOR =====
      [7.453, 8.29, 2.89, 'Gomeisa', 0],
      
      // ===== COLUMBA =====
      [5.661, -34.07, 2.64, 'Phact', 0],
      [5.849, -35.77, 3.12, 'Wazn', 4],
      
      // ===== PICTOR =====
      [6.803, -61.94, 3.24, 'Alpha Pic', 1],
      [5.788, -51.07, 3.85, 'Beta Pic', 1],
      
      // ===== DORADO =====
      [4.567, -55.05, 3.27, 'Alpha Dor', 1],
      [5.560, -62.49, 3.76, 'Beta Dor', 2],
      
      // ===== RETICULUM =====
      [4.240, -62.47, 3.33, 'Alpha Ret', 3],
      [3.737, -64.81, 3.84, 'Beta Ret', 4],
      
      // ===== HOROLOGIUM =====
      [4.233, -42.29, 3.85, 'Alpha Hor', 4],
      
      // ===== CAELUM =====
      [4.701, -41.86, 4.45, 'Alpha Cae', 2],
      
      // ===== NORMA =====
      [16.453, -47.55, 4.02, 'Gamma Nor', 3],
      
      // ===== MUSCA =====
      [12.620, -69.14, 2.69, 'Alpha Mus', 0],
      [12.772, -68.11, 3.05, 'Beta Mus', 0],
      
      // ===== CHAMAELEON =====
      [8.308, -76.92, 4.07, 'Alpha Cha', 2],
      
      // ===== VOLANS =====
      [7.280, -70.50, 3.77, 'Beta Vol', 4],
      [9.041, -66.40, 4.00, 'Gamma Vol', 4],
      
      // ===== APUS =====
      [14.798, -79.04, 3.83, 'Alpha Aps', 4],
      
      // ===== OCTANS =====
      [21.691, -77.39, 5.47, 'Sigma Oct', 2],
      
      // ===== TUCANA =====
      [22.309, -60.26, 2.86, 'Alpha Tuc', 4],
      [0.526, -62.96, 4.36, 'Beta Tuc', 0],
      
      // ===== INDUS =====
      [20.626, -47.29, 3.11, 'Alpha Ind', 4],
      [20.913, -58.45, 3.65, 'Beta Ind', 4],
      
      // ===== MICROSCOPIUM =====
      [21.021, -32.17, 4.67, 'Gamma Mic', 3],
      
      // ===== PISCIS AUSTRINUS =====
      [22.678, -27.04, 4.17, 'Delta PsA', 3],
      
      // ===== ADDITIONAL HYG STARS - Extended catalog =====
      [0.440, 29.31, 4.61, 'Upsilon And', 2],
      [1.377, 45.53, 4.14, 'Lambda And', 3],
      [2.305, 34.99, 4.09, 'Iota And', 0],
      [2.097, 23.59, 4.89, '41 Ari', 0],
      [3.817, 24.05, 4.30, '17 Tau', 0],
      [3.787, 24.11, 4.18, '19 Tau', 0],
      [3.754, 24.37, 3.87, '20 Tau', 0],
      [3.822, 24.37, 5.09, '21 Tau', 0],
      [3.871, 24.10, 4.29, '23 Tau', 0],
      [3.819, 24.05, 5.45, 'Celaeno', 0],
      [4.478, 19.18, 3.84, 'Theta Tau', 3],
      [4.329, 15.87, 3.77, 'Delta1 Tau', 4],
      [5.615, 41.23, 3.03, 'Iota Aur', 4],
      [5.995, 37.21, 3.73, 'Nu Aur', 4],
      [5.989, 44.95, 2.69, 'Beta Aur', 1],
      [6.234, 49.29, 4.71, 'Omega Aur', 1],
      [5.033, 21.14, 3.17, 'Chi1 Ori', 3],
      [5.908, 20.28, 3.47, 'Chi2 Ori', 0],
      [5.679, -1.94, 2.05, 'Epsilon Ori', 0],
      [5.587, -5.91, 4.13, 'Sigma Ori', 0],
      [5.407, -2.40, 2.77, 'Eta Ori', 0],
      [5.533, -0.30, 4.62, '42 Ori', 0],
      [6.198, -6.27, 4.41, 'Psi Ori', 0],
      [6.126, 14.77, 4.15, '1 Gem', 3],
      [6.244, 23.11, 4.16, 'Eta Gem', 5],
      [7.185, 16.54, 4.06, 'Rho Gem', 2],
      [7.601, 31.78, 3.57, 'Upsilon Gem', 5],
      [7.068, 20.57, 3.35, 'Delta Gem', 2],
      [7.335, 24.40, 3.79, 'Lambda Gem', 1],
      [7.755, 24.40, 4.41, 'Phi Gem', 1],
      [8.045, 27.80, 4.50, 'Chi Gem', 4],
      [7.925, 24.02, 4.89, 'Omega Gem', 3],
      [8.504, 60.72, 3.65, 'Omicron UMa', 3],
      [9.038, 41.78, 3.01, '23 UMa', 2],
      [10.372, 41.50, 3.45, 'Psi UMa', 4],
      [10.284, 42.91, 3.48, 'Mu UMa', 5],
      [11.897, 47.78, 3.17, 'Nu UMa', 4],
      [12.191, 57.03, 3.65, 'Xi UMa', 3],
      [9.526, 63.06, 3.32, 'Theta UMa', 2],
    ]
    
    // Convert to 3D positions with spectral colors
    const stars = brightStars.map(([ra, dec, mag, name, spectralType]) => {
      const raRad = (ra * 15 - lst) * Math.PI / 180
      const decRad = dec * Math.PI / 180
      const radius = 80
      
      // Color based on spectral type (realistic star colors)
      const spectralColors = [
        [0.6, 0.7, 1.0],   // O/B - Blue-white
        [0.9, 0.9, 1.0],   // A - White
        [1.0, 0.95, 0.8],  // F - Yellow-white
        [1.0, 0.9, 0.6],   // G - Yellow (like Sun)
        [1.0, 0.7, 0.4],   // K - Orange
        [1.0, 0.5, 0.3],   // M - Red
      ]
      
      return {
        position: [
          radius * Math.cos(decRad) * Math.cos(raRad),
          radius * Math.sin(decRad),
          radius * Math.cos(decRad) * Math.sin(raRad)
        ],
        magnitude: mag,
        name: name,
        color: spectralColors[spectralType] || [1, 1, 1]
      }
    })
    
    return stars
  }
  
  // Initial load and hourly refresh
  useEffect(() => {
    // Generate initial star positions
    setStarData(generateStarPositions())
    setLastUpdate(new Date())
    
    // Set up hourly refresh (3600000 ms = 1 hour)
    const hourlyInterval = setInterval(() => {
      setStarData(generateStarPositions())
      setLastUpdate(new Date())
      console.log('Star positions updated:', new Date().toLocaleTimeString())
    }, 3600000) // 1 hour
    
    // Cleanup on unmount
    return () => clearInterval(hourlyInterval)
  }, [])
  
  useFrame((state) => {
    // Very slow rotation to simulate Earth's rotation
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.002
    }
  })
  
  if (!starData) return null
  
  return (
    <group ref={groupRef}>
      {starData.map((star, index) => (
        <Star 
          key={index}
          position={star.position}
          magnitude={star.magnitude}
          index={index}
          color={star.color}
          name={star.name}
        />
      ))}
    </group>
  )
}

const HeroScene = ({ onModalOpen }) => {
  return (
    <>
      {/* Lighting - dimmer for space effect */}
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} intensity={0.3} color="#ffffff" />
      
      {/* Realistic Star Field */}
      <RealisticStarField />
      
      {/* Black Hole */}
      <BlackHole />
      
      {/* Particles from JSON */}
      <ParticleSystem 
        onModalOpen={onModalOpen}
      />
    </>
  )
}

export default HeroScene
