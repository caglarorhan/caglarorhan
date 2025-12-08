import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Icosahedron, MeshDistortMaterial, Float } from '@react-three/drei'
import * as THREE from 'three'

const WireframeHead = () => {
  const groupRef = useRef()
  const meshRef = useRef()
  const linesRef = useRef()
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.2
    }
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(time * 0.5) * 0.1
    }
  })

  // Create connection lines
  const linePositions = []
  for (let i = 0; i < 30; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(Math.random() * 2 - 1)
    const r1 = 1.2
    const r2 = 1.8 + Math.random() * 0.5
    
    linePositions.push(
      r1 * Math.sin(phi) * Math.cos(theta),
      r1 * Math.sin(phi) * Math.sin(theta),
      r1 * Math.cos(phi),
      r2 * Math.sin(phi) * Math.cos(theta),
      r2 * Math.sin(phi) * Math.sin(theta),
      r2 * Math.cos(phi)
    )
  }

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef}>
        {/* Main wireframe sphere representing head */}
        <Icosahedron ref={meshRef} args={[1.2, 2]}>
          <meshBasicMaterial 
            color="#00f5ff" 
            wireframe 
            transparent 
            opacity={0.3}
          />
        </Icosahedron>
        
        {/* Inner distorted sphere */}
        <Icosahedron args={[0.8, 3]}>
          <MeshDistortMaterial
            color="#ff00ff"
            transparent
            opacity={0.2}
            distort={0.2}
            speed={2}
          />
        </Icosahedron>
        
        {/* Core */}
        <mesh>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial color="#00f5ff" transparent opacity={0.8} />
        </mesh>
        
        {/* Neural connection lines */}
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={linePositions.length / 3}
              array={new Float32Array(linePositions)}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#ff00ff" transparent opacity={0.4} />
        </lineSegments>
        
        {/* Outer particles */}
        <Points count={100} />
        
        {/* Rings */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.8, 0.01, 8, 64]} />
          <meshBasicMaterial color="#00f5ff" transparent opacity={0.5} />
        </mesh>
        <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
          <torusGeometry args={[2, 0.008, 8, 64]} />
          <meshBasicMaterial color="#ff00ff" transparent opacity={0.3} />
        </mesh>
      </group>
    </Float>
  )
}

const Points = ({ count }) => {
  const pointsRef = useRef()
  
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(Math.random() * 2 - 1)
    const radius = 1.5 + Math.random() * 0.5
    
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = radius * Math.cos(phi)
  }
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.1
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
      <pointsMaterial size={0.03} color="#00f5ff" transparent opacity={0.8} />
    </points>
  )
}

const AboutScene = () => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#00f5ff" />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#ff00ff" />
      
      <WireframeHead />
    </>
  )
}

export default AboutScene
