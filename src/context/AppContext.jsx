import React, { createContext, useContext, useReducer, useEffect } from 'react'

const AppContext = createContext()

const initialState = {
  user: {
    userId: null,
    currentState: 'CA',
    subscriptionStatus: 'free',
    createdAt: null
  },
  scripts: [],
  interactions: [],
  savedScripts: [],
  isRecording: false,
  currentRecording: null,
  selectedScript: null
}

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER_STATE':
      return {
        ...state,
        user: { ...state.user, currentState: action.payload }
      }
    case 'SET_SUBSCRIPTION':
      return {
        ...state,
        user: { ...state.user, subscriptionStatus: action.payload }
      }
    case 'SET_SCRIPTS':
      return {
        ...state,
        scripts: action.payload
      }
    case 'ADD_SCRIPT':
      return {
        ...state,
        scripts: [...state.scripts, action.payload]
      }
    case 'START_RECORDING':
      return {
        ...state,
        isRecording: true,
        currentRecording: {
          interactionId: Date.now().toString(),
          userId: state.user.userId,
          startTime: new Date().toISOString(),
          endTime: null,
          notes: '',
          audioRecordingUrl: null
        }
      }
    case 'STOP_RECORDING':
      return {
        ...state,
        isRecording: false,
        interactions: state.currentRecording 
          ? [...state.interactions, { ...state.currentRecording, endTime: new Date().toISOString() }]
          : state.interactions,
        currentRecording: null
      }
    case 'UPDATE_RECORDING_NOTES':
      return {
        ...state,
        currentRecording: state.currentRecording 
          ? { ...state.currentRecording, notes: action.payload }
          : null
      }
    case 'SAVE_SCRIPT':
      return {
        ...state,
        savedScripts: [...state.savedScripts, action.payload]
      }
    case 'SELECT_SCRIPT':
      return {
        ...state,
        selectedScript: action.payload
      }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Initialize with sample data
  useEffect(() => {
    const sampleScripts = [
      {
        scriptId: '1',
        state: 'CA',
        scenario: 'Traffic Stop',
        scriptText: `"I understand I'm being stopped. I will remain calm and respectful. I am exercising my right to remain silent. I do not consent to any searches. I would like to speak with an attorney."`,
        language: 'en'
      },
      {
        scriptId: '2',
        state: 'CA',
        scenario: 'Door Knock',
        scriptText: `"I do not consent to entry. I am exercising my right to remain silent. I would like to speak with an attorney before answering any questions."`,
        language: 'en'
      },
      {
        scriptId: '3',
        state: 'CA',
        scenario: 'Stop and Frisk',
        scriptText: `"I do not consent to this search. I am not resisting, but I do not consent. I am exercising my right to remain silent."`,
        language: 'en'
      }
    ]
    dispatch({ type: 'SET_SCRIPTS', payload: sampleScripts })
  }, [])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}