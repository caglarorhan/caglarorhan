import { useRef, useMemo, useState, useEffect, memo, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Sphere, Float, Html, Billboard, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import FuturisticModal from '../components/FuturisticModal'

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

const Satellite = ({ onObjectClick }) => {
  const satelliteRef = useRef()
  const { scene } = useGLTF('/satellite.glb')
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const savedPosition = useRef(null)
  const orbitTime = useRef(0)
  
  const clonedScene = useMemo(() => scene.clone(), [scene])
  
  useFrame((state, delta) => {
    if (satelliteRef.current && !isDragging.current) {
      orbitTime.current += delta
      const time = orbitTime.current
      
      const radius = 8
      const speed = 0.15
      const angle = time * speed
      
      satelliteRef.current.position.x = Math.cos(angle) * radius
      satelliteRef.current.position.z = Math.sin(angle) * radius - 5
      satelliteRef.current.position.y = Math.sin(time * 0.3) * 0.5
      satelliteRef.current.rotation.y = -angle + Math.PI / 2
      satelliteRef.current.rotation.z = time * 0.2
    }
  })
  
  const handlePointerDown = (e) => {
    e.stopPropagation()
    if (!e.point || !satelliteRef.current) return
    
    isDragging.current = true
    dragStart.current = { x: e.point.x, y: e.point.y }
    savedPosition.current = satelliteRef.current.position.clone()
    document.body.style.cursor = 'grabbing'
  }
  
  const handlePointerUp = (e) => {
    e.stopPropagation()
    if (!e.point || !dragStart.current) {
      isDragging.current = false
      document.body.style.cursor = 'auto'
      return
    }
    
    const dragDistance = Math.sqrt(
      Math.pow(e.point.x - dragStart.current.x, 2) + 
      Math.pow(e.point.y - dragStart.current.y, 2)
    )
    
    if (dragDistance < 0.5) {
      onObjectClick('satellite')
    }
    
    isDragging.current = false
    document.body.style.cursor = 'auto'
  }
  
  const handlePointerMove = (e) => {
    if (isDragging.current && satelliteRef.current && savedPosition.current && e.point) {
      e.stopPropagation()
      const dx = e.point.x - dragStart.current.x
      const dy = e.point.y - dragStart.current.y
      satelliteRef.current.position.x = savedPosition.current.x + dx
      satelliteRef.current.position.y = savedPosition.current.y + dy
    }
  }
  
  return (
    <group 
      ref={satelliteRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'grab' }}
      onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto' }}
    >
      <primitive object={clonedScene} scale={0.3} />
    </group>
  )
}

const Astronaut = ({ orbitRadius = 5, orbitSpeed = 0.2, orbitOffset = 0, yOffset = 0, onObjectClick }) => {
  const astronautRef = useRef()
  const { scene } = useGLTF('/astronaut.glb')
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const savedPosition = useRef(null)
  const orbitTime = useRef(0)
  
  const clonedScene = useMemo(() => scene.clone(), [scene])
  
  useFrame((state, delta) => {
    if (astronautRef.current && !isDragging.current) {
      orbitTime.current += delta
      const time = orbitTime.current
      
      const angle = time * orbitSpeed + orbitOffset
      
      astronautRef.current.position.x = Math.cos(angle) * orbitRadius
      astronautRef.current.position.z = Math.sin(angle) * orbitRadius + 2
      astronautRef.current.position.y = Math.sin(time * 0.4 + orbitOffset) * 0.8 + yOffset
      
      astronautRef.current.rotation.y = time * 0.3 + orbitOffset
      astronautRef.current.rotation.x = time * 0.15 + orbitOffset
      astronautRef.current.rotation.z = time * 0.2 + orbitOffset
    }
  })
  
  const handlePointerDown = (e) => {
    e.stopPropagation()
    if (!e.point || !astronautRef.current) return
    
    isDragging.current = true
    dragStart.current = { x: e.point.x, y: e.point.y }
    savedPosition.current = astronautRef.current.position.clone()
    document.body.style.cursor = 'grabbing'
  }
  
  const handlePointerUp = (e) => {
    e.stopPropagation()
    if (!e.point || !dragStart.current) {
      isDragging.current = false
      document.body.style.cursor = 'auto'
      return
    }
    
    const dragDistance = Math.sqrt(
      Math.pow(e.point.x - dragStart.current.x, 2) + 
      Math.pow(e.point.y - dragStart.current.y, 2)
    )
    
    if (dragDistance < 0.5) {
      onObjectClick('astronaut')
    }
    
    isDragging.current = false
    document.body.style.cursor = 'auto'
  }
  
  const handlePointerMove = (e) => {
    if (isDragging.current && astronautRef.current && savedPosition.current && e.point) {
      e.stopPropagation()
      const dx = e.point.x - dragStart.current.x
      const dy = e.point.y - dragStart.current.y
      astronautRef.current.position.x = savedPosition.current.x + dx
      astronautRef.current.position.y = savedPosition.current.y + dy
    }
  }
  
  return (
    <group 
      ref={astronautRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'grab' }}
      onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto' }}
    >
      <primitive object={clonedScene} scale={0.006} />
      <pointLight position={[0, 0.03, 0]} color="#ffffff" intensity={0.3} distance={2} />
    </group>
  )
}

const ApolloSoyuz = ({ onObjectClick }) => {
  const spacecraftRef = useRef()
  const flamesRef = useRef()
  const { scene } = useGLTF('/apollo-soyuz.glb')
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const savedPosition = useRef(null)
  const orbitTime = useRef(0)
  
  const clonedScene = useMemo(() => scene.clone(), [scene])
  
  // Flame particles for engine
  const flameCount = 40
  const flames = useMemo(() => {
    const positions = new Float32Array(flameCount * 3)
    const velocities = []
    const lifetimes = []
    const sizes = new Float32Array(flameCount)
    
    for (let i = 0; i < flameCount; i++) {
      positions[i * 3] = -0.3 - Math.random() * 0.2
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.15
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.08
      velocities.push(-1.5 - Math.random() * 1.0)
      lifetimes.push(Math.random())
      sizes[i] = 0.03 + Math.random() * 0.04
    }
    
    return { positions, velocities, lifetimes, sizes }
  }, [])
  
  const engineActive = useRef(true)
  const engineTimer = useRef(0)
  
  useFrame((state, delta) => {
    if (spacecraftRef.current && !isDragging.current) {
      orbitTime.current += delta
      const time = orbitTime.current
      
      // Move from left to right slowly
      const speed = 0.03
      const startX = -18
      const endX = 18
      const totalDistance = endX - startX
      
      // Calculate current position in the cycle
      const cycleProgress = (time * speed) % 1
      spacecraftRef.current.position.x = startX + (totalDistance * cycleProgress)
      spacecraftRef.current.position.y = Math.sin(time * 0.3) * 0.6 + 1
      spacecraftRef.current.position.z = 2
      
      // Face right
      spacecraftRef.current.rotation.y = Math.PI / 2
      spacecraftRef.current.rotation.z = Math.sin(time * 0.2) * 0.05
      
      // Engine pulse effect - stronger when active
      if (engineActive.current) {
        spacecraftRef.current.position.x += Math.sin(time * 12) * 0.015
      }
    }
    
    // Engine pulse intervals - fire for 0.4s, pause for 0.8s
    engineTimer.current += delta
    if (engineActive.current && engineTimer.current > 0.4) {
      engineActive.current = false
      engineTimer.current = 0
    } else if (!engineActive.current && engineTimer.current > 0.8) {
      engineActive.current = true
      engineTimer.current = 0
    }
    
    // Animate flames only when engine active
    if (flamesRef.current) {
      const positions = flamesRef.current.geometry.attributes.position.array
      const sizes = flamesRef.current.geometry.attributes.size.array
      
      for (let i = 0; i < flameCount; i++) {
        if (engineActive.current) {
          flames.lifetimes[i] -= delta * 3
          positions[i * 3] += flames.velocities[i] * delta
          
          // Smooth size variation
          sizes[i] = flames.sizes[i] * (0.7 + Math.sin(state.clock.elapsedTime * 10 + i) * 0.3)
          
          if (flames.lifetimes[i] <= 0 || positions[i * 3] < -1.0) {
            positions[i * 3] = -0.3 - Math.random() * 0.1
            positions[i * 3 + 1] = (Math.random() - 0.5) * 0.12
            positions[i * 3 + 2] = (Math.random() - 0.5) * 0.06
            flames.lifetimes[i] = 0.2 + Math.random() * 0.2
          }
        } else {
          // Fade out flames during pause
          flames.lifetimes[i] -= delta * 5
          positions[i * 3] += flames.velocities[i] * delta * 0.3
          sizes[i] *= 0.95
          
          if (flames.lifetimes[i] <= 0) {
            positions[i * 3] = -10 // Hide particles
          }
        }
      }
      
      flamesRef.current.geometry.attributes.position.needsUpdate = true
      flamesRef.current.geometry.attributes.size.needsUpdate = true
    }
  })
  
  const handlePointerDown = (e) => {
    e.stopPropagation()
    if (!e.point || !spacecraftRef.current) return
    
    isDragging.current = true
    dragStart.current = { x: e.point.x, y: e.point.y }
    savedPosition.current = spacecraftRef.current.position.clone()
    document.body.style.cursor = 'grabbing'
  }
  
  const handlePointerUp = (e) => {
    e.stopPropagation()
    if (!e.point || !dragStart.current) {
      isDragging.current = false
      document.body.style.cursor = 'auto'
      return
    }
    
    const dragDistance = Math.sqrt(
      Math.pow(e.point.x - dragStart.current.x, 2) + 
      Math.pow(e.point.y - dragStart.current.y, 2)
    )
    
    if (dragDistance < 0.5) {
      onObjectClick('apollo-soyuz')
    }
    
    isDragging.current = false
    document.body.style.cursor = 'auto'
  }
  
  const handlePointerMove = (e) => {
    if (isDragging.current && spacecraftRef.current && savedPosition.current && e.point) {
      e.stopPropagation()
      const dx = e.point.x - dragStart.current.x
      const dy = e.point.y - dragStart.current.y
      spacecraftRef.current.position.x = savedPosition.current.x + dx
      spacecraftRef.current.position.y = savedPosition.current.y + dy
    }
  }
  
  return (
    <group 
      ref={spacecraftRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'grab' }}
      onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto' }}
    >
      <primitive object={clonedScene} scale={0.075} />
      
      {/* Engine flame particles */}
      <points ref={flamesRef} position={[-0.35, 0, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={flameCount}
            array={flames.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={flameCount}
            array={flames.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#ff6600"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          sizeAttenuation={true}
          depthWrite={false}
          vertexColors={false}
        />
      </points>
    </group>
  )
}

const WindowLEDLights = () => {
  const { camera, size } = useThree()
  const leftLightsRef = useRef()
  const rightLightsRef = useRef()
  const [ledsOn, setLedsOn] = useState(true)
  
  const toggleLeds = useCallback(() => {
    setLedsOn(prev => !prev)
  }, [])
  
  useFrame(() => {
    if (leftLightsRef.current && rightLightsRef.current) {
      // Position lights at screen edges, always facing camera
      const leftPos = new THREE.Vector3(-0.95, 0, 0)
      leftPos.unproject(camera)
      const leftDir = leftPos.sub(camera.position).normalize()
      leftLightsRef.current.position.copy(camera.position).add(leftDir.multiplyScalar(3))
      
      const rightPos = new THREE.Vector3(0.95, 0, 0)
      rightPos.unproject(camera)
      const rightDir = rightPos.sub(camera.position).normalize()
      rightLightsRef.current.position.copy(camera.position).add(rightDir.multiplyScalar(3))
    }
  })
  
  // Create vertical LED strip
  const ledCount = 12
  const leds = useMemo(() => {
    const positions = []
    for (let i = 0; i < ledCount; i++) {
      const y = (i / (ledCount - 1)) * 10 - 5 // Spread vertically
      positions.push(y)
    }
    return positions
  }, [])
  
  return (
    <>
      {/* Left edge LED strip */}
      <group ref={leftLightsRef}>
        {leds.map((y, i) => (
          <group key={`left-${i}`} position={[0, y, 0]}>
            {/* LED light */}
            <mesh onClick={toggleLeds} onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer' }} onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto' }}>
              <cylinderGeometry args={[0.03, 0.03, 0.15, 8]} />
              <meshStandardMaterial 
                color={ledsOn ? "#00ddff" : "#003344"}
                emissive={ledsOn ? "#00ffff" : "#000000"}
                emissiveIntensity={ledsOn ? 2.5 : 0}
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
            {ledsOn && <pointLight color="#00ddff" intensity={3.0} distance={8} decay={1.5} />}
          </group>
        ))}
      </group>
      
      {/* Right edge LED strip */}
      <group ref={rightLightsRef}>
        {leds.map((y, i) => (
          <group key={`right-${i}`} position={[0, y, 0]}>
            {/* LED light */}
            <mesh onClick={toggleLeds} onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer' }} onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto' }}>
              <cylinderGeometry args={[0.03, 0.03, 0.15, 8]} />
              <meshStandardMaterial 
                color={ledsOn ? "#00ddff" : "#003344"}
                emissive={ledsOn ? "#00ffff" : "#000000"}
                emissiveIntensity={ledsOn ? 2.5 : 0}
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
            {ledsOn && <pointLight color="#00ddff" intensity={3.0} distance={8} decay={1.5} />}
          </group>
        ))}
      </group>
    </>
  )
}

// Default color for cubes without a color field
const DEFAULT_CUBE_COLOR = '#00f5ff'

// Individual orbiting particle from JSON
const OrbitingParticle = memo(({ data, index, onModalOpen, isHighlighted = false, onExplode, shouldExplode = false, onPositionUpdate, onMeshRef, turretActive = false }) => {
  const meshRef = useRef()
  const edgesRef = useRef()
  
  // Register mesh ref with parent for raycasting
  useEffect(() => {
    if (meshRef.current && onMeshRef) {
      onMeshRef(data.id, meshRef.current, data)
      return () => onMeshRef(data.id, null, null) // Cleanup
    }
  }, [data.id, onMeshRef, data])
  const [hovered, setHovered] = useState(false)
  const [isExploding, setIsExploding] = useState(false)
  const [isVibrating, setIsVibrating] = useState(false)
  const [isCoolingDown, setIsCoolingDown] = useState(false)
  const [isDestroyed, setIsDestroyed] = useState(false)
  const vibrationStartRef = useRef(0)
  const cooldownStartRef = useRef(0)
  const vibrationIntensityRef = useRef(0) // Track current intensity for smooth cooldown
  const pausedTimeRef = useRef(0)
  const lastTimeRef = useRef(0)
  
  // Random initial angle for each particle
  const initialAngle = useMemo(() => Math.random() * Math.PI * 2, [])
  const orbitSpeed = useMemo(() => 0.1 + Math.random() * 0.15, [])
  const verticalOffset = useMemo(() => (Math.random() - 0.5) * 2, [])
  const orbitTilt = useMemo(() => (Math.random() - 0.5) * 0.5, [])
  
  const isInteractive = data.type !== null
  
  // Get color from JSON data, fallback to default
  const particleColor = data.color || DEFAULT_CUBE_COLOR
  
  // Store base orbit position for vibration offset
  const basePositionRef = useRef([0, 0, 0])
  const frozenPositionRef = useRef(null) // Frozen position when vibrating
  
  useFrame((state) => {
    const realTime = state.clock.getElapsedTime()
    
    // If destroyed, don't update
    if (isDestroyed) return
    
    // Pause orbit when hovered OR vibrating
    let effectiveTime
    if ((hovered && !isVibrating) || isVibrating || isCoolingDown) {
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
    
    // Calculate base orbital position
    let baseX = Math.cos(angle) * data.distance
    let baseZ = Math.sin(angle) * data.distance
    let baseY = verticalOffset + Math.sin(effectiveTime * 0.5 + index) * 0.3 + baseZ * orbitTilt
    
    // When vibrating, use frozen position
    if (isVibrating || isCoolingDown) {
      if (frozenPositionRef.current) {
        [baseX, baseY, baseZ] = frozenPositionRef.current
      }
    } else {
      // Clear frozen position when not vibrating
      frozenPositionRef.current = null
    }
    
    // Store base position for explosion
    basePositionRef.current = [baseX, baseY, baseZ]
    
    // Report position to parent for collision detection (include particle data)
    if (onPositionUpdate && !isDestroyed) {
      onPositionUpdate(data.id, [baseX, baseY, baseZ], data)
    }
    
    // External explosion trigger (from bullet hit)
    if (shouldExplode && !isExploding && !isDestroyed) {
      setIsExploding(true)
      if (onExplode) {
        onExplode({
          position: [baseX, baseY, baseZ],
          color: particleColor,
          id: data.id
        })
      }
      setTimeout(() => {
        setIsDestroyed(true)
        setTimeout(() => {
          setIsDestroyed(false)
          setIsExploding(false)
        }, 3000)
      }, 100)
    }
    
    // Final position (with vibration offset if vibrating)
    let x = baseX
    let y = baseY
    let z = baseZ
    
    // Whole cube vibration effect - starts slow, gets intense
    if (isVibrating && !isInteractive) {
      // Capture start time on first frame of vibration
      if (vibrationStartRef.current < 0) {
        vibrationStartRef.current = realTime
      }
      
      const vibrationTime = realTime - vibrationStartRef.current
      const maxVibrationTime = 3.5 // 3.5 seconds to reach max and explode
      
      // Frequency starts at 5Hz and gradually increases to 80Hz over 3.5 seconds
      const frequencyProgress = Math.min(vibrationTime / maxVibrationTime, 1)
      const frequency = 5 + frequencyProgress * frequencyProgress * 75
      
      // Amplitude starts very small and grows slowly
      const amplitudeProgress = Math.min(vibrationTime / maxVibrationTime, 1)
      const amplitude = 0.005 + amplitudeProgress * 0.025 // Much smaller amplitude
      
      // Store current intensity for smooth cooldown
      vibrationIntensityRef.current = amplitudeProgress
      
      // The whole cube shakes in place - small vibration centered on base position
      const shakeX = Math.sin(realTime * frequency) * amplitude
      const shakeY = Math.sin(realTime * frequency * 1.3 + 1) * amplitude
      const shakeZ = Math.sin(realTime * frequency * 0.9 + 2) * amplitude
      
      x += shakeX
      y += shakeY
      z += shakeZ
      
      // After 3.5 seconds of intense vibration, explode!
      if (vibrationTime > maxVibrationTime) {
        setIsVibrating(false)
        setIsExploding(true)
        vibrationIntensityRef.current = 0
        // Notify parent to create explosion particles at this position
        if (onExplode) {
          onExplode({
            position: [baseX, baseY, baseZ],
            color: particleColor,
            id: data.id
          })
        }
        // Hide cube after short delay
        setTimeout(() => {
          setIsDestroyed(true)
          // Respawn after 3 seconds
          setTimeout(() => {
            setIsDestroyed(false)
            setIsExploding(false)
          }, 3000)
        }, 100)
      }
    }
    
    // Cooldown effect - vibration decreases smoothly when mouse released
    if (isCoolingDown && !isInteractive) {
      // Capture cooldown start time on first frame
      if (cooldownStartRef.current < 0) {
        cooldownStartRef.current = realTime
      }
      
      const cooldownTime = realTime - cooldownStartRef.current
      const cooldownDuration = 0.5 // Half second to calm down
      
      // Decrease intensity from where it was
      const startIntensity = vibrationIntensityRef.current
      const cooldownProgress = Math.min(cooldownTime / cooldownDuration, 1)
      const currentIntensity = startIntensity * (1 - cooldownProgress)
      
      if (currentIntensity > 0.01) {
        // Still cooling down - apply diminishing vibration (matching new smaller amplitude)
        const frequency = 5 + currentIntensity * 75
        const amplitude = 0.005 + currentIntensity * 0.025
        
        const shakeX = Math.sin(realTime * frequency) * amplitude
        const shakeY = Math.sin(realTime * frequency * 1.3 + 1) * amplitude
        const shakeZ = Math.sin(realTime * frequency * 0.9 + 2) * amplitude
        
        x += shakeX
        y += shakeY
        z += shakeZ
      } else {
        // Cooldown complete
        setIsCoolingDown(false)
        vibrationIntensityRef.current = 0
      }
    }
    
    if (meshRef.current) {
      // Orbital motion
      meshRef.current.position.set(x, y, z)
      
      // Rotate the cube itself (slower when hovered, faster when vibrating/cooling)
      const rotSpeed = (isVibrating || isCoolingDown) ? (2 * (vibrationIntensityRef.current + 0.5)) : (hovered ? 0.1 : 1)
      meshRef.current.rotation.x = effectiveTime * 0.5 * rotSpeed
      meshRef.current.rotation.y = effectiveTime * 0.3 * rotSpeed
      meshRef.current.rotation.z = effectiveTime * 0.2 * rotSpeed
      
      // Scale effect
      if (isInteractive) {
        const pulse = 1 + Math.sin(realTime * 3) * 0.1
        meshRef.current.scale.setScalar(hovered ? 1.5 : pulse)
      } else if (isVibrating) {
        // Grow slightly while vibrating (slower growth over 3.5 seconds)
        const vibrationTime = realTime - vibrationStartRef.current
        const growFactor = 1 + (vibrationTime / 3.5) * 0.3
        meshRef.current.scale.setScalar(growFactor)
      } else if (isCoolingDown) {
        // Shrink back during cooldown
        const growFactor = 1 + vibrationIntensityRef.current * 0.3
        meshRef.current.scale.setScalar(growFactor)
      } else {
        meshRef.current.scale.setScalar(1)
      }
    }
    
    if (edgesRef.current) {
      // Match edges to mesh
      edgesRef.current.position.set(x, y, z)
      const rotSpeed = (isVibrating || isCoolingDown) ? (2 * (vibrationIntensityRef.current + 0.5)) : (hovered ? 0.1 : 1)
      edgesRef.current.rotation.x = effectiveTime * 0.5 * rotSpeed
      edgesRef.current.rotation.y = effectiveTime * 0.3 * rotSpeed
      edgesRef.current.rotation.z = effectiveTime * 0.2 * rotSpeed
      
      if (isInteractive) {
        const pulse = 1 + Math.sin(realTime * 3) * 0.1
        edgesRef.current.scale.setScalar(hovered ? 1.5 : pulse)
      } else if (isVibrating) {
        const vibrationTime = realTime - vibrationStartRef.current
        const growFactor = 1 + (vibrationTime / 3.5) * 0.3
        edgesRef.current.scale.setScalar(growFactor)
      } else if (isCoolingDown) {
        const growFactor = 1 + vibrationIntensityRef.current * 0.3
        edgesRef.current.scale.setScalar(growFactor)
      } else {
        edgesRef.current.scale.setScalar(1)
      }
    }
  })
  
  const handlePointerDown = (e) => {
    e.stopPropagation()
    
    // Disable interaction when turret is active
    if (turretActive) return
    
    // For null cubes - trigger vibration and explosion on mousedown
    if (!isInteractive && !isVibrating && !isCoolingDown && !isExploding && !isDestroyed) {
      // Freeze current position
      frozenPositionRef.current = [...basePositionRef.current]
      setIsVibrating(true)
      setIsCoolingDown(false)
      vibrationStartRef.current = -1 // Will be set on first frame
      document.body.style.cursor = 'auto'
      return
    }
  }
  
  const handlePointerUp = (e) => {
    e.stopPropagation()
    
    // If vibrating but not exploding, start cooldown
    if (isVibrating && !isExploding) {
      setIsVibrating(false)
      setIsCoolingDown(true)
      cooldownStartRef.current = -1 // Will be set on first frame
    }
  }
  
  const handleClick = (e) => {
    e.stopPropagation()
    
    // Disable interaction when turret is active
    if (turretActive) return
    
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
    
    // Disable hover when turret is active
    if (turretActive) return
    
    if (isInteractive || (!isInteractive && !isVibrating && !isCoolingDown && !isDestroyed)) {
      setHovered(true)
      document.body.style.cursor = 'pointer'
    }
  }
  
  const handlePointerOut = () => {
    setHovered(false)
    document.body.style.cursor = 'auto'
    
    // If mouse leaves while vibrating, trigger cooldown
    if (isVibrating && !isExploding) {
      setIsVibrating(false)
      setIsCoolingDown(true)
      cooldownStartRef.current = -1
    }
  }
  
  // Highlight effect: slightly brighter edge when highlighted by search
  // Vibrating/cooling cubes glow intensely
  const isGlowing = isVibrating || isCoolingDown
  const vibratingColor = isGlowing ? '#ffffff' : particleColor
  const edgeColor = hovered ? '#ffffff' : (isHighlighted ? '#ffffff' : vibratingColor)
  const edgeOpacity = isGlowing ? 1.0 : (isHighlighted ? 1.0 : (isInteractive ? 0.8 : 0.6))
  const faceOpacity = isGlowing ? 0.8 : (isHighlighted ? 0.5 : (isInteractive ? 0.3 : 0.1))
  const particleSize = isInteractive ? 0.2 : 0.1
  
  // Create edges geometry
  const edgesGeometry = useMemo(() => {
    const boxGeo = new THREE.BoxGeometry(particleSize, particleSize, particleSize)
    return new THREE.EdgesGeometry(boxGeo)
  }, [particleSize])
  
  // Don't render if destroyed
  if (isDestroyed) return null
  
  return (
    <group>
      {/* Solid cube face (slightly transparent) */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[particleSize, particleSize, particleSize]} />
        <meshStandardMaterial 
          color={isGlowing ? '#ffffff' : (isHighlighted ? '#ffffff' : particleColor)}
          transparent
          opacity={faceOpacity}
          emissive={isGlowing ? '#ffffff' : (isHighlighted ? particleColor : '#000000')}
          emissiveIntensity={isGlowing ? 0.5 : (isHighlighted ? 0.3 : 0)}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      
      {/* Edge lines for 3D effect */}
      <lineSegments ref={edgesRef} geometry={edgesGeometry}>
        <lineBasicMaterial 
          color={edgeColor}
          transparent
          opacity={edgeOpacity}
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
  // Re-render if data, index, isHighlighted, shouldExplode, onMeshRef, or turretActive changes
  return prevProps.data.id === nextProps.data.id && 
         prevProps.index === nextProps.index &&
         prevProps.isHighlighted === nextProps.isHighlighted &&
         prevProps.shouldExplode === nextProps.shouldExplode &&
         prevProps.onMeshRef === nextProps.onMeshRef &&
         prevProps.turretActive === nextProps.turretActive
})

// Explosion particle - flies outward and fades
const ExplosionParticle = ({ startPosition, color, velocity, delay }) => {
  const meshRef = useRef()
  const startTime = useRef(null)
  const [visible, setVisible] = useState(false)
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    if (startTime.current === null) {
      startTime.current = time + delay
    }
    
    if (time < startTime.current) return
    
    if (!visible) setVisible(true)
    
    const elapsed = time - startTime.current
    const lifetime = 1.5 // seconds
    
    if (elapsed > lifetime) {
      if (meshRef.current) meshRef.current.visible = false
      return
    }
    
    if (meshRef.current) {
      // Move outward with velocity, add gravity
      const gravity = -2
      meshRef.current.position.set(
        startPosition[0] + velocity[0] * elapsed,
        startPosition[1] + velocity[1] * elapsed + 0.5 * gravity * elapsed * elapsed,
        startPosition[2] + velocity[2] * elapsed
      )
      
      // Fade out
      meshRef.current.material.opacity = 1 - (elapsed / lifetime)
      
      // Shrink
      const scale = 0.05 * (1 - elapsed / lifetime * 0.5)
      meshRef.current.scale.setScalar(scale)
      
      // Spin
      meshRef.current.rotation.x = elapsed * 10
      meshRef.current.rotation.y = elapsed * 8
    }
  })
  
  if (!visible) return null
  
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={color} transparent opacity={1} />
    </mesh>
  )
}

// Fine explosion particle - smaller and faster fading
const FineExplosionParticle = ({ startPosition, color, velocity, delay, size = 0.03 }) => {
  const meshRef = useRef()
  const startTime = useRef(null)
  const [visible, setVisible] = useState(false)
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    if (startTime.current === null) {
      startTime.current = time + delay
    }
    
    if (time < startTime.current) return
    
    if (!visible) setVisible(true)
    
    const elapsed = time - startTime.current
    const lifetime = 1.2 // Shorter lifetime for finer particles
    
    if (elapsed > lifetime) {
      if (meshRef.current) meshRef.current.visible = false
      return
    }
    
    if (meshRef.current) {
      // Move outward with velocity, add slight gravity
      const gravity = -1.5
      meshRef.current.position.set(
        startPosition[0] + velocity[0] * elapsed,
        startPosition[1] + velocity[1] * elapsed + 0.5 * gravity * elapsed * elapsed,
        startPosition[2] + velocity[2] * elapsed
      )
      
      // Fade out faster
      meshRef.current.material.opacity = 1 - (elapsed / lifetime)
      
      // Shrink more aggressively
      const scale = size * (1 - elapsed / lifetime * 0.8)
      meshRef.current.scale.setScalar(scale)
    }
  })
  
  if (!visible) return null
  
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color={color} transparent opacity={1} />
    </mesh>
  )
}

// Explosion effect - spawns many fine particles for spectacular effect
const ExplosionEffect = ({ position, color, id }) => {
  const particleCount = 60 // More particles for finer effect
  
  // Generate random velocities for each particle with varied sizes
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      // Varied speeds - some fast, some slow for depth
      const speed = 0.5 + Math.random() * 3
      // Varied sizes - mostly small with a few larger
      const size = 0.015 + Math.random() * 0.04
      return {
        velocity: [
          Math.sin(phi) * Math.cos(theta) * speed,
          Math.cos(phi) * speed * 0.8 + 0.5, // Slight upward bias
          Math.sin(phi) * Math.sin(theta) * speed
        ],
        delay: Math.random() * 0.15, // Slightly more stagger
        size
      }
    })
  }, [])
  
  return (
    <group>
      {particles.map((p, i) => (
        <FineExplosionParticle
          key={`${id}-${i}`}
          startPosition={position}
          color={color}
          velocity={p.velocity}
          delay={p.delay}
          size={p.size}
        />
      ))}
    </group>
  )
}

// Particle system loaded from config (local or remote)
const ParticleSystem = memo(({ onModalOpen, highlightedIds = [], cubePositionsRef, cubeMeshesRef, cubesToExplode = [], turretActive = false }) => {
  const [particles, setParticles] = useState([])
  const [explosions, setExplosions] = useState([])
  const [loading, setLoading] = useState(true)
  const [explodingCubes, setExplodingCubes] = useState(new Set())
  const groupRef = useRef()
  const groupRotationRef = useRef(0) // Track group rotation for world position
  
  // Store mesh refs for raycasting
  const handleMeshRef = useCallback((id, mesh, data) => {
    if (cubeMeshesRef?.current) {
      if (mesh) {
        cubeMeshesRef.current[id] = { mesh, data }
      } else {
        delete cubeMeshesRef.current[id]
      }
    }
  }, [cubeMeshesRef])
  
  // Track which cubes should explode based on cubesToExplode prop
  useEffect(() => {
    if (cubesToExplode.length > 0) {
      setExplodingCubes(prev => {
        const newSet = new Set(prev)
        cubesToExplode.forEach(id => {
          const numericId = typeof id === 'string' ? parseInt(id) : id
          newSet.add(numericId)
        })
        return newSet
      })
      // Clear exploding status after animation completes
      cubesToExplode.forEach(id => {
        const numericId = typeof id === 'string' ? parseInt(id) : id
        setTimeout(() => {
          setExplodingCubes(prev => {
            const newSet = new Set(prev)
            newSet.delete(numericId)
            return newSet
          })
        }, 3100)
      })
    }
  }, [cubesToExplode])
  
  // Handle explosion from cube
  const handleExplosion = useCallback((explosionData) => {
    const explosionId = `${explosionData.id}-${Date.now()}`
    setExplosions(prev => [...prev, { ...explosionData, explosionId }])
    
    // Remove explosion after animation completes
    setTimeout(() => {
      setExplosions(prev => prev.filter(e => e.explosionId !== explosionId))
    }, 2000)
  }, [])
  
  // Track cube positions for collision detection - include particle data
  // Convert local position to world position by applying group rotation
  const handlePositionUpdate = useCallback((id, position, particleData) => {
    if (cubePositionsRef?.current) {
      // Apply Y-axis rotation to convert local to world position
      const rotY = groupRotationRef.current
      const cosR = Math.cos(rotY)
      const sinR = Math.sin(rotY)
      const worldX = position[0] * cosR + position[2] * sinR
      const worldY = position[1]
      const worldZ = -position[0] * sinR + position[2] * cosR
      cubePositionsRef.current[id] = { position: [worldX, worldY, worldZ], data: particleData }
    }
  }, [cubePositionsRef])
  
  useEffect(() => {
    // Dynamic import to allow config changes without rebuilding
    import('../config/particles.config.js')
      .then(module => module.fetchParticles())
      .then(data => {
        setParticles(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load particles:', err)
        // Fallback particles
        setParticles([
          { id: 1, name: null, type: null, color: '#00f5ff', src: null, distance: 4 },
          { id: 2, name: null, type: null, color: '#00f5ff', src: null, distance: 5 },
          { id: 3, name: null, type: null, color: '#00f5ff', src: null, distance: 3.5 }
        ])
        setLoading(false)
      })
  }, [])
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (groupRef.current) {
      // Slow overall rotation
      groupRef.current.rotation.y = time * 0.02
      // Store rotation for collision detection
      groupRotationRef.current = time * 0.02
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
          isHighlighted={highlightedIds.includes(particle.id)}
          onExplode={handleExplosion}
          onPositionUpdate={handlePositionUpdate}
          onMeshRef={handleMeshRef}
          shouldExplode={explodingCubes.has(particle.id)}
          turretActive={turretActive}
        />
      ))}
      {/* Render explosions */}
      {explosions.map(exp => (
        <ExplosionEffect
          key={exp.explosionId}
          position={exp.position}
          color={exp.color}
          id={exp.explosionId}
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

// Bullet component - flies toward target with perspective trail
const Bullet = ({ startPosition, direction, speed, onHit, cubePositionsRef, id }) => {
  const meshRef = useRef()
  const trailRef = useRef()
  const startTime = useRef(null)
  const [active, setActive] = useState(true)
  
  // Trail positions for perspective effect
  const trailPositions = useRef([])
  
  useFrame((state) => {
    if (!active) return
    
    const time = state.clock.getElapsedTime()
    if (startTime.current === null) {
      startTime.current = time
    }
    
    const elapsed = time - startTime.current
    const maxLifetime = 3 // seconds
    
    if (elapsed > maxLifetime) {
      setActive(false)
      return
    }
    
    // Calculate current position
    const distance = elapsed * speed
    const x = startPosition[0] + direction[0] * distance
    const y = startPosition[1] + direction[1] * distance
    const z = startPosition[2] + direction[2] * distance
    
    if (meshRef.current) {
      meshRef.current.position.set(x, y, z)
      
      // Store trail positions
      trailPositions.current.push([x, y, z])
      if (trailPositions.current.length > 10) {
        trailPositions.current.shift()
      }
    }
    
    // Check collision with cubes
    if (cubePositionsRef?.current) {
      for (const [cubeId, cubePos] of Object.entries(cubePositionsRef.current)) {
        const dx = x - cubePos[0]
        const dy = y - cubePos[1]
        const dz = z - cubePos[2]
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
        
        // Collision radius
        if (dist < 0.2) {
          setActive(false)
          if (onHit) onHit(parseInt(cubeId))
          return
        }
      }
    }
  })
  
  if (!active) return null
  
  return (
    <group>
      {/* Bullet head */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#ff4444" />
      </mesh>
      {/* Trail effect - rendered as small spheres with decreasing size */}
      {trailPositions.current.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.02 * (i / 10), 4, 4]} />
          <meshBasicMaterial 
            color="#ff6666" 
            transparent 
            opacity={i / 10} 
          />
        </mesh>
      ))}
    </group>
  )
}

// Turret Orb - transforms into turret on hover, fires bullets on mousedown
const TurretOrb = ({ cubePositionsRef, onCubeHit }) => {
  const groupRef = useRef()
  const [isHovered, setIsHovered] = useState(false)
  const [isFiring, setIsFiring] = useState(false)
  const [bullets, setBullets] = useState([])
  const [aimDirection, setAimDirection] = useState([0, 1, 0])
  const lastFireTime = useRef(0)
  const turretPosition = useMemo(() => [0, -3, 0], []) // Bottom center, at same Z as black hole
  
  // Handle mouse move for aiming
  useFrame((state) => {
    if (isHovered || isFiring) {
      // Get mouse position in normalized device coordinates
      const mouse = state.mouse
      
      // Calculate aim direction from turret toward mouse position in 3D space
      const aimX = mouse.x * 3
      const aimY = mouse.y * 2 + 1
      const aimZ = -2
      
      // Normalize direction
      const length = Math.sqrt(aimX * aimX + aimY * aimY + aimZ * aimZ)
      setAimDirection([aimX / length, aimY / length, aimZ / length])
      
      // Fire bullets while mouse is down
      if (isFiring) {
        const time = state.clock.getElapsedTime()
        if (time - lastFireTime.current > 0.15) { // Fire rate: ~6.6 bullets/second
          lastFireTime.current = time
          
          const bulletId = `bullet-${Date.now()}-${Math.random()}`
          setBullets(prev => [...prev, {
            id: bulletId,
            startPosition: [...turretPosition],
            direction: [...aimDirection],
            speed: 8
          }])
          
          // Remove bullet after lifetime
          setTimeout(() => {
            setBullets(prev => prev.filter(b => b.id !== bulletId))
          }, 3000)
        }
      }
    }
    
    // Animate turret rotation
    if (groupRef.current && (isHovered || isFiring)) {
      // Point turret toward aim direction
      const targetRotationY = Math.atan2(aimDirection[0], -aimDirection[2])
      const targetRotationX = Math.asin(-aimDirection[1])
      
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotationY,
        0.1
      )
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotationX * 0.5,
        0.1
      )
    }
  })
  
  const handleBulletHit = useCallback((cubeId) => {
    if (onCubeHit) onCubeHit(cubeId)
  }, [onCubeHit])
  
  const handlePointerOver = () => {
    setIsHovered(true)
    document.body.style.cursor = 'crosshair'
  }
  
  const handlePointerOut = () => {
    if (!isFiring) {
      setIsHovered(false)
      document.body.style.cursor = 'auto'
    }
  }
  
  const handlePointerDown = (e) => {
    e.stopPropagation()
    setIsFiring(true)
  }
  
  const handlePointerUp = () => {
    setIsFiring(false)
    if (!isHovered) {
      document.body.style.cursor = 'auto'
    }
  }
  
  // Also handle global pointer up
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      setIsFiring(false)
    }
    window.addEventListener('pointerup', handleGlobalPointerUp)
    return () => window.removeEventListener('pointerup', handleGlobalPointerUp)
  }, [])
  
  // Scale based on hover state (1x normal, 10x when hovered)
  const scale = isHovered || isFiring ? 1.5 : 0.5 // Visible size
  
  return (
    <group position={turretPosition}>
      {/* Orb / Turret */}
      <group 
        ref={groupRef}
        scale={[scale, scale, scale]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        {/* Base orb - simple full sphere for visibility */}
        <mesh>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshBasicMaterial color="#00f5ff" transparent opacity={0.8} />
        </mesh>
        
        {/* Inner glow */}
        <mesh>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
        </mesh>
        
        {/* Turret barrel - visible when hovered */}
        {(isHovered || isFiring) && (
          <group>
            {/* Turret body */}
            <mesh position={[0, 0.3, 0]}>
              <cylinderGeometry args={[0.15, 0.25, 0.3, 12]} />
              <meshBasicMaterial color="#333333" />
            </mesh>
            {/* Barrel */}
            <mesh position={[0, 0.6, 0]}>
              <cylinderGeometry args={[0.06, 0.06, 0.5, 8]} />
              <meshBasicMaterial color="#666666" />
            </mesh>
            {/* Muzzle glow when firing */}
            {isFiring && (
              <mesh position={[0, 0.9, 0]}>
                <sphereGeometry args={[0.1, 8, 8]} />
                <meshBasicMaterial color="#ff4444" transparent opacity={0.8} />
              </mesh>
            )}
          </group>
        )}
      </group>
      
      {/* Render bullets */}
      {bullets.map(bullet => (
        <Bullet
          key={bullet.id}
          id={bullet.id}
          startPosition={bullet.startPosition}
          direction={bullet.direction}
          speed={bullet.speed}
          cubePositionsRef={cubePositionsRef}
          onHit={handleBulletHit}
        />
      ))}
    </group>
  )
}

// 3D Bullet component - small glowing sphere
const Bullet3D = memo(({ position, id }) => {
  const groupRef = useRef()
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.set(position[0], position[1], position[2])
    }
  })
  
  return (
    <group ref={groupRef} position={position}>
      {/* Core bullet */}
      <mesh>
        <sphereGeometry args={[0.012, 6, 6]} />
        <meshBasicMaterial color="#ff00ff" />
      </mesh>
      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[0.022, 6, 6]} />
        <meshBasicMaterial color="#ff88ff" transparent opacity={0.3} />
      </mesh>
    </group>
  )
})

const HeroScene = ({ onModalOpen, onSpaceObjectClick, highlightedIds = [], onCubePositionsUpdate, onBulletHitCube, cubesToExplode = [], bulletPositionsRef, bullets3D = [], onBulletHit, turretActive = false }) => {
  // Track cube positions for bullet collision
  const cubePositionsRef = useRef({})
  const cubeMeshesRef = useRef({}) // Store actual mesh refs for raycasting
  const hitBulletsRef = useRef(new Set()) // Track bullets that already hit something
  const { camera, size } = useThree()
  
  const handleObjectClick = useCallback((objectType) => {
    if (onSpaceObjectClick) {
      onSpaceObjectClick(objectType)
    }
  }, [onSpaceObjectClick])
  
  // Real-time 3D collision detection - sphere to sphere
  useFrame(() => {
    if (!bulletPositionsRef?.current) return
    
    const bullets = bulletPositionsRef.current
    if (bullets.length === 0) return
    
    // Get all cube positions
    const cubeEntries = Object.entries(cubePositionsRef.current)
    if (cubeEntries.length === 0) return
    
    // Collision radius (bullet radius + cube radius) - generous for easier hits
    const collisionRadius = 0.4
    
    for (const bullet of bullets) {
      // Skip bullets that already hit something
      if (hitBulletsRef.current.has(bullet.id)) continue
      
      for (const [cubeId, cubeInfo] of cubeEntries) {
        if (!cubeInfo) continue
        
        let pos3D, cubeData
        if (Array.isArray(cubeInfo)) {
          pos3D = cubeInfo
          cubeData = null
        } else if (cubeInfo && cubeInfo.position) {
          pos3D = cubeInfo.position
          cubeData = cubeInfo.data || null
        } else {
          continue
        }
        
        if (!pos3D || pos3D.length < 3) continue
        
        // 3D distance check
        const dx = bullet.x3D - pos3D[0]
        const dy = bullet.y3D - pos3D[1]
        const dz = bullet.z3D - pos3D[2]
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
        
        if (distance < collisionRadius) {
          // HIT! Mark bullet and notify parent
          hitBulletsRef.current.add(bullet.id)
          
          // Clear after short delay
          setTimeout(() => {
            hitBulletsRef.current.delete(bullet.id)
          }, 100)
          
          // Notify parent
          if (onBulletHit) {
            onBulletHit(bullet.id, cubeId, cubeData)
          }
          
          break // One bullet hits one cube
        }
      }
    }
  })
  
  // Update parent with screen positions of cubes (legacy)
  useFrame(() => {
    if (!onCubePositionsUpdate || !camera) return
    
    try {
      const entries = Object.entries(cubePositionsRef.current)
      if (entries.length === 0) return
      
      const screenPositions = {}
      for (const [id, cubeInfo] of entries) {
        // Handle both old format (array) and new format (object with position)
        let pos3D, cubeData
        if (Array.isArray(cubeInfo)) {
          pos3D = cubeInfo
          cubeData = null
        } else if (cubeInfo && cubeInfo.position) {
          pos3D = cubeInfo.position
          cubeData = cubeInfo.data || null
        } else {
          continue // Skip invalid entries
        }
        
        if (!pos3D || pos3D.length < 3) continue
        
        // Convert 3D position to screen coordinates
        const vector = new THREE.Vector3(pos3D[0], pos3D[1], pos3D[2])
        vector.project(camera)
        
        const widthHalf = window.innerWidth / 2
        const heightHalf = window.innerHeight / 2
        
        screenPositions[id] = {
          x: (vector.x * widthHalf) + widthHalf,
          y: -(vector.y * heightHalf) + heightHalf,
          z: vector.z,
          pos3D: pos3D,
          data: cubeData
        }
      }
      
      if (Object.keys(screenPositions).length > 0) {
        onCubePositionsUpdate(screenPositions)
      }
    } catch (err) {
      console.error('Error updating cube positions:', err)
    }
  })
  
  return (
    <>
      {/* Lighting - dimmer for space effect */}
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} intensity={0.3} color="#ffffff" />
      
      {/* Realistic Star Field */}
      <RealisticStarField />
      
      {/* Black Hole */}
      <BlackHole />
      
      {/* Satellite orbiting behind black hole */}
      <Satellite onObjectClick={handleObjectClick} />
      
      {/* Astronaut touring around black hole */}
      <Astronaut orbitRadius={4} orbitSpeed={0.18} orbitOffset={0} yOffset={0.5} onObjectClick={handleObjectClick} />
      
      {/* Apollo Soyuz passing by */}
      <ApolloSoyuz onObjectClick={handleObjectClick} />
      
      {/* Window LED lights on screen edges */}
      <WindowLEDLights />
      
      {/* Particles from JSON */}
      <ParticleSystem 
        onModalOpen={onModalOpen}
        highlightedIds={highlightedIds}
        cubePositionsRef={cubePositionsRef}
        cubeMeshesRef={cubeMeshesRef}
        cubesToExplode={cubesToExplode}
        turretActive={turretActive}
      />
      
      {/* 3D Bullets */}
      {bullets3D.map(bullet => (
        <Bullet3D
          key={bullet.id}
          id={bullet.id}
          position={[bullet.x3D, bullet.y3D, bullet.z3D]}
        />
      ))}
    </>
  )
}

export default HeroScene
