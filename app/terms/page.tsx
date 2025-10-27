import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - Unbundle Finance',
  description: 'Terms of Service for Unbundle Finance',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
          </p>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptance of Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing or using Unbundle Finance services, you agree to be bound by these Terms of Service 
                and all applicable laws and regulations.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description of Service</h2>
              <p className="text-gray-600 leading-relaxed">
                Unbundle Finance provides a platform for tokenizing and trading components of ETFs and individual stocks. 
                Our service allows users to deposit assets, mint component tokens, and trade or redeem them according to 
                the terms of our smart contracts and custody arrangements.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">User Responsibilities</h2>
              <p className="text-gray-600 leading-relaxed">
                Users are responsible for ensuring compliance with all applicable laws and regulations in their jurisdiction. 
                Users must provide accurate information and are responsible for maintaining the security of their accounts.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
              <p className="text-gray-600 leading-relaxed">
                Unbundle Finance, Ltd. shall not be liable for any indirect, incidental, special, consequential, or punitive 
                damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-600 leading-relaxed">
                For questions about these Terms of Service, please contact us at{' '}
                <a href="mailto:legal@unbundlefinance.com" className="text-blue-600 hover:text-blue-700">
                  legal@unbundlefinance.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
