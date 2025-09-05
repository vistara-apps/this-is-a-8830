/**
 * Cloud Storage Service Module
 * Handles secure upload and management of audio recordings
 */

class StorageService {
  constructor() {
    this.bucketName = import.meta.env.VITE_AWS_BUCKET_NAME
    this.region = import.meta.env.VITE_AWS_REGION
    this.apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
  }

  /**
   * Upload audio file to cloud storage
   */
  async uploadAudio(audioBlob, interactionId, metadata = {}) {
    try {
      // Create FormData for file upload
      const formData = new FormData()
      
      // Generate unique filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const filename = `recordings/${interactionId}_${timestamp}.webm`
      
      formData.append('audio', audioBlob, filename)
      formData.append('interactionId', interactionId)
      formData.append('metadata', JSON.stringify({
        duration: metadata.duration || 0,
        size: audioBlob.size,
        type: audioBlob.type,
        timestamp: new Date().toISOString(),
        ...metadata
      }))

      // Get auth token
      const token = localStorage.getItem('auth_token')
      const headers = {}
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      const response = await fetch(`${this.apiUrl}/api/upload/audio`, {
        method: 'POST',
        headers,
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const result = await response.json()
      
      return {
        success: true,
        url: result.url,
        key: result.key,
        size: audioBlob.size,
        duration: metadata.duration || 0
      }
    } catch (error) {
      console.error('Audio upload error:', error)
      throw new Error('Failed to upload audio recording. Please try again.')
    }
  }

  /**
   * Generate a presigned URL for secure audio access
   */
  async getPresignedUrl(key, expiresIn = 3600) {
    try {
      const response = await fetch(`${this.apiUrl}/api/storage/presigned-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ key, expiresIn })
      })

      if (!response.ok) {
        throw new Error('Failed to generate presigned URL')
      }

      const result = await response.json()
      return result.url
    } catch (error) {
      console.error('Presigned URL error:', error)
      throw error
    }
  }

  /**
   * Delete audio file from cloud storage
   */
  async deleteAudio(key) {
    try {
      const response = await fetch(`${this.apiUrl}/api/storage/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ key })
      })

      if (!response.ok) {
        throw new Error('Failed to delete audio file')
      }

      return { success: true }
    } catch (error) {
      console.error('Audio deletion error:', error)
      throw error
    }
  }

  /**
   * Get audio file metadata
   */
  async getAudioMetadata(key) {
    try {
      const response = await fetch(`${this.apiUrl}/api/storage/metadata/${encodeURIComponent(key)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to get audio metadata')
      }

      return await response.json()
    } catch (error) {
      console.error('Metadata retrieval error:', error)
      throw error
    }
  }

  /**
   * Local storage fallback for offline use
   */
  async saveToLocalStorage(audioBlob, interactionId) {
    try {
      // Convert blob to base64 for localStorage
      const base64Audio = await this.blobToBase64(audioBlob)
      
      const storageKey = `audio_${interactionId}`
      const audioData = {
        data: base64Audio,
        timestamp: new Date().toISOString(),
        size: audioBlob.size,
        type: audioBlob.type,
        interactionId
      }

      localStorage.setItem(storageKey, JSON.stringify(audioData))
      
      return {
        success: true,
        localKey: storageKey,
        size: audioBlob.size
      }
    } catch (error) {
      console.error('Local storage error:', error)
      throw new Error('Failed to save audio locally')
    }
  }

  /**
   * Retrieve audio from local storage
   */
  async getFromLocalStorage(interactionId) {
    try {
      const storageKey = `audio_${interactionId}`
      const audioDataStr = localStorage.getItem(storageKey)
      
      if (!audioDataStr) {
        throw new Error('Audio not found in local storage')
      }

      const audioData = JSON.parse(audioDataStr)
      
      // Convert base64 back to blob
      const audioBlob = await this.base64ToBlob(audioData.data, audioData.type)
      
      return {
        blob: audioBlob,
        metadata: {
          timestamp: audioData.timestamp,
          size: audioData.size,
          type: audioData.type
        }
      }
    } catch (error) {
      console.error('Local storage retrieval error:', error)
      throw error
    }
  }

  /**
   * Clear old local storage entries
   */
  clearOldLocalStorage(maxAgeHours = 24) {
    const cutoffTime = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000)
    
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i)
      
      if (key && key.startsWith('audio_')) {
        try {
          const audioDataStr = localStorage.getItem(key)
          const audioData = JSON.parse(audioDataStr)
          
          if (new Date(audioData.timestamp) < cutoffTime) {
            localStorage.removeItem(key)
          }
        } catch (error) {
          // Remove corrupted entries
          localStorage.removeItem(key)
        }
      }
    }
  }

  /**
   * Convert blob to base64
   */
  blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  /**
   * Convert base64 to blob
   */
  async base64ToBlob(base64, mimeType) {
    const response = await fetch(base64)
    return response.blob()
  }

  /**
   * Check storage quota and usage
   */
  async checkStorageQuota() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate()
        return {
          quota: estimate.quota,
          usage: estimate.usage,
          available: estimate.quota - estimate.usage,
          usagePercentage: (estimate.usage / estimate.quota) * 100
        }
      } catch (error) {
        console.error('Storage quota check error:', error)
      }
    }
    
    return null
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}

export default new StorageService()
