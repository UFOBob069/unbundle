export default function Examples() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Concrete Examples
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            See how Unbundle Finance works with real numbers and scenarios
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Example A - SPY */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Example A — Deposit 1 SPY. Mint components. Trade the parts.
            </h3>
            
            <div className="space-y-4 text-sm">
              <p>
                Assume SPY = $500. You deposit 1 SPY into the protocol.
              </p>
              
              <p>
                For simplicity, we mint tokens for the top weights and a "Rest-475" basket (to keep UX sane):
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg font-mono text-xs space-y-1">
                <div>AAPL: 7.0% → $35.00 exposure</div>
                <div>MSFT: 7.0% → $35.00</div>
                <div>NVDA: 6.0% → $30.00</div>
                <div>AMZN: 3.5% → $17.50</div>
                <div>GOOGL: 3.5% → $17.50</div>
                <div>META: 2.5% → $12.50</div>
                <div>BRK.B: 2.2% → $11.00</div>
                <div>AVGO: 2.1% → $10.50</div>
                <div>LLY: 1.8% → $9.00</div>
                <div>JPM: 1.3% → $6.50</div>
                <div>"Rest-475" basket: 63.1% → $315.00</div>
                <div className="font-bold">Total = $500.00 (must match your deposited SPY value at mint time)</div>
              </div>
              
              <p>
                You now hold component tokens (AAPL, MSFT, NVDA, …, REST) that sum exactly to the SPY you deposited. You can sell any component you don't want and keep the rest.
              </p>
              
              <p>
                🔁 <strong>Redemption:</strong> To get your SPY back, return (burn) the same proportional set you minted. The contract recombines and releases 1 SPY.
              </p>
              
              <p>
                📈 <strong>Price discovery angle:</strong> If the market believes NVDA should be a bigger part of your exposure (AI upside), NVDA component tokens can trade at a premium while others trade at a discount. The sum can deviate intraday, but mint/burn + arbs push it back toward SPY NAV.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">Arb example:</p>
                <p className="text-xs">
                  Suppose your components now fetch $508 total on the open market while SPY is still $500.
                </p>
                <p className="text-xs">
                  An arbitrageur can deposit SPY ($500), mint components, sell them for ~$508, and pocket ~$8, pushing component prices down toward parity.
                </p>
                <p className="text-xs">
                  If components total $492, the reverse arb (buy cheap components → redeem for 1 SPY) pushes prices up.
                </p>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Weights update as the official SPY index rebalances. Token math uses the latest published weights at mint time; REST basket holds the long tail. This is illustrative; live weights/prices will differ.
              </p>
            </div>
          </div>

          {/* Example B - GOOGL */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Example B — Deposit 1 GOOGL. Mint YT, SEARCH, CLOUD, OTHER.
            </h3>
            
            <div className="space-y-4 text-sm">
              <p>
                Assume 1 GOOGL share = $150. You deposit 1 GOOGL into the protocol.
              </p>
              
              <p>
                At mint, the system uses transparent, pre-declared proportions (governance-set; updated periodically) that reflect latest segment disclosures and consensus sum-of-the-parts bands. Example proportions (illustrative):
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg font-mono text-xs space-y-1">
                <div>SEARCH: 55% → $82.50 exposure</div>
                <div>YOUTUBE: 25% → $37.50</div>
                <div>CLOUD: 17% → $25.50</div>
                <div>OTHER/"Bets": 3% → $4.50</div>
                <div className="font-bold">Total = $150.00</div>
              </div>
              
              <p>
                You now hold 4 tokens: SEARCH, YT, CLOUD, OTHER. Trade them freely.
              </p>
              
              <p>
                📊 <strong>Price discovery:</strong> Even though the mint uses static proportions at that moment, secondary markets can price YT above or below its "implied" slice based on forward views (e.g., CTV growth, Shorts monetization). This surfaces a live, crowd-priced sum-of-the-parts for Alphabet.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">Arb example:</p>
                <p className="text-xs">
                  Suppose secondary markets value your 4 tokens at a total of $162 while GOOGL is still $150.
                </p>
                <p className="text-xs">
                  Arb can deposit $150 of GOOGL, mint the 4 tokens, sell them for ~$162, collect ~$12, pushing the set back toward $150.
                </p>
                <p className="text-xs">
                  If tokens total $144, the reverse arb (buy tokens → burn → redeem 1 GOOGL) lifts their prices.
                </p>
              </div>
              
              <p>
                🔁 <strong>Redemption:</strong> Burn the required proportions of SEARCH, YT, CLOUD, OTHER to redeem 1 GOOGL share from the vault.
              </p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Proportions shown are for illustration only; live parameters derive from public segment reporting + governance policy. Over time, governance can refine splits (e.g., separating Ads vs Subscriptions in YT, or Cloud Run-rate signals).
              </p>
            </div>
          </div>
        </div>

        {/* Why this isn't a meme */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
            Why this isn't a meme
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-xs">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Backed & Redeemable</p>
                  <p className="text-sm text-gray-600">Every component set recombines into the exact parent asset you deposited.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-xs">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Arb-Enforced Fair Value</p>
                  <p className="text-sm text-gray-600">If parts &gt; whole, mint/sell; if parts &lt; whole, buy/burn/redeem.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-xs">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Transparent Math</p>
                  <p className="text-sm text-gray-600">Mint proportions and index weights are published; rebalances are scheduled.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-xs">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Price Discovery Where It Matters</p>
                  <p className="text-sm text-gray-600">Markets can finally express views on parts (YT, CLOUD, NVDA) without taking unwanted exposure to the whole.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
