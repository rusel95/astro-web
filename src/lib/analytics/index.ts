import { posthog } from '../posthog'
import type { AnalyticsEvent } from './events'

interface EventProperties {
  [key: string]: string | number | boolean | null | undefined
}

export function track(
  event: AnalyticsEvent | string,
  properties?: EventProperties
) {
  // PostHog
  if (typeof window !== 'undefined' && posthog) {
    posthog.capture(event, properties)
  }
  
  // Development logging
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Analytics:', event, properties)
  }
}

// User identification
export function identifyUser(userId: string, traits?: Record<string, any>) {
  if (typeof window !== 'undefined' && posthog) {
    posthog.identify(userId, traits)
  }
}

// Reset on logout
export function resetUser() {
  if (typeof window !== 'undefined' && posthog) {
    posthog.reset()
  }
}

// Set user properties
export function setUserProperties(properties: Record<string, any>) {
  if (typeof window !== 'undefined' && posthog) {
    posthog.people.set(properties)
  }
}

// Track first-time actions
export function trackFirstTime(action: string) {
  const key = `first_${action}`
  
  if (typeof window === 'undefined') return
  
  const hasTracked = localStorage.getItem(key)
  
  if (!hasTracked) {
    track(`first_${action}`, {
      timestamp: new Date().toISOString()
    })
    
    localStorage.setItem(key, 'true')
    
    // Set user property
    if (posthog) {
      posthog.people.set({
        [`first_${action}_at`]: new Date().toISOString()
      })
    }
  }
}

// Export all
export * from './events'
