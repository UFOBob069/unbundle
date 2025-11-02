'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { trackEvent } from '@/lib/analytics'

export default function ThanksPage() {
  useEffect(() => {
    trackEvent('thanks_page_viewed')
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="card text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-green-600 text-3xl">✓</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            You're on the list!
          </h1>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            Thank you for joining the Unbundle Finance waitlist. We'll be in touch soon with updates on our launch and early access opportunities.
          </p>
          
          <div className="space-y-4">
            <Link href="/" className="btn-primary w-full">
              Back to Home
            </Link>
            
            <p className="text-sm text-gray-500">
              Questions? Reach out to{' '}
              <a 
                href="mailto:hello@unbundlefinance.com" 
                className="text-blue-600 hover:text-blue-700"
              >
                hello@unbundlefinance.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
