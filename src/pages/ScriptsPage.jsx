import React, { useState } from 'react'
import { Search, Filter, Plus } from 'lucide-react'
import { useApp } from '../context/AppContext'
import ScriptCard from '../components/ScriptCard'
import ActionButton from '../components/ActionButton'

function ScriptsPage() {
  const { state } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

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

  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text">Legal Scripts</h1>
          <ActionButton variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Generate
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
    </div>
  )
}

export default ScriptsPage