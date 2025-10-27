'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { httpsCallable } from 'firebase/functions'
import { getFirebaseFunctions } from '@/lib/firebase'
import { loadRecaptcha, getRecaptchaToken } from '@/lib/recaptcha'
import { trackEvent } from '@/lib/analytics'
import { cn } from '@/lib/utils'

const waitlistSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['Investor', 'Builder', 'Trader', 'Other'], {
    required_error: 'Please select your role',
  }),
  referrer: z.string().optional(),
  notes: z.string().max(280, 'Notes must be 280 characters or less').optional(),
})

type WaitlistFormData = z.infer<typeof waitlistSchema>

interface WaitlistFormProps {
  className?: string
}

export default function WaitlistForm({ className }: WaitlistFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
  })

  useEffect(() => {
    loadRecaptcha().catch(console.error)
  }, [])

  const onSubmit = async (data: WaitlistFormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      // Get reCAPTCHA token
      const recaptchaToken = await getRecaptchaToken('waitlist_submit')

      // Call Firebase function
      const functions = getFirebaseFunctions()
      const joinWaitlist = httpsCallable(functions, 'joinWaitlist')

      const result = await joinWaitlist({
        email: data.email.toLowerCase().trim(),
        role: data.role,
        referrer: data.referrer?.trim() || undefined,
        notes: data.notes?.trim() || undefined,
        recaptchaToken,
        userAgent: navigator.userAgent,
      })

      // Track success
      trackEvent('waitlist_submitted', {
        email: data.email,
        role: data.role,
        referrer: data.referrer,
      })

      setSubmitStatus('success')
      reset()

      // Redirect to thanks page
      setTimeout(() => {
        window.location.href = '/thanks'
      }, 1500)

    } catch (error: any) {
      console.error('Waitlist submission error:', error)
      setSubmitStatus('error')
      
      if (error.code === 'functions/unauthenticated') {
        setErrorMessage('Please verify you are human and try again.')
      } else if (error.code === 'functions/invalid-argument') {
        setErrorMessage('Please check your information and try again.')
      } else {
        setErrorMessage('Something went wrong. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div id="waitlist-form" className={cn('w-full max-w-md mx-auto', className)}>
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Join the Waitlist
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className={cn(
                'input-field',
                errors.email && 'border-red-500 focus:ring-red-500'
              )}
              placeholder="your@email.com"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Role *
            </label>
            <select
              {...register('role')}
              id="role"
              className={cn(
                'input-field',
                errors.role && 'border-red-500 focus:ring-red-500'
              )}
              disabled={isSubmitting}
            >
              <option value="">Select your role</option>
              <option value="Investor">Investor</option>
              <option value="Builder">Builder</option>
              <option value="Trader">Trader</option>
              <option value="Other">Other</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          {/* Referrer */}
          <div>
            <label htmlFor="referrer" className="block text-sm font-medium text-gray-700 mb-2">
              How did you hear about us?
            </label>
            <input
              {...register('referrer')}
              type="text"
              id="referrer"
              className="input-field"
              placeholder="Twitter, friend, etc."
              disabled={isSubmitting}
            />
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (optional)
            </label>
            <textarea
              {...register('notes')}
              id="notes"
              rows={3}
              className={cn(
                'input-field resize-none',
                errors.notes && 'border-red-500 focus:ring-red-500'
              )}
              placeholder="Tell us more about your interest..."
              disabled={isSubmitting}
            />
            {errors.notes && (
              <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary"
          >
            {isSubmitting ? 'Joining...' : 'Join Waitlist'}
          </button>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-green-800 text-sm">
                ✅ Success! Redirecting to confirmation page...
              </p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-800 text-sm">
                ❌ {errorMessage}
              </p>
            </div>
          )}

          {/* Privacy Note */}
          <p className="text-xs text-gray-500 text-center mt-4">
            We'll only email you about access. No spam.
          </p>
        </form>
      </div>
    </div>
  )
}
