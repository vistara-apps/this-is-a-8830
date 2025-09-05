import React, { useState, useRef, useEffect } from 'react'
import { Mic, Square, Play, Pause, Download, Share, Clock } from 'lucide-react'
import { useApp } from '../context/AppContext'
import ActionButton from '../components/ActionButton'

function RecordingPage() {
  const { state, dispatch } = useApp()
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [notes, setNotes] = useState('')
  
  const audioRef = useRef(null)
  const intervalRef = useRef(null)

  // Timer effect
  useEffect(() => {
    if (state.isRecording) {
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [state.isRecording])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        
        // Stop all tracks to turn off recording indicator
        stream.getTracks().forEach(track => track.stop())
      }

      recorder.start()
      setMediaRecorder(recorder)
      setRecordingTime(0)
      dispatch({ type: 'START_RECORDING' })
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Unable to access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop()
      setMediaRecorder(null)
      dispatch({ type: 'STOP_RECORDING' })
    }
  }

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleNotesChange = (e) => {
    const newNotes = e.target.value
    setNotes(newNotes)
    dispatch({ type: 'UPDATE_RECORDING_NOTES', payload: newNotes })
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const generateSummary = () => {
    const summary = {
      title: 'Interaction Summary',
      body: (
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-text mb-2">Recording Details</h3>
            <div className="text-sm text-muted space-y-1">
              <p>Duration: {formatTime(recordingTime)}</p>
              <p>Started: {state.currentRecording?.startTime || new Date().toLocaleString()}</p>
              <p>Status: {state.isRecording ? 'Recording' : 'Completed'}</p>
            </div>
          </div>
          
          {notes && (
            <div>
              <h3 className="font-medium text-text mb-2">Notes</h3>
              <p className="text-sm text-muted">{notes}</p>
            </div>
          )}
          
          <div className="flex space-x-2">
            <ActionButton variant="primary" size="sm" className="flex-1">
              <Share className="w-4 h-4 mr-2" />
              Share Summary
            </ActionButton>
            <ActionButton variant="secondary" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </ActionButton>
          </div>
        </div>
      )
    }
    return summary
  }

  return (
    <div className="container py-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-text">Interaction Recording</h1>
        <p className="text-muted">
          Record audio and document your police interaction
        </p>
      </div>

      {/* Recording Controls */}
      <div className="bg-surface rounded-2xl p-8 shadow-card text-center space-y-6">
        {/* Recording Button */}
        <div className="relative">
          <button
            onClick={state.isRecording ? stopRecording : startRecording}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-200 ${
              state.isRecording
                ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/25'
                : 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25'
            }`}
          >
            {state.isRecording ? (
              <Square className="w-8 h-8 text-white fill-current" />
            ) : (
              <Mic className="w-8 h-8 text-white" />
            )}
          </button>
          
          {state.isRecording && (
            <div className="absolute -inset-2 border-4 border-red-400 rounded-full animate-pulse"></div>
          )}
        </div>

        {/* Timer */}
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Clock className="w-4 h-4 text-muted" />
            <span className="text-2xl font-mono font-bold text-text">
              {formatTime(recordingTime)}
            </span>
          </div>
          <p className="text-sm text-muted">
            {state.isRecording ? 'Recording in progress...' : 'Tap to start recording'}
          </p>
        </div>
      </div>

      {/* Audio Playback */}
      {audioUrl && (
        <div className="bg-surface rounded-lg p-6 shadow-card space-y-4">
          <h3 className="font-bold text-text">Recorded Audio</h3>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlayback}
              className="w-12 h-12 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white ml-0.5" />
              )}
            </button>
            
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full w-1/3"></div>
              </div>
            </div>
          </div>
          
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
        </div>
      )}

      {/* Notes Section */}
      <div className="bg-surface rounded-lg p-6 shadow-card space-y-4">
        <h3 className="font-bold text-text">Interaction Notes</h3>
        <textarea
          value={notes}
          onChange={handleNotesChange}
          placeholder="Add notes about the interaction, key moments, or important details..."
          className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
        />
      </div>

      {/* Previous Recordings */}
      {state.interactions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-text">Previous Recordings</h2>
          <div className="space-y-3">
            {state.interactions.slice(-3).reverse().map((interaction, index) => (
              <div key={interaction.interactionId} className="bg-surface rounded-lg p-4 shadow-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-text">
                      Recording #{state.interactions.length - index}
                    </p>
                    <p className="text-sm text-muted">
                      {new Date(interaction.startTime).toLocaleDateString()} at{' '}
                      {new Date(interaction.startTime).toLocaleTimeString()}
                    </p>
                  </div>
                  <ActionButton variant="secondary" size="sm">
                    View Details
                  </ActionButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {(audioUrl || notes) && (
        <div className="flex space-x-3">
          <ActionButton variant="primary" className="flex-1">
            <Share className="w-4 h-4 mr-2" />
            Generate Summary
          </ActionButton>
          <ActionButton variant="secondary">
            <Download className="w-4 h-4 mr-2" />
            Export
          </ActionButton>
        </div>
      )}
    </div>
  )
}

export default RecordingPage