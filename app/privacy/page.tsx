import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - Unbundle Finance',
  description: 'Privacy Policy for Unbundle Finance',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
          </p>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
              <p className="text-gray-600 leading-relaxed">
                We collect information you provide directly to us, such as when you join our waitlist, 
                including your email address, role, referrer information, and any additional notes you choose to provide.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
              <p className="text-gray-600 leading-relaxed">
                We use the information we collect to communicate with you about Unbundle Finance updates, 
                early access opportunities, and relevant product information. We do not sell or share your 
                personal information with third parties for marketing purposes.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
              <p className="text-gray-600 leading-relaxed">
                We implement appropriate security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:privacy@unbundlefinance.com" className="text-blue-600 hover:text-blue-700">
                  privacy@unbundlefinance.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
