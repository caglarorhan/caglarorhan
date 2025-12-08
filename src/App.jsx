import { useRef } from 'react'

// Components
import CustomCursor from './components/CustomCursor'
import HeroSection from './components/sections/HeroSection'
import ParticleField from './components/ParticleField'

function App() {
  const appRef = useRef(null)

  return (
    <div ref={appRef} className="app">
      <CustomCursor />
      <ParticleField />
      
      <main>
        <HeroSection />
      </main>
    </div>
  )
}

export default App
