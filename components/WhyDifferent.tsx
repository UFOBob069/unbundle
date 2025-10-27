export default function WhyDifferent() {
  const features = [
    {
      title: "Backed & Redeemable",
      description: "Not a meme token",
      icon: "🛡️"
    },
    {
      title: "True SOTP Price Discovery",
      description: "Trade sub-units directly",
      icon: "📊"
    },
    {
      title: "Arb-Enforced Fair Value",
      description: "Mint/burn closes premium/discount gaps",
      icon: "⚖️"
    },
    {
      title: "Institution-Ready",
      description: "Custody partners, offshore SPV, transparent math",
      icon: "🏛️"
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why it's different
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Built for serious investors who understand the value of sum-of-parts analysis
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">{feature.icon}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
