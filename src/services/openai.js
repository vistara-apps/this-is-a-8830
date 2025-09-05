/**
 * OpenAI Service Module
 * Handles AI-powered script generation for legal scenarios
 */

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, this should be handled server-side
})

class OpenAIService {
  constructor() {
    this.model = 'gpt-3.5-turbo'
  }

  /**
   * Generate a legal script for a specific scenario and state
   */
  async generateScript(scenario, state, customization = {}) {
    const { tone = 'respectful', language = 'en', specificSituation = '' } = customization

    const systemPrompt = `You are a legal expert specializing in civil rights and police interactions. Generate clear, concise scripts that help individuals assert their constitutional rights during police encounters. 

    IMPORTANT GUIDELINES:
    - Always emphasize remaining calm and respectful
    - Include specific constitutional rights (4th, 5th, 6th amendments)
    - Provide state-specific guidance when relevant
    - Keep language simple and memorable
    - Focus on de-escalation while asserting rights
    - Never advise resistance or confrontation
    - Include phrases that clearly establish consent/non-consent`

    const userPrompt = `Generate a script for the following scenario:
    
    Scenario: ${scenario}
    State: ${state}
    Tone: ${tone}
    Language: ${language}
    ${specificSituation ? `Specific situation: ${specificSituation}` : ''}
    
    Please provide:
    1. A clear, concise script (2-3 sentences max)
    2. Key points to remember
    3. What NOT to say
    4. State-specific considerations for ${state}
    
    Format the response as JSON with the following structure:
    {
      "script": "The main script text",
      "keyPoints": ["point1", "point2", "point3"],
      "avoidSaying": ["avoid1", "avoid2", "avoid3"],
      "stateSpecific": "State-specific legal considerations",
      "scenario": "${scenario}",
      "state": "${state}"
    }`

    try {
      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3, // Lower temperature for more consistent legal advice
        max_tokens: 1000
      })

      const response = completion.choices[0].message.content
      
      // Try to parse JSON response
      try {
        return JSON.parse(response)
      } catch (parseError) {
        // Fallback if JSON parsing fails
        return {
          script: response,
          keyPoints: ['Remain calm and respectful', 'Assert your rights clearly', 'Do not consent to searches'],
          avoidSaying: ['Arguing or being confrontational', 'Admitting guilt', 'Providing unnecessary information'],
          stateSpecific: `Please consult ${state} state laws for specific regulations.`,
          scenario,
          state
        }
      }
    } catch (error) {
      console.error('OpenAI API error:', error)
      throw new Error('Failed to generate script. Please try again.')
    }
  }

  /**
   * Generate multiple script variations for A/B testing
   */
  async generateScriptVariations(scenario, state, count = 3) {
    const variations = []
    
    for (let i = 0; i < count; i++) {
      try {
        const customization = {
          tone: i === 0 ? 'formal' : i === 1 ? 'conversational' : 'assertive'
        }
        const script = await this.generateScript(scenario, state, customization)
        variations.push({
          ...script,
          variation: i + 1,
          tone: customization.tone
        })
      } catch (error) {
        console.error(`Failed to generate variation ${i + 1}:`, error)
      }
    }
    
    return variations
  }

  /**
   * Translate a script to another language
   */
  async translateScript(scriptText, targetLanguage = 'es') {
    const prompt = `Translate the following legal script to ${targetLanguage}, maintaining the legal accuracy and respectful tone:

    "${scriptText}"
    
    Provide only the translated text, ensuring it maintains the same legal meaning and respectful tone.`

    try {
      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 500
      })

      return completion.choices[0].message.content.trim()
    } catch (error) {
      console.error('Translation error:', error)
      throw new Error('Failed to translate script. Please try again.')
    }
  }

  /**
   * Generate a summary of an interaction for sharing
   */
  async generateInteractionSummary(interactionData) {
    const { scenario, duration, notes, timestamp } = interactionData

    const prompt = `Generate a concise, professional summary of a police interaction for documentation purposes:

    Scenario: ${scenario}
    Duration: ${duration}
    Timestamp: ${timestamp}
    Notes: ${notes}
    
    Create a brief, factual summary suitable for sharing with legal counsel or for personal records. Keep it professional and objective.`

    try {
      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.1, // Very low temperature for factual summaries
        max_tokens: 300
      })

      return completion.choices[0].message.content.trim()
    } catch (error) {
      console.error('Summary generation error:', error)
      throw new Error('Failed to generate summary. Please try again.')
    }
  }
}

export default new OpenAIService()
