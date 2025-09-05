import { loadStripe } from '@stripe/stripe-js'

class StripeService {
  constructor() {
    this.stripe = null
    this.init()
  }

  async init() {
    try {
      this.stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
    } catch (error) {
      console.error('Failed to initialize Stripe:', error)
    }
  }

  getPricingPlans() {
    return [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        interval: 'month',
        description: 'Basic features for personal use',
        features: [
          'Basic legal scripts',
          'Local audio recording',
          'Basic interaction logging',
          'State-specific guidance'
        ],
        priceId: null,
        popular: false
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 9.99,
        interval: 'month',
        description: 'Advanced features for power users',
        features: [
          'Unlimited custom scripts',
          'Cloud storage for recordings',
          'AI-powered summaries',
          'Advanced customization',
          'Priority support',
          'Offline access'
        ],
        priceId: 'price_premium_monthly',
        popular: true
      }
    ]
  }

  async checkSubscriptionStatus(userId) {
    try {
      // In a real app, this would call your backend API
      // For now, return mock data
      return {
        status: 'free',
        customerId: null,
        subscriptionId: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false
      }
    } catch (error) {
      console.error('Failed to check subscription status:', error)
      throw error
    }
  }

  async createCheckoutSession(priceId, userId) {
    try {
      // In a real app, this would call your backend to create a Stripe checkout session
      // For demo purposes, we'll just redirect to a mock URL
      const checkoutUrl = `https://checkout.stripe.com/pay/cs_test_${priceId}_${userId}`
      window.location.href = checkoutUrl
    } catch (error) {
      console.error('Failed to create checkout session:', error)
      throw error
    }
  }

  async createPortalSession(customerId) {
    try {
      // In a real app, this would call your backend to create a customer portal session
      const portalUrl = `https://billing.stripe.com/p/session/${customerId}`
      window.location.href = portalUrl
    } catch (error) {
      console.error('Failed to create portal session:', error)
      throw error
    }
  }

  async cancelSubscription(subscriptionId) {
    try {
      // In a real app, this would call your backend API
      console.log('Cancelling subscription:', subscriptionId)
      return { success: true }
    } catch (error) {
      console.error('Failed to cancel subscription:', error)
      throw error
    }
  }

  async reactivateSubscription(subscriptionId) {
    try {
      // In a real app, this would call your backend API
      console.log('Reactivating subscription:', subscriptionId)
      return { success: true }
    } catch (error) {
      console.error('Failed to reactivate subscription:', error)
      throw error
    }
  }
}

const stripeService = new StripeService()
export default stripeService
