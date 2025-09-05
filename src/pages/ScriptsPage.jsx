import React, { useState } from 'react'
import { Search, Filter, Plus, Sparkles, Globe, FileText } from 'lucide-react'
import { useApp } from '../context/AppContext'
import ScriptCard from '../components/ScriptCard'
import ActionButton from '../components/ActionButton'
import openaiService from '../services/openai'

function ScriptsPage() {
  const { state, dispatch } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showCustomGenerator, setShowCustomGenerator] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [customScenario, setCustomScenario] = useState('')
  const [selectedState, setSelectedState] = useState(state.user.currentState)
  const [selectedTone, setSelectedTone] = useState('respectful')

  const categories = [
    { id: 'all', label: 'All Scripts' },
    { id: 'traffic', label: 'Traffic Stop' },
    { id: 'door', label: 'Door Knock' },
    { id: 'street', label: 'Street Encounter' },
    { id: 'search', label: 'Search Situations' }
  ]

  const filteredScripts = state.scripts.filter(script => {
    const matchesSearch = script.scenario.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         script.scriptText.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || 
                           script.scenario.toLowerCase().includes(selectedCategory)
    return matchesSearch && matchesCategory
  })

  const generateCustomScript = async () => {
    if (!customScenario.trim()) return

    setIsGenerating(true)

    try {
      const customization = {
        tone: selectedTone,
        language: 'en'
      }

      const generatedScript = await openaiService.generateScript(
        customScenario,
        selectedState,
        customization
      )

      // Create new script object
      const newScript = {
        scriptId: Date.now().toString(),
        state: selectedState,
        scenario: customScenario,
        scriptText: generatedScript.script,
        language: 'en',
        isCustom: true,
        keyPoints: generatedScript.keyPoints,
        avoidSaying: generatedScript.avoidSaying,
        stateSpecific: generatedScript.stateSpecific
      }

      // Add to scripts
      dispatch({ type: 'ADD_SCRIPT', payload: newScript })

      // Reset form
      setCustomScenario('')
      setShowCustomGenerator(false)
    } catch (error) {
      console.error('Script generation failed:', error)
      alert('Failed to generate script. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const stateOptions = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ]

  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text">Legal Scripts</h1>
          <ActionButton 
            variant="primary" 
            size="sm"
            onClick={() => setShowCustomGenerator(true)}
            disabled={state.user.subscriptionStatus === 'free'}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {state.user.subscriptionStatus === 'premium' ? 'Generate Custom' : 'Premium Feature'}
          </ActionButton>
        </div>
        
        <p className="text-muted">
          Ready-to-use scripts for common police interaction scenarios
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search scripts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-surface border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary text-white'
                  : 'bg-surface text-muted border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scripts List */}
      <div className="space-y-4">
        {filteredScripts.length > 0 ? (
          filteredScripts.map(script => (
            <ScriptCard key={script.scriptId} script={script} />
          ))
        ) : (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text mb-2">No scripts found</h3>
            <p className="text-muted mb-4">
              Try adjusting your search or filters
            </p>
            <ActionButton variant="primary">
              Generate Custom Script
            </ActionButton>
          </div>
        )}
      </div>

      {/* Premium Prompt */}
      {state.user.subscriptionStatus === 'free' && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="text-center">
            <h3 className="font-bold text-text mb-2">Want More Scripts?</h3>
            <p className="text-sm text-muted mb-3">
              Get access to 50+ state-specific scripts with Premium
            </p>
            <ActionButton variant="primary" size="sm">
              Upgrade Now
            </ActionButton>
          </div>
        </div>
      )}

      {/* Custom Script Generator Modal */}
      {showCustomGenerator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-2xl p-6 w-full max-w-md space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-text">Generate Custom Script</h2>
              <button
                onClick={() => setShowCustomGenerator(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Scenario Description
                </label>
                <textarea
                  value={customScenario}
                  onChange={(e) => setCustomScenario(e.target.value)}
                  placeholder="Describe the specific situation you need a script for..."
                  className="w-full h-24 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    State
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {stateOptions.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Tone
                  </label>
                  <select
                    value={selectedTone}
                    onChange={(e) => setSelectedTone(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="respectful">Respectful</option>
                    <option value="formal">Formal</option>
                    <option value="conversational">Conversational</option>
                    <option value="assertive">Assertive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <ActionButton
                variant="secondary"
                onClick={() => setShowCustomGenerator(false)}
                className="flex-1"
              >
                Cancel
              </ActionButton>
              <ActionButton
                variant="primary"
                onClick={generateCustomScript}
                disabled={isGenerating || !customScenario.trim()}
                className="flex-1"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate
                  </>
                )}
              </ActionButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ScriptsPage
