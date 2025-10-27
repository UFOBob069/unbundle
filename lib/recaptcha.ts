// Abstracted reCAPTCHA helper - can be swapped for Cloudflare Turnstile
export const getRecaptchaToken = async (action: string = 'submit'): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.grecaptcha) {
      reject(new Error('reCAPTCHA not loaded'))
      return
    }

    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
    if (!siteKey) {
      reject(new Error('reCAPTCHA site key not configured'))
      return
    }

    // For development/testing, return test token
    if (siteKey === '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI') {
      console.log('Using test reCAPTCHA token')
      resolve('test-token')
      return
    }

    window.grecaptcha.ready(() => {
      window.grecaptcha.execute(siteKey, { action })
        .then((token: string) => {
          resolve(token)
        })
        .catch((error: any) => {
          reject(error)
        })
    })
  })
}

// Load reCAPTCHA script
export const loadRecaptcha = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Not in browser environment'))
      return
    }

    if (window.grecaptcha) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`
    script.async = true
    script.defer = true
    
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load reCAPTCHA'))
    
    document.head.appendChild(script)
  })
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}
