import React from 'react'
import { Shield, Mic, FileText, Star, MapPin } from 'lucide-react'
import { useApp } from '../context/AppContext'
import ActionButton from '../components/ActionButton'
import ScriptCard from '../components/ScriptCard'

function HomePage() {
  const { state } = useApp()
  const featuredScripts = state.scripts.slice(0, 2)

  return (
    <div className="container py-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary rounded-2xl mx-auto flex items-center justify-center">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text mb-2">
            Know Your Rights
          </h1>
          <p className="text-muted max-w-sm mx-auto">
            Your pocket guide to understanding your rights during police interactions
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-surface rounded-lg p-6 shadow-card border border-gray-100">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Mic className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-text">Quick Record</h3>
              <p className="text-sm text-muted">Start recording instantly</p>
            </div>
          </div>
          <ActionButton variant="danger" className="w-full">
            Start Recording
          </ActionButton>
        </div>

        <div className="bg-surface rounded-lg p-6 shadow-card border border-gray-100">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-text">Browse Scripts</h3>
              <p className="text-sm text-muted">Find the right words</p>
            </div>
          </div>
          <ActionButton variant="primary" className="w-full">
            View Scripts
          </ActionButton>
        </div>
      </div>

      {/* State Info */}
      <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <MapPin className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-accent">Current State: {state.user.currentState}</span>
        </div>
        <p className="text-sm text-text">
          Scripts and information are tailored for California law. 
          <button className="text-accent font-medium ml-1 hover:underline">
            Change state
          </button>
        </p>
      </div>

      {/* Featured Scripts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-text">Featured Scripts</h2>
          <ActionButton variant="secondary" size="sm">
            View All
          </ActionButton>
        </div>
        
        <div className="space-y-3">
          {featuredScripts.map(script => (
            <ScriptCard key={script.scriptId} script={script} variant="collapsed" />
          ))}
        </div>
      </div>

      {/* Subscription Prompt */}
      {state.user.subscriptionStatus === 'free' && (
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 border border-primary/20">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Star className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-text mb-1">Upgrade to Premium</h3>
              <p className="text-sm text-muted mb-3">
                Get access to all state laws, advanced customization, and offline access.
              </p>
              <ActionButton variant="primary" size="sm">
                Start Free Trial
              </ActionButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage