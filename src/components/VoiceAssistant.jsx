import { useState, useRef, useEffect, useCallback } from 'react'
import './VoiceAssistant.css'

// Your profile data for AI context
const PROFILE_CONTEXT = `
You are a helpful AI assistant representing Caglar Orhan's personal website. 
Answer questions about Caglar based on this profile:

ABOUT CAGLAR ORHAN:
- Full-Stack Software Developer with 10+ years of experience
- Expertise: Front-End, Back-End & Databases
- Languages: JavaScript, TypeScript, Node.js, Fastify, Next.js, PHP
- Databases: MySQL, PostgreSQL, MariaDB, MongoDB

AI & ML EXPERIENCE:
- LLMs: GPT-4, Claude, Gemini, LLaMA
- SLMs: Phi-3, Mistral 7B, Ollama
- APIs: OpenAI, Anthropic, Google AI
- Frameworks: LangChain, LlamaIndex, Hugging Face
- ML Models: NSFWJS, MobileNet v2, COCO-SSD, MediaPipe
- Tools: TensorFlow.js, Pinecone, ChromaDB
- Browser ML: Manifest V3, Chrome APIs

PORTFOLIO:
- Browser Extensions: PicBan (picban.com)
- Online Games: CyberGrid Assault (cybergridassault.com)
- Web Apps: PicDia (picdia.com), ReplicID (replicid.com), Synercium (synercium.com)

CONTACT:
- Website: caglarorhan.com
- GitHub: github.com/caglarorhan
- LinkedIn: linkedin.com/in/caglarorhan

Keep responses concise, friendly, and professional. If asked about topics unrelated to Caglar, politely redirect the conversation.
`

// AI responses are pre-defined for security and reliability
// This avoids external API calls that could trigger security warnings

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [error, setError] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const [hasGreeted, setHasGreeted] = useState(false)
  const [voicesLoaded, setVoicesLoaded] = useState(false)
  
  const recognitionRef = useRef(null)
  const synthRef = useRef(window.speechSynthesis)
  
  // Load voices - this is async in many browsers
  useEffect(() => {
    const loadVoices = () => {
      const voices = synthRef.current.getVoices()
      if (voices.length > 0) {
        setVoicesLoaded(true)
        console.log('Voices loaded:', voices.length, voices.map(v => v.name))
      }
    }
    
    // Try to load immediately
    loadVoices()
    
    // Also listen for voiceschanged event (Chrome fires this async)
    if (synthRef.current.onvoiceschanged !== undefined) {
      synthRef.current.onvoiceschanged = loadVoices
    }
    
    // Fallback: try again after a delay
    const fallbackTimeout = setTimeout(loadVoices, 1000)
    
    return () => clearTimeout(fallbackTimeout)
  }, [])
  
  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'
      
      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex
        const transcriptText = event.results[current][0].transcript
        setTranscript(transcriptText)
        
        if (event.results[current].isFinal) {
          handleUserMessage(transcriptText)
        }
      }
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setError(`Speech error: ${event.error}`)
        setIsListening(false)
      }
      
      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
      synthRef.current.cancel()
    }
  }, [])
  
  // Start listening
  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setError('')
      setTranscript('')
      recognitionRef.current.start()
      setIsListening(true)
    }
  }, [isListening])
  
  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }, [isListening])
  
  // Text-to-Speech with browser default voice
  const speak = useCallback((text) => {
    if (synthRef.current) {
      synthRef.current.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.95  // Slightly slower for clarity
      utterance.pitch = 1.0  // Natural pitch
      utterance.volume = 1
      
      // Use browser's default voice - no voice selection
      
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      
      synthRef.current.speak(utterance)
    }
  }, [])
  
  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }, [])
  
  // Greet user when they first interact (click mic button)
  const greetUser = useCallback(() => {
    if (!hasGreeted) {
      const hasVisitedBefore = localStorage.getItem('caglarorhan_visited')
      const greeting = hasVisitedBefore ? "Hello again!" : "Hi there!"
      speak(greeting)
      setHasGreeted(true)
      setChatHistory([{ role: 'assistant', content: greeting }])
      localStorage.setItem('caglarorhan_visited', 'true')
    }
  }, [hasGreeted, speak])
  
  // Handle user message - send to AI
  const handleUserMessage = async (message) => {
    if (!message.trim()) return
    
    setIsProcessing(true)
    setError('')
    
    // Add to chat history
    setChatHistory(prev => [...prev, { role: 'user', content: message }])
    
    try {
      const aiResponse = await callAI(message)
      setResponse(aiResponse)
      setChatHistory(prev => [...prev, { role: 'assistant', content: aiResponse }])
      
      // Read response aloud
      speak(aiResponse)
    } catch (err) {
      console.error('AI Error:', err)
      const errorMsg = 'Sorry, I couldn\'t process that. Please try again.'
      setError(errorMsg)
      speak(errorMsg)
    } finally {
      setIsProcessing(false)
    }
  }
  
  // Call AI - uses pre-defined responses for security and reliability
  const callAI = async (message) => {
    // Use pre-defined responses based on keywords
    // This avoids external API calls that could trigger security warnings
    return getFallbackResponse(message)
  }
  
  // Fallback responses when no AI is available
  const getFallbackResponse = (message) => {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('who') || lowerMessage.includes('about') || lowerMessage.includes('caglar')) {
      return 'Caglar Orhan is a Full-Stack Software Developer with over 10 years of experience in front-end, back-end, and database development. He specializes in JavaScript, TypeScript, Node.js, and various AI technologies.'
    }
    
    if (lowerMessage.includes('skill') || lowerMessage.includes('technology') || lowerMessage.includes('tech')) {
      return 'Caglar works with JavaScript, TypeScript, Node.js, Fastify, Next.js, PHP, and databases like MySQL, PostgreSQL, and MongoDB. He also has extensive AI experience with GPT-4, Claude, LangChain, and TensorFlow.js.'
    }
    
    if (lowerMessage.includes('project') || lowerMessage.includes('portfolio') || lowerMessage.includes('work')) {
      return 'Caglar has built several projects including PicBan, a browser extension, CyberGrid Assault, an online game, and web apps like PicDia, ReplicID, and Synercium. You can check them out in the Portfolio section.'
    }
    
    if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('email')) {
      return 'You can contact Caglar through the Contact section on this website, or find him on GitHub and LinkedIn. Links are available in the Portfolio section.'
    }
    
    if (lowerMessage.includes('ai') || lowerMessage.includes('machine learning') || lowerMessage.includes('ml')) {
      return 'Caglar has extensive AI and ML experience, working with LLMs like GPT-4 and Claude, SLMs like Mistral and Phi-3, and frameworks like LangChain and TensorFlow.js. He also builds browser-based ML solutions.'
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return 'Hello! I\'m Caglar\'s AI assistant. I can tell you about his skills, projects, and experience. What would you like to know?'
    }
    
    return 'I\'m here to help you learn about Caglar Orhan. You can ask me about his skills, projects, AI experience, or how to contact him.'
  }
  
  // Toggle assistant panel - greet on first open
  const toggleOpen = () => {
    const wasOpen = isOpen
    setIsOpen(!isOpen)
    if (wasOpen) {
      stopSpeaking()
      stopListening()
    } else {
      // Greet when opening for the first time
      setTimeout(() => greetUser(), 300)
    }
  }

  return (
    <>
      {/* Floating button */}
      <button 
        className={`voice-assistant-btn ${isOpen ? 'active' : ''} ${isSpeaking ? 'speaking' : ''}`}
        onClick={toggleOpen}
        title="Voice Assistant"
      >
        <div className="btn-icon">
          {isOpen ? '✕' : '🎙️'}
        </div>
        <div className="btn-pulse"></div>
      </button>
      
      {/* Assistant panel */}
      {isOpen && (
        <div className="voice-assistant-panel">
          <div className="assistant-header">
            <span className="assistant-title">🤖 AI Assistant</span>
            <span className="assistant-status">
              {isListening && '🔴 Listening...'}
              {isProcessing && '⏳ Thinking...'}
              {isSpeaking && '🔊 Speaking...'}
              {!isListening && !isProcessing && !isSpeaking && '💬 Ready'}
            </span>
          </div>
          
          <div className="assistant-chat">
            {chatHistory.length === 0 && (
              <div className="chat-welcome">
                <p>👋 Hi! I'm Caglar's AI assistant.</p>
                <p>Ask me anything about his skills, projects, or experience!</p>
              </div>
            )}
            
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.role}`}>
                <span className="message-icon">{msg.role === 'user' ? '👤' : '🤖'}</span>
                <span className="message-text">{msg.content}</span>
              </div>
            ))}
            
            {transcript && isListening && (
              <div className="chat-message user interim">
                <span className="message-icon">👤</span>
                <span className="message-text">{transcript}</span>
              </div>
            )}
            
            {error && (
              <div className="chat-error">{error}</div>
            )}
          </div>
          
          <div className="assistant-controls">
            <button
              className={`control-btn mic ${isListening ? 'active' : ''}`}
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
            >
              {isListening ? '⏹️ Stop' : '🎤 Speak'}
            </button>
            
            {isSpeaking && (
              <button className="control-btn stop" onClick={stopSpeaking}>
                🔇 Mute
              </button>
            )}
          </div>
          
          <div className="assistant-hint">
            Press the mic button and speak your question
          </div>
        </div>
      )}
    </>
  )
}

export default VoiceAssistant
