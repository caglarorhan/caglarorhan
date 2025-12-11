// Simple global state for voice visualization
// Using a pub/sub pattern to avoid prop drilling through Canvas

const listeners = new Set()
let state = {
  isSpeaking: false,
  audioData: new Array(32).fill(0),
  analyser: null
}

export const voiceStore = {
  getState: () => state,
  
  setState: (newState) => {
    state = { ...state, ...newState }
    listeners.forEach(listener => listener(state))
  },
  
  subscribe: (listener) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  
  setAudioData: (data) => {
    state.audioData = data
    listeners.forEach(listener => listener(state))
  },
  
  setSpeaking: (speaking) => {
    state.isSpeaking = speaking
    if (!speaking) {
      state.audioData = new Array(32).fill(0)
    }
    listeners.forEach(listener => listener(state))
  }
}

export default voiceStore
