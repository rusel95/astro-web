import posthog from 'posthog-js'

export function initPostHog() {
  if (typeof window === 'undefined') return
  
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    console.warn('PostHog key not found')
    return
  }
  
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    
    // Privacy settings
    respect_dnt: true,
    opt_out_capturing_by_default: false,
    
    // Performance
    autocapture: false, // Manual tracking only
    capture_pageview: false, // We'll do it manually
    
    // Session recordings (optional, can be privacy concern)
    disable_session_recording: !process.env.NEXT_PUBLIC_ENABLE_SESSION_RECORDING,
    
    // Advanced
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') {
        posthog.debug()
      }
    }
  })
}

export { posthog }
