import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

const Portal = () => {
  const portalRef = useRef()
  const ringsRef = useRef([])
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (portalRef.current) {
      portalRef.current.rotation.z = time * 0.2
    }
    ringsRef.current.forEach((ring, i) => {
      if (ring) {
        ring.rotation.z = time * (0.1 + i * 0.05) * (i % 2 === 0 ? 1 : -1)
        ring.scale.setScalar(1 + Math.sin(time * 2 + i) * 0.05)
      }
    })
  })

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={portalRef}>
        {/* Portal Rings */}
        {[...Array(5)].map((_, i) => (
          <mesh
            key={i}
            ref={el => ringsRef.current[i] = el}
            rotation={[0, 0, (i * Math.PI) / 5]}
          >
            <torusGeometry args={[1.5 + i * 0.3, 0.02 - i * 0.003, 16, 64]} />
            <meshBasicMaterial 
              color={i % 2 === 0 ? '#00f5ff' : '#ff00ff'} 
              transparent 
              opacity={0.6 - i * 0.1}
            />
          </mesh>
        ))}
        
        {/* Inner Portal Effect */}
        <mesh>
          <circleGeometry args={[1.5, 64]} />
          <meshBasicMaterial 
            color="#00f5ff" 
            transparent 
            opacity={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Portal Core */}
        <PortalCore />
        
        {/* Energy Particles */}
        <EnergyParticles />
      </group>
    </Float>
  )
}

const PortalCore = () => {
  const coreRef = useRef()
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (coreRef.current) {
      coreRef.current.scale.setScalar(1 + Math.sin(time * 3) * 0.1)
      coreRef.current.material.opacity = 0.3 + Math.sin(time * 2) * 0.1
    }
  })

  return (
    <mesh ref={coreRef}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshBasicMaterial 
        color="#00f5ff" 
        transparent 
        opacity={0.3}
      />
    </mesh>
  )
}

const EnergyParticles = () => {
  const pointsRef = useRef()
  const count = 100
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const radius = 1.5 + Math.random() * 1
      pos[i * 3] = Math.cos(angle) * radius
      pos[i * 3 + 1] = Math.sin(angle) * radius
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.5
    }
    return pos
  }, [count])
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (pointsRef.current) {
      pointsRef.current.rotation.z = time * 0.3
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#00f5ff" transparent opacity={0.8} />
    </points>
  )
}

const DataStreams = () => {
  const groupRef = useRef()
  const streamCount = 20
  
  const streams = useMemo(() => {
    return [...Array(streamCount)].map((_, i) => ({
      angle: (i / streamCount) * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.5,
      length: 0.3 + Math.random() * 0.3
    }))
  }, [streamCount])
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.rotation.z = time * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {streams.map((stream, i) => (
        <DataStream key={i} {...stream} index={i} />
      ))}
    </group>
  )
}

const DataStream = ({ angle, speed, length, index }) => {
  const meshRef = useRef()
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (meshRef.current) {
      const distance = 2 + ((time * speed + index * 0.5) % 3)
      meshRef.current.position.x = Math.cos(angle) * distance
      meshRef.current.position.y = Math.sin(angle) * distance
      meshRef.current.rotation.z = angle
    }
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[length, 0.02]} />
      <meshBasicMaterial color="#00f5ff" transparent opacity={0.5} />
    </mesh>
  )
}

const ContactScene = () => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#00f5ff" />
      <pointLight position={[-5, -5, 5]} intensity={0.3} color="#ff00ff" />
      
      <Portal />
      <DataStreams />
    </>
  )
}

export default ContactScene
