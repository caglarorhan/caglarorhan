// Particles Data Source Configuration
// Switch between local JSON file and remote API endpoint

const PARTICLES_CONFIG = {
  // Set to 'local' or 'remote'
  source: 'local',
  
  // Local JSON file path (relative to public folder)
  localPath: '/particles.json',
  
  // Remote API endpoint URL
  remoteUrl: 'https://api.caglarorhan.com/particles',
  
  // Remote API options
  remoteOptions: {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Add auth headers if needed
      // 'Authorization': 'Bearer YOUR_TOKEN'
    },
    // Cache duration in milliseconds (5 minutes default)
    cacheDuration: 5 * 60 * 1000,
  },
  
  // Fallback to local if remote fails
  fallbackToLocal: true,
  
  // Enable console logging for debugging
  debug: true,
}

// Cache for particles data
let cachedData = null
let cacheTimestamp = null

// Fetch particles data based on configuration
export async function fetchParticles() {
  const { source, localPath, remoteUrl, remoteOptions, fallbackToLocal, debug } = PARTICLES_CONFIG
  
  const log = debug ? console.log : () => {}
  
  // Return cached data if available and fresh
  if (cachedData && cacheTimestamp) {
    const cacheAge = Date.now() - cacheTimestamp
    if (cacheAge < remoteOptions.cacheDuration) {
      log('[Particles] Using cached data')
      return cachedData
    }
  }
  
  try {
    if (source === 'remote') {
      log('[Particles] Fetching from remote API:', remoteUrl)
      
      const response = await fetch(remoteUrl, {
        method: remoteOptions.method,
        headers: remoteOptions.headers,
      })
      
      if (!response.ok) {
        throw new Error(`Remote API error: ${response.status}`)
      }
      
      const data = await response.json()
      log('[Particles] Remote data loaded:', data.length, 'particles')
      cachedData = data
      cacheTimestamp = Date.now()
      return data
      
    } else {
      log('[Particles] Fetching from local JSON:', localPath)
      
      const response = await fetch(localPath)
      
      if (!response.ok) {
        throw new Error(`Local file error: ${response.status}`)
      }
      
      const data = await response.json()
      log('[Particles] Local data loaded:', data.length, 'particles')
      cachedData = data
      cacheTimestamp = Date.now()
      return data
    }
    
  } catch (error) {
    console.error('[Particles] Error loading data:', error.message)
    
    // Fallback to local if remote fails
    if (source === 'remote' && fallbackToLocal) {
      log('[Particles] Falling back to local JSON...')
      try {
        const response = await fetch(localPath)
        const data = await response.json()
        log('[Particles] Fallback data loaded:', data.length, 'particles')
        cachedData = data
        cacheTimestamp = Date.now()
        return data
      } catch (fallbackError) {
        console.error('[Particles] Fallback also failed:', fallbackError.message)
      }
    }
    
    // Return empty array if all fails
    return []
  }
}

// Export config for external access
export default PARTICLES_CONFIG
