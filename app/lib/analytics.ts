import posthog from 'posthog-js'

let isInitialized = false

export const initPostHog = () => {
  if (typeof window !== 'undefined' && !isInitialized) {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'
    
    if (posthogKey) {
      posthog.init(posthogKey, {
        api_host: posthogHost,
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') {
            posthog.debug()
          }
        },
      })
      isInitialized = true
    }
  }
}

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && isInitialized) {
    posthog.capture(eventName, properties)
  }
}

export const identifyUser = (email: string) => {
  if (typeof window !== 'undefined' && isInitialized) {
    posthog.identify(email)
  }
}
