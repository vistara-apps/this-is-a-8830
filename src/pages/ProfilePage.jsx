import React, { useState, useEffect } from 'react'
import { User, MapPin, Crown, Settings, FileText, Clock, Star, CreditCard, Shield } from 'lucide-react'
import { useApp } from '../context/AppContext'
import ActionButton from '../components/ActionButton'
import stripeService from '../services/stripe'

function ProfilePage() {
  const { state, dispatch } = useApp()
  const [showPricing, setShowPricing] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

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

  const pricingPlans = stripeService.getPricingPlans()

  useEffect(() => {
    // Load subscription status on component mount
    loadSubscriptionStatus()
  }, [])

  const loadSubscriptionStatus = async () => {
    if (state.user.userId) {
      try {
        const status = await stripeService.checkSubscriptionStatus(state.user.userId)
        setSubscriptionStatus(status)
      } catch (error) {
        console.error('Failed to load subscription status:', error)
      }
    }
  }

  const handleUpgrade = async (priceId) => {
    setIsLoading(true)
    try {
      await stripeService.createCheckoutSession(priceId, state.user.userId)
    } catch (error) {
      console.error('Upgrade failed:', error)
      alert('Failed to start upgrade process. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    if (subscriptionStatus?.customerId) {
      try {
        await stripeService.createPortalSession(subscriptionStatus.customerId)
      } catch (error) {
        console.error('Failed to open customer portal:', error)
        alert('Failed to open subscription management. Please try again.')
      }
    }
  }

  const handleCancelSubscription = async () => {
    if (subscriptionStatus?.subscriptionId) {
      const confirmed = window.confirm(
        'Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.'
      )
      
      if (confirmed) {
        try {
          await stripeService.cancelSubscription(subscriptionStatus.subscriptionId)
          await loadSubscriptionStatus() // Refresh status
          alert('Subscription cancelled successfully.')
        } catch (error) {
          console.error('Cancellation failed:', error)
          alert('Failed to cancel subscription. Please try again.')
        }
      }
    }
  }

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
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium text-text mb-1">Upgrade to Premium</h3>
                  <p className="text-sm text-muted mb-3">
                    Get unlimited custom scripts, cloud storage, and advanced features
                  </p>
                  <ActionButton 
                    variant="primary" 
                    size="sm"
                    onClick={() => setShowPricing(true)}
                    disabled={isLoading}
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    View Plans
                  </ActionButton>
                </div>
              </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="font-medium text-text flex items-center">
                <Crown className="w-4 h-4 text-accent mr-2" />
                Premium Plan
              </p>
              <p className="text-sm text-muted">
                {subscriptionStatus?.currentPeriodEnd 
                  ? `Active until ${new Date(subscriptionStatus.currentPeriodEnd * 1000).toLocaleDateString()}`
                  : 'Premium features enabled'
                }
              </p>
            </div>
            
            <div className="flex space-x-2">
              <ActionButton 
                variant="secondary" 
                className="flex-1"
                onClick={handleManageSubscription}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Manage Billing
              </ActionButton>
              
              {subscriptionStatus?.cancelAtPeriodEnd ? (
                <ActionButton 
                  variant="primary" 
                  className="flex-1"
                  onClick={() => stripeService.reactivateSubscription(subscriptionStatus.subscriptionId)}
                >
                  Reactivate
                </ActionButton>
              ) : (
                <ActionButton 
                  variant="secondary" 
                  className="flex-1"
                  onClick={handleCancelSubscription}
                >
                  Cancel
                </ActionButton>
              )}
            </div>
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

      {/* Pricing Modal */}
      {showPricing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text">Choose Your Plan</h2>
              <button
                onClick={() => setShowPricing(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                ×
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`border-2 rounded-2xl p-6 ${
                    plan.popular 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-200 bg-surface'
                  }`}
                >
                  {plan.popular && (
                    <div className="bg-primary text-white text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-text mb-2">{plan.name}</h3>
                    <div className="flex items-baseline mb-2">
                      <span className="text-3xl font-bold text-text">${plan.price}</span>
                      <span className="text-muted ml-1">/{plan.interval}</span>
                    </div>
                    <p className="text-sm text-muted">{plan.description}</p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-accent"></div>
                        </div>
                        <span className="text-sm text-text">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <ActionButton
                    variant={plan.popular ? "primary" : "secondary"}
                    className="w-full"
                    onClick={() => handleUpgrade(plan.priceId)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      `Choose ${plan.name}`
                    )}
                  </ActionButton>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted">
                All plans include a 7-day free trial. Cancel anytime.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage
