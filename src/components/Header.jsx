import React from 'react'
import { Shield, Settings } from 'lucide-react'

function Header() {
  return (
    <header className="bg-surface shadow-card border-b border-gray-100 sticky top-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-text">KnowYourRights</h1>
              <p className="text-xs text-muted">Buddy</p>
            </div>
          </div>
          
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-muted" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header