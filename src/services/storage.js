class StorageService {
  constructor() {
    this.isCloudEnabled = !!import.meta.env.VITE_AWS_BUCKET_NAME
  }

  async uploadAudio(audioBlob, interactionId, metadata = {}) {
    if (!this.isCloudEnabled) {
      throw new Error('Cloud storage not configured')
    }

    try {
      // In a real app, this would upload to AWS S3 or similar
      // For demo purposes, we'll simulate the upload
      const fileName = `recordings/${interactionId}_${Date.now()}.webm`
      
      // Simulate upload progress
      await this.simulateUpload()
      
      return {
        url: `https://${import.meta.env.VITE_AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}`,
        fileName,
        size: audioBlob.size,
        uploadedAt: new Date().toISOString(),
        metadata
      }
    } catch (error) {
      console.error('Cloud upload failed:', error)
      throw error
    }
  }

  async saveToLocalStorage(audioBlob, interactionId) {
    try {
      // Convert blob to base64 for localStorage
      const base64Data = await this.blobToBase64(audioBlob)
      
      const recordingData = {
        id: interactionId,
        data: base64Data,
        size: audioBlob.size,
        type: audioBlob.type,
        savedAt: new Date().toISOString()
      }

      // Store in localStorage
      const existingRecordings = this.getLocalRecordings()
      existingRecordings[interactionId] = recordingData
      
      localStorage.setItem('audio_recordings', JSON.stringify(existingRecordings))
      
      return {
        success: true,
        id: interactionId,
        size: audioBlob.size
      }
    } catch (error) {
      console.error('Local storage save failed:', error)
      throw error
    }
  }

  getLocalRecordings() {
    try {
      const recordings = localStorage.getItem('audio_recordings')
      return recordings ? JSON.parse(recordings) : {}
    } catch (error) {
      console.error('Failed to get local recordings:', error)
      return {}
    }
  }

  async getLocalRecording(interactionId) {
    try {
      const recordings = this.getLocalRecordings()
      const recording = recordings[interactionId]
      
      if (!recording) {
        throw new Error('Recording not found')
      }

      // Convert base64 back to blob
      const blob = this.base64ToBlob(recording.data, recording.type)
      return {
        blob,
        url: URL.createObjectURL(blob),
        metadata: recording
      }
    } catch (error) {
      console.error('Failed to get local recording:', error)
      throw error
    }
  }

  async deleteLocalRecording(interactionId) {
    try {
      const recordings = this.getLocalRecordings()
      delete recordings[interactionId]
      localStorage.setItem('audio_recordings', JSON.stringify(recordings))
      return { success: true }
    } catch (error) {
      console.error('Failed to delete local recording:', error)
      throw error
    }
  }

  // Utility methods
  async blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  base64ToBlob(base64, type) {
    const byteCharacters = atob(base64.split(',')[1])
    const byteNumbers = new Array(byteCharacters.length)
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    
    const byteArray = new Uint8Array(byteNumbers)
    return new Blob([byteArray], { type })
  }

  async simulateUpload() {
    // Simulate upload delay
    return new Promise(resolve => {
      setTimeout(resolve, 2000)
    })
  }

  // Get storage usage info
  getStorageInfo() {
    const recordings = this.getLocalRecordings()
    const recordingCount = Object.keys(recordings).length
    
    let totalSize = 0
    Object.values(recordings).forEach(recording => {
      totalSize += recording.size || 0
    })

    return {
      recordingCount,
      totalSize,
      formattedSize: this.formatBytes(totalSize),
      isCloudEnabled: this.isCloudEnabled
    }
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }
}

const storageService = new StorageService()
export default storageService
