/**
 * API Service Module
 * Handles all API communications for the KnowYourRights Buddy app
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    // Add auth token if available
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // User endpoints
  async createUser(userData) {
    return this.request('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async getUser(userId) {
    return this.request(`/api/users/${userId}`)
  }

  async updateUser(userId, userData) {
    return this.request(`/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  }

  // Script endpoints
  async getScripts(state = 'CA') {
    return this.request(`/api/scripts?state=${state}`)
  }

  async getScript(scriptId) {
    return this.request(`/api/scripts/${scriptId}`)
  }

  async generateScript(scenario, state, customization = {}) {
    return this.request('/api/scripts/generate', {
      method: 'POST',
      body: JSON.stringify({ scenario, state, customization }),
    })
  }

  // Saved scripts endpoints
  async saveScript(userId, scriptId, customNotes = '') {
    return this.request('/api/saved-scripts', {
      method: 'POST',
      body: JSON.stringify({ userId, scriptId, customNotes }),
    })
  }

  async getSavedScripts(userId) {
    return this.request(`/api/saved-scripts?userId=${userId}`)
  }

  async deleteSavedScript(savedScriptId) {
    return this.request(`/api/saved-scripts/${savedScriptId}`, {
      method: 'DELETE',
    })
  }

  // Interaction endpoints
  async createInteraction(interactionData) {
    return this.request('/api/interactions', {
      method: 'POST',
      body: JSON.stringify(interactionData),
    })
  }

  async getInteractions(userId) {
    return this.request(`/api/interactions?userId=${userId}`)
  }

  async updateInteraction(interactionId, updates) {
    return this.request(`/api/interactions/${interactionId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  async deleteInteraction(interactionId) {
    return this.request(`/api/interactions/${interactionId}`, {
      method: 'DELETE',
    })
  }

  // Subscription endpoints
  async createSubscription(userId, priceId) {
    return this.request('/api/subscriptions/create', {
      method: 'POST',
      body: JSON.stringify({ userId, priceId }),
    })
  }

  async getSubscriptionStatus(userId) {
    return this.request(`/api/subscriptions/status/${userId}`)
  }

  async cancelSubscription(subscriptionId) {
    return this.request(`/api/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
    })
  }

  // File upload endpoint
  async uploadAudio(file, interactionId) {
    const formData = new FormData()
    formData.append('audio', file)
    formData.append('interactionId', interactionId)

    return this.request('/api/upload/audio', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it for FormData
    })
  }
}

export default new ApiService()
