import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const Particles = ({ count = 500 }) => {
  const mesh = useRef()
  const light = useRef()
  
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const time = Math.random() * 100
      const factor = 20 + Math.random() * 100
      const speed = 0.01 + Math.random() / 200
      const x = (Math.random() - 0.5) * 100
      const y = (Math.random() - 0.5) * 100
      const z = (Math.random() - 0.5) * 100
      temp.push({ time, factor, speed, x, y, z })
    }
    return temp
  }, [count])
  
  const dummy = useMemo(() => new THREE.Object3D(), [])
  
  useFrame(() => {
    particles.forEach((particle, i) => {
      let { time, factor, speed, x, y, z } = particle
      time = particle.time += speed / 2
      
      const a = Math.cos(time) + Math.sin(time * 1) / 10
      const b = Math.sin(time) + Math.cos(time * 2) / 10
      const s = Math.cos(time)
      
      dummy.position.set(
        x + Math.cos((time / 10) * factor) + (Math.sin(time * 1) * factor) / 10,
        y + Math.sin((time / 10) * factor) + (Math.cos(time * 2) * factor) / 10,
        z + Math.cos((time / 10) * factor) + (Math.sin(time * 3) * factor) / 10
      )
      dummy.scale.set(s * 0.3, s * 0.3, s * 0.3)
      dummy.rotation.set(s * 5, s * 5, s * 5)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })
  
  return (
    <>
      <pointLight ref={light} distance={40} intensity={8} color="#00f5ff" />
      <instancedMesh ref={mesh} args={[null, null, count]}>
        <dodecahedronGeometry args={[0.2, 0]} />
        <meshPhongMaterial color="#00f5ff" transparent opacity={0.6} />
      </instancedMesh>
    </>
  )
}

const ParticleField = () => {
  return (
    <div className="particle-field" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -2,
      opacity: 0.4,
      pointerEvents: 'none'
    }}>
      <Canvas
        camera={{ fov: 75, position: [0, 0, 50] }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.2} />
        <Particles count={300} />
      </Canvas>
    </div>
  )
}

export default ParticleField
