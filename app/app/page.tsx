import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <nav className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                X402 Referral
              </span>
            </Link>
            <div className="flex gap-4">
              <Link
                href="/merchant/dashboard"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                Merchant
              </Link>
              <Link
                href="/affiliate/dashboard"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                Affiliate
              </Link>
              <Link
                href="/demo/shop"
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Try Demo
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <div className="inline-block px-4 py-2 bg-blue-50 rounded-full mb-6">
              <span className="text-sm font-semibold text-blue-600">
                Built for Solana Agent Economy Hackathon
              </span>
            </div>

            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl mb-6">
              Instant Referral Payouts
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                on Solana
              </span>
            </h1>

            <p className="mt-6 text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
              Open-source referral platform with <strong>sub-3-second cryptocurrency payouts</strong>. 
              Built with x402 protocol and Solana blockchain for full transparency.
            </p>

            <div className="mt-12 flex items-center justify-center gap-6">
              <Link
                href="/merchant/dashboard"
                className="rounded-lg bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all"
              >
                Launch Dashboard
              </Link>
              <Link
                href="/demo/shop"
                className="rounded-lg border-2 border-gray-300 px-8 py-4 text-base font-semibold text-gray-900 hover:bg-gray-50 transition-all"
              >
                Try Demo <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Instant Payouts
              </h3>
              <p className="text-gray-700">
                Automated USDC payments via x402 protocol. From conversion to payout in under 3 seconds.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl">
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                On-Chain Proof
              </h3>
              <p className="text-gray-700">
                Every campaign and conversion stored transparently on Solana. Cryptographic proof included.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Agent-Native
              </h3>
              <p className="text-gray-700">
                Built for autonomous AI agents to discover campaigns, generate links, and earn automatically.
              </p>
            </div>
          </div>

          <div className="mt-24 bg-gray-900 rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Traditional affiliate systems take 30-60 days to pay. We do it in seconds.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
              <div className="bg-gray-800 p-6 rounded-xl">
                <div className="text-blue-400 font-bold mb-2">Step 1</div>
                <h4 className="text-white font-semibold mb-2">Create Campaign</h4>
                <p className="text-gray-400 text-sm">
                  Merchants create campaigns stored on Solana blockchain
                </p>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl">
                <div className="text-purple-400 font-bold mb-2">Step 2</div>
                <h4 className="text-white font-semibold mb-2">Generate Links</h4>
                <p className="text-gray-400 text-sm">
                  Affiliates create unique tracked referral links
                </p>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl">
                <div className="text-green-400 font-bold mb-2">Step 3</div>
                <h4 className="text-white font-semibold mb-2">User Converts</h4>
                <p className="text-gray-400 text-sm">
                  System validates with fraud detection and creates proof
                </p>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl">
                <div className="text-yellow-400 font-bold mb-2">Step 4</div>
                <h4 className="text-white font-semibold mb-2">Instant Payout</h4>
                <p className="text-gray-400 text-sm">
                  USDC paid via x402 protocol in under 3 seconds
                </p>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/merchant/dashboard"
                className="inline-block px-8 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>

          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600">&lt;3s</div>
              <div className="text-sm text-gray-600 mt-2">Payout Latency</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600">100%</div>
              <div className="text-sm text-gray-600 mt-2">On-Chain</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600">95%+</div>
              <div className="text-sm text-gray-600 mt-2">Fraud Detection</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600">$0.0001</div>
              <div className="text-sm text-gray-600 mt-2">Cost per TX</div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-sm text-gray-600">
              <strong>X402 Referral Engine</strong> - Open-source infrastructure for the agent economy
            </div>
            <div className="flex gap-8 text-sm text-gray-600">
              <a
                href="https://docs.x402.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                X402 Docs
              </a>
              <a
                href="https://github.com/your-org/x402-referral"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://solana.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                Solana
              </a>
            </div>
          </div>
          <div className="mt-6 text-center text-xs text-gray-500">
            MIT License • Built for Solana Agent Economy Hackathon 2025
          </div>
        </div>
      </footer>
    </div>
  );
}
