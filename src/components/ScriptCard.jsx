import React from 'react'
import { clsx } from 'clsx'
import { ChevronRight, Bookmark, BookmarkPlus } from 'lucide-react'
import { useApp } from '../context/AppContext'
import ActionButton from './ActionButton'

function ScriptCard({ script, variant = 'default', onSelect }) {
  const { state, dispatch } = useApp()
  const isExpanded = variant === 'default'
  const isSaved = state.savedScripts.some(saved => saved.scriptId === script.scriptId)

  const handleSave = (e) => {
    e.stopPropagation()
    if (!isSaved) {
      dispatch({
        type: 'SAVE_SCRIPT',
        payload: {
          savedScriptId: Date.now().toString(),
          userId: state.user.userId,
          scriptId: script.scriptId,
          customNotes: ''
        }
      })
    }
  }

  const handleSelect = () => {
    dispatch({ type: 'SELECT_SCRIPT', payload: script })
    if (onSelect) onSelect(script)
  }

  return (
    <div 
      className={clsx(
        "bg-surface rounded-lg border border-gray-100 shadow-card transition-all duration-150 hover:shadow-lg cursor-pointer",
        "p-4 space-y-3"
      )}
      onClick={handleSelect}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-text mb-1">{script.scenario}</h3>
          <p className="text-sm text-muted">{script.state} • English</p>
        </div>
        
        <div className="flex items-center space-x-2 ml-3">
          <button
            onClick={handleSave}
            className={clsx(
              "p-1.5 rounded-md transition-colors",
              isSaved 
                ? "text-accent bg-accent/10" 
                : "text-muted hover:text-accent hover:bg-accent/10"
            )}
          >
            {isSaved ? (
              <BookmarkPlus className="w-4 h-4" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
          
          <ChevronRight className="w-4 h-4 text-muted" />
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-text leading-relaxed">
              {script.scriptText}
            </p>
          </div>
          
          <div className="flex space-x-2">
            <ActionButton variant="primary" size="sm" className="flex-1">
              Use This Script
            </ActionButton>
            <ActionButton variant="secondary" size="sm">
              Customize
            </ActionButton>
          </div>
        </div>
      )}
    </div>
  )
}

export default ScriptCard
