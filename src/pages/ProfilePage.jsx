import React from 'react'
import { User, MapPin, Crown, Settings, FileText, Clock, Star } from 'lucide-react'
import { useApp } from '../context/AppContext'
import ActionButton from '../components/ActionButton'

function ProfilePage() {
  const { state } = useApp()

  const stats = [
    {
      label: 'Saved Scripts',
      value: state.savedScripts.length,
      icon: FileText
    },
    {
      label: 'Recordings',
      value: state.interactions.length,
      icon: Clock
    },
    {
      label: 'Days Active',
      value: '12',
      icon: Star
    }
  ]

  return (
    <div className="container py-6 space-y-8">
      {/* Profile Header */}
      <div className="bg-surface rounded-2xl p-6 shadow-card">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-text">Welcome back!</h1>
            <p className="text-muted">Protecting your rights since today</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="text-center p-3 bg-gray-50 rounded-lg">
              <Icon className="w-5 h-5 text-primary mx-auto mb-1" />
              <div className="text-lg font-bold text-text">{value}</div>
              <div className="text-xs text-muted">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Current State */}
      <div className="bg-surface rounded-lg p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text">Location Settings</h2>
          <Settings className="w-5 h-5 text-muted" />
        </div>
        
        <div className="flex items-center space-x-3 mb-4">
          <MapPin className="w-5 h-5 text-accent" />
          <div>
            <p className="font-medium text-text">Current State: {state.user.currentState}</p>
            <p className="text-sm text-muted">Laws and scripts are customized for California</p>
          </div>
        </div>
        
        <ActionButton variant="secondary" className="w-full">
          Change State
        </ActionButton>
      </div>

      {/* Subscription Status */}
      <div className="bg-surface rounded-lg p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text">Subscription</h2>
          <Crown className={`w-5 h-5 ${state.user.subscriptionStatus === 'premium' ? 'text-accent' : 'text-muted'}`} />
        </div>
        
        {state.user.subscriptionStatus === 'free' ? (
          <div className="space-y-4">
            <div>
              <p className="font-medium text-text">Free Plan</p>
              <p className="text-sm text-muted">Basic scripts and recording features</p>
            </div>
            
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4 border border-primary/20">
              <h3 className="font-bold text-text mb-2">Upgrade to Premium</h3>
              <ul className="text-sm text-muted space-y-1 mb-3">
                <li>• 50+ state-specific scripts</li>
                <li>• Advanced customization</li>
                <li>• Offline access</li>
                <li>• Priority support</li>
              </ul>
              <ActionButton variant="primary" className="w-full">
                Start Free Trial - $5/month
              </ActionButton>
            </div>
          </div>
        ) : (
          <div>
            <p className="font-medium text-text">Premium Plan</p>
            <p className="text-sm text-muted">Active until December 2024</p>
            <ActionButton variant="secondary" className="w-full mt-3">
              Manage Subscription
            </ActionButton>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-text">Quick Actions</h2>
        
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-4 bg-surface rounded-lg shadow-card hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-primary" />
              <span className="font-medium text-text">Saved Scripts</span>
            </div>
            <span className="text-muted">→</span>
          </button>
          
          <button className="w-full flex items-center justify-between p-4 bg-surface rounded-lg shadow-card hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-primary" />
              <span className="font-medium text-text">Recording History</span>
            </div>
            <span className="text-muted">→</span>
          </button>
          
          <button className="w-full flex items-center justify-between p-4 bg-surface rounded-lg shadow-card hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5 text-primary" />
              <span className="font-medium text-text">App Settings</span>
            </div>
            <span className="text-muted">→</span>
          </button>
        </div>
      </div>

      {/* Support */}
      <div className="bg-surface rounded-lg p-6 shadow-card">
        <h2 className="text-lg font-bold text-text mb-4">Need Help?</h2>
        <p className="text-muted mb-4">
          Get support, report issues, or learn more about your rights.
        </p>
        <div className="space-y-2">
          <ActionButton variant="secondary" className="w-full">
            Contact Support
          </ActionButton>
          <ActionButton variant="secondary" className="w-full">
            Legal Resources
          </ActionButton>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage