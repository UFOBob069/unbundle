'use client'

import { useEffect } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import WaitlistForm from '@/components/WaitlistForm'
import Examples from '@/components/Examples'
import HowItWorks from '@/components/HowItWorks'
import WhyDifferent from '@/components/WhyDifferent'
import UseCases from '@/components/UseCases'
import { initPostHog } from '@/lib/analytics'

export default function HomePage() {
  useEffect(() => {
    initPostHog()
  }, [])

  const scrollToForm = () => {
    const formElement = document.getElementById('waitlist-form')
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen">
      <Nav />
      
      {/* Hero Section */}
      <section className="gradient-bg pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Unbundle Finance
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
              Deposit SPY or GOOGL. Mint the pieces. Trade or redeem on-chain.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={scrollToForm}
                className="btn-primary text-lg px-8 py-4"
              >
                Join the waitlist
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tagline Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Trade the parts, not just the whole.
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Unbundle lets you deposit ETFs or stocks and mint tradeable component tokens — backed and redeemable — so price discovery finally happens at the sum-of-the-parts level.
          </p>
        </div>
      </section>

      <HowItWorks onCtaClick={scrollToForm} />
      <WhyDifferent />
      <Examples />
      <UseCases />

      {/* Waitlist Form Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to get started?
            </h2>
            <p className="text-lg text-gray-600">
              Join our waitlist to be among the first to access Unbundle Finance
            </p>
          </div>
          <WaitlistForm />
        </div>
      </section>

      <Footer />
    </div>
  )
}
