import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

const NeuralNode = ({ position, color, size = 0.1 }) => {
  const meshRef = useRef()
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + Math.sin(time * 2 + position[0]) * 0.2)
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} />
    </mesh>
  )
}

const ConnectionLine = ({ start, end, color }) => {
  const lineRef = useRef()
  
  const points = useMemo(() => {
    return [new THREE.Vector3(...start), new THREE.Vector3(...end)]
  }, [start, end])
  
  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [points])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (lineRef.current) {
      lineRef.current.material.opacity = 0.2 + Math.sin(time * 2) * 0.1
    }
  })

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={0.3} />
    </line>
  )
}

const NeuralNetwork = () => {
  const groupRef = useRef()
  
  // Generate nodes
  const nodes = useMemo(() => {
    const nodeList = []
    const colors = ['#00f5ff', '#ff00ff', '#8b00ff', '#00ff88']
    
    for (let i = 0; i < 50; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      const radius = 3 + Math.random() * 3
      
      nodeList.push({
        position: [
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        ],
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 0.05 + Math.random() * 0.1
      })
    }
    return nodeList
  }, [])

  // Generate connections
  const connections = useMemo(() => {
    const lines = []
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const distance = Math.sqrt(
          Math.pow(nodes[i].position[0] - nodes[j].position[0], 2) +
          Math.pow(nodes[i].position[1] - nodes[j].position[1], 2) +
          Math.pow(nodes[i].position[2] - nodes[j].position[2], 2)
        )
        if (distance < 2.5 && Math.random() > 0.7) {
          lines.push({
            start: nodes[i].position,
            end: nodes[j].position,
            color: nodes[i].color
          })
        }
      }
    }
    return lines
  }, [nodes])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.05
      groupRef.current.rotation.x = Math.sin(time * 0.1) * 0.1
    }
  })

  return (
    <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef}>
        {/* Nodes */}
        {nodes.map((node, index) => (
          <NeuralNode key={index} {...node} />
        ))}
        
        {/* Connections */}
        {connections.map((connection, index) => (
          <ConnectionLine key={index} {...connection} />
        ))}
        
        {/* Central Core */}
        <mesh>
          <icosahedronGeometry args={[0.5, 1]} />
          <meshBasicMaterial color="#00f5ff" wireframe transparent opacity={0.3} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial color="#00f5ff" transparent opacity={0.5} />
        </mesh>
      </group>
    </Float>
  )
}

const SkillsScene = () => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#00f5ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ff00ff" />
      
      <NeuralNetwork />
    </>
  )
}

export default SkillsScene
