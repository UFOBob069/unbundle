export default function UseCases() {
  const useCases = [
    {
      title: "Hedge Funds",
      description: "Pair trades, unlock value",
      details: "Execute sophisticated strategies by trading individual components while maintaining exposure to the whole.",
      icon: "🏦"
    },
    {
      title: "Activists",
      description: "Conglomerate discount",
      details: "Surface hidden value in conglomerates by trading individual business units separately.",
      icon: "📢"
    },
    {
      title: "Sophisticated Retail",
      description: "Pure-play exposure",
      details: "Get direct exposure to specific companies or sectors without unwanted diversification.",
      icon: "👤"
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Use cases
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From institutional arbitrage to retail precision investing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <div key={index} className="card text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">{useCase.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {useCase.title}
              </h3>
              <p className="text-blue-600 font-semibold mb-4">
                {useCase.description}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {useCase.details}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
