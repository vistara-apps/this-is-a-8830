import OpenAI from 'openai'

class OpenAIService {
  constructor() {
    this.client = null
    this.init()
  }

  init() {
    try {
      if (import.meta.env.VITE_OPENAI_API_KEY) {
        this.client = new OpenAI({
          apiKey: import.meta.env.VITE_OPENAI_API_KEY,
          dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
        })
      }
    } catch (error) {
      console.error('Failed to initialize OpenAI:', error)
    }
  }

  async generateCustomScript(scenario, state, customizations = {}) {
    if (!this.client) {
      throw new Error('OpenAI not configured')
    }

    try {
      const prompt = this.buildScriptPrompt(scenario, state, customizations)
      
      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a legal expert specializing in civil rights and police interactions. Generate clear, concise, and legally sound scripts for citizens to use during police encounters. Focus on constitutional rights and de-escalation.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.3
      })

      const scriptText = response.choices[0]?.message?.content?.trim()
      
      if (!scriptText) {
        throw new Error('No script generated')
      }

      return {
        scriptId: Date.now().toString(),
        state,
        scenario,
        scriptText,
        language: customizations.language || 'en',
        customizations,
        generatedAt: new Date().toISOString()
      }
    } catch (error) {
      console.error('Script generation failed:', error)
      throw error
    }
  }

  async generateInteractionSummary(interactionData) {
    if (!this.client) {
      // Return a basic summary if OpenAI is not configured
      return this.generateBasicSummary(interactionData)
    }

    try {
      const prompt = this.buildSummaryPrompt(interactionData)
      
      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an assistant that creates concise, factual summaries of police interactions. Focus on key details, timeline, and important observations. Keep summaries professional and objective.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.2
      })

      const summary = response.choices[0]?.message?.content?.trim()
      
      if (!summary) {
        throw new Error('No summary generated')
      }

      return summary
    } catch (error) {
      console.error('Summary generation failed:', error)
      return this.generateBasicSummary(interactionData)
    }
  }

  buildScriptPrompt(scenario, state, customizations) {
    let prompt = `Generate a legal script for a ${scenario} scenario in ${state}. `
    
    prompt += 'The script should:\n'
    prompt += '- Assert constitutional rights clearly\n'
    prompt += '- Remain respectful and non-confrontational\n'
    prompt += '- Be easy to remember under stress\n'
    prompt += '- Include specific phrases for the scenario\n'
    
    if (customizations.tone) {
      prompt += `- Use a ${customizations.tone} tone\n`
    }
    
    if (customizations.specificRights) {
      prompt += `- Emphasize these rights: ${customizations.specificRights.join(', ')}\n`
    }
    
    if (customizations.language && customizations.language !== 'en') {
      prompt += `- Provide the script in ${customizations.language}\n`
    }
    
    prompt += '\nProvide only the script text, enclosed in quotes.'
    
    return prompt
  }

  buildSummaryPrompt(interactionData) {
    let prompt = 'Create a concise summary of this police interaction:\n\n'
    
    prompt += `Scenario: ${interactionData.scenario}\n`
    prompt += `Duration: ${interactionData.duration}\n`
    prompt += `Date/Time: ${new Date(interactionData.timestamp).toLocaleString()}\n`
    
    if (interactionData.notes) {
      prompt += `Notes: ${interactionData.notes}\n`
    }
    
    prompt += '\nProvide a professional summary including:\n'
    prompt += '- Brief overview of the interaction\n'
    prompt += '- Key timeline points\n'
    prompt += '- Important observations\n'
    prompt += '- Any notable details\n'
    prompt += '\nKeep it factual and objective.'
    
    return prompt
  }

  generateBasicSummary(interactionData) {
    const date = new Date(interactionData.timestamp).toLocaleDateString()
    const time = new Date(interactionData.timestamp).toLocaleTimeString()
    
    let summary = `Police Interaction Summary\n\n`
    summary += `Date: ${date}\n`
    summary += `Time: ${time}\n`
    summary += `Scenario: ${interactionData.scenario}\n`
    summary += `Duration: ${interactionData.duration}\n`
    
    if (interactionData.notes) {
      summary += `\nNotes: ${interactionData.notes}\n`
    }
    
    summary += `\nThis interaction was recorded and documented for your records.`
    
    return summary
  }

  // Get available customization options
  getCustomizationOptions() {
    return {
      tones: [
        { value: 'respectful', label: 'Respectful' },
        { value: 'assertive', label: 'Assertive' },
        { value: 'calm', label: 'Calm' },
        { value: 'formal', label: 'Formal' }
      ],
      rights: [
        { value: 'remain_silent', label: 'Right to Remain Silent' },
        { value: 'no_search', label: 'No Consent to Search' },
        { value: 'attorney', label: 'Right to Attorney' },
        { value: 'no_questions', label: 'No Answering Questions' },
        { value: 'record', label: 'Right to Record' }
      ],
      languages: [
        { value: 'en', label: 'English' },
        { value: 'es', label: 'Spanish' },
        { value: 'fr', label: 'French' },
        { value: 'de', label: 'German' }
      ]
    }
  }

  // Check if service is available
  isAvailable() {
    return !!this.client
  }
}

const openaiService = new OpenAIService()
export default openaiService
