/**
 * Stripe Service Module
 * Handles subscription payments and billing for premium features
 */

import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

class StripeService {
  constructor() {
    this.stripe = null
    this.init()
  }

  async init() {
    this.stripe = await stripePromise
  }

  /**
   * Create a checkout session for subscription
   */
  async createCheckoutSession(priceId, userId, successUrl, cancelUrl) {
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId,
          successUrl: successUrl || `${window.location.origin}/subscription/success`,
          cancelUrl: cancelUrl || `${window.location.origin}/subscription/cancel`,
        }),
      })

      const session = await response.json()

      if (session.error) {
        throw new Error(session.error)
      }

      // Redirect to Stripe Checkout
      const result = await this.stripe.redirectToCheckout({
        sessionId: session.id,
      })

      if (result.error) {
        throw new Error(result.error.message)
      }

      return result
    } catch (error) {
      console.error('Stripe checkout error:', error)
      throw error
    }
  }

  /**
   * Create a customer portal session for managing subscriptions
   */
  async createPortalSession(customerId, returnUrl) {
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          returnUrl: returnUrl || window.location.origin,
        }),
      })

      const session = await response.json()

      if (session.error) {
        throw new Error(session.error)
      }

      // Redirect to customer portal
      window.location.href = session.url

      return session
    } catch (error) {
      console.error('Stripe portal error:', error)
      throw error
    }
  }

  /**
   * Get subscription pricing information
   */
  getPricingPlans() {
    return {
      free: {
        id: 'free',
        name: 'Free',
        price: 0,
        interval: null,
        features: [
          'Basic scripts for common scenarios',
          'Audio recording (local storage)',
          'Basic interaction logging',
          'California state laws only'
        ],
        limitations: [
          'Limited to 3 saved scripts',
          'No offline access',
          'No custom script generation',
          'No premium support'
        ]
      },
      monthly: {
        id: 'price_monthly_premium', // Replace with actual Stripe price ID
        name: 'Premium Monthly',
        price: 5,
        interval: 'month',
        features: [
          'All 50 state-specific laws',
          'Unlimited custom script generation',
          'Cloud storage for recordings',
          'Advanced interaction summaries',
          'Offline access',
          'Priority support',
          'Real-time safety alerts',
          'Multi-language support'
        ],
        popular: false
      },
      yearly: {
        id: 'price_yearly_premium', // Replace with actual Stripe price ID
        name: 'Premium Yearly',
        price: 50,
        interval: 'year',
        features: [
          'All Premium Monthly features',
          'Save $10 per year',
          'Extended cloud storage',
          'Advanced analytics',
          'Legal resource library'
        ],
        popular: true,
        savings: '$10/year'
      }
    }
  }

  /**
   * Format price for display
   */
  formatPrice(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  /**
   * Check if user has active subscription
   */
  async checkSubscriptionStatus(userId) {
    try {
      const response = await fetch(`/api/stripe/subscription-status/${userId}`)
      const data = await response.json()
      
      return {
        isActive: data.status === 'active',
        status: data.status,
        currentPeriodEnd: data.current_period_end,
        cancelAtPeriodEnd: data.cancel_at_period_end,
        plan: data.plan
      }
    } catch (error) {
      console.error('Subscription status check error:', error)
      return {
        isActive: false,
        status: 'inactive',
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        plan: 'free'
      }
    }
  }

  /**
   * Cancel subscription at period end
   */
  async cancelSubscription(subscriptionId) {
    try {
      const response = await fetch(`/api/stripe/cancel-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId }),
      })

      const result = await response.json()

      if (result.error) {
        throw new Error(result.error)
      }

      return result
    } catch (error) {
      console.error('Subscription cancellation error:', error)
      throw error
    }
  }

  /**
   * Reactivate a cancelled subscription
   */
  async reactivateSubscription(subscriptionId) {
    try {
      const response = await fetch(`/api/stripe/reactivate-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId }),
      })

      const result = await response.json()

      if (result.error) {
        throw new Error(result.error)
      }

      return result
    } catch (error) {
      console.error('Subscription reactivation error:', error)
      throw error
    }
  }

  /**
   * Handle successful payment
   */
  handlePaymentSuccess(sessionId) {
    // This would typically update the user's subscription status
    // and redirect them to a success page
    console.log('Payment successful:', sessionId)
    
    // Trigger app state update
    window.dispatchEvent(new CustomEvent('subscription-updated', {
      detail: { status: 'active' }
    }))
  }

  /**
   * Handle payment failure
   */
  handlePaymentFailure(error) {
    console.error('Payment failed:', error)
    
    // Show user-friendly error message
    window.dispatchEvent(new CustomEvent('payment-error', {
      detail: { error: error.message }
    }))
  }
}

export default new StripeService()
