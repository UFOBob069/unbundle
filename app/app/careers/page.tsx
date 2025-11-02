import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Join Unbundle Finance — Founding Team',
  description: 'We\'re building the first backed and redeemable protocol that lets investors trade the parts, not just the whole. Join our founding team.',
}

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />
      
      {/* Header */}
      <section className="pt-20 pb-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Join Unbundle
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              We're building the first backed and redeemable protocol that lets investors trade the parts, not just the whole.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              If you're obsessed with markets, crypto, and building real financial infrastructure, let's talk.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
              <p className="text-gray-700 font-medium">
                We're currently forming the founding team — early hires receive meaningful equity and shape the future of the product.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            
            {/* Technical Co-Founder */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">🔹 Technical Co-Founder / Head of Engineering</h2>
                <div className="text-sm text-gray-500 text-right">
                  <div>Remote | Founding role</div>
                  <div className="font-semibold text-blue-600">Significant equity</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                We're looking for a crypto-native engineer who wants to help architect the future of on-chain finance.
              </p>
              <p className="text-gray-700 mb-4">
                Build the smart-contract core, custody integrations, and mint/redeem mechanics that make Unbundle work.
              </p>
              <p className="text-gray-600 mb-4">
                Experience with Solana or Ethereum, custody APIs, and financial protocols preferred.
              </p>
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold text-gray-900">You'll own:</span> protocol architecture, custody integrations, and audits.</p>
                <p><span className="font-semibold text-gray-900">Stack:</span> Rust, Solidity, TypeScript.</p>
                <p><span className="font-semibold text-gray-900">Equity:</span> founder-level.</p>
              </div>
            </div>

            {/* Quant Engineer */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">🔹 Quant / Mechanism Engineer</h2>
                <div className="text-sm text-gray-500 text-right">
                  <div>Remote | Early hire</div>
                  <div className="font-semibold text-blue-600">Equity + comp</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Help design the on-chain mint/burn, arbitrage, and pricing mechanisms that keep Unbundle in balance.
              </p>
              <p className="text-gray-700 mb-4">
                Work closely with liquidity partners and custody APIs to ensure the sum of the parts always equals the whole.
              </p>
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold text-gray-900">Ideal for:</span> quants, HFT devs, or DeFi engineers with arb or AMM experience.</p>
                <p><span className="font-semibold text-gray-900">Bonus:</span> exposure to ETF or derivatives math.</p>
              </div>
            </div>

            {/* Product Designer */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">🔹 Product Designer (Fintech x DeFi)</h2>
                <div className="text-sm text-gray-500 text-right">
                  <div>Remote | Design ownership</div>
                  <div className="font-semibold text-blue-600">Early equity</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Take complex financial primitives and make them simple, intuitive, and beautiful.
              </p>
              <p className="text-gray-700 mb-4">
                You'll design the interfaces that make Unbundle as trustworthy and elegant as Stripe — for crypto.
              </p>
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold text-gray-900">You'll own:</span> user flows, UI/UX, and visual identity.</p>
                <p><span className="font-semibold text-gray-900">Style:</span> minimal, institutional, confident.</p>
              </div>
            </div>

            {/* Head of Partnerships */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">🔹 Head of Partnerships / BD</h2>
                <div className="text-sm text-gray-500 text-right">
                  <div>Remote | Hybrid role</div>
                  <div className="font-semibold text-blue-600">Equity + comp</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Bridge the traditional and the on-chain world.
              </p>
              <p className="text-gray-700 mb-4">
                Own relationships with funds, custody partners, and liquidity providers who will power Unbundle's first $100M in AUM.
              </p>
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold text-gray-900">You'll lead:</span> partner onboarding, liquidity incentives, and fund integrations.</p>
                <p><span className="font-semibold text-gray-900">Ideal background:</span> DeFi BD or ETF institutional relationships.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How to Apply */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">How to Apply</h2>
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm max-w-2xl mx-auto">
              <p className="text-lg text-gray-700 mb-6">
                Email <a href="mailto:founders@unbundlefinance.com" className="text-blue-600 hover:text-blue-700 font-semibold">founders@unbundlefinance.com</a> with:
              </p>
              <ul className="text-left space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3">•</span>
                  <span>Short intro</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3">•</span>
                  <span>What excites you about Unbundle</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3">•</span>
                  <span>Links (GitHub, design work, LinkedIn, etc.)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
