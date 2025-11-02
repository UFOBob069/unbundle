'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import ConnectWallet from '@/components/ConnectWallet';
import Balances from '@/components/Balances';
import ClaimCard from '@/components/ClaimCard';
import StakeCard from '@/components/StakeCard';
import RedeemCard from '@/components/RedeemCard';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default function Home() {
  const { connected } = useWallet();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <a 
            href="/" 
            className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors"
          >
            ← Back to Home
          </a>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Unbundle Demo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Demo GGL token faucet and staking on Solana devnet
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            ⚠️ This is a demonstration on Solana devnet. Tokens have no real value.
          </p>
        </div>

        <div className="mb-8">
          <ConnectWallet />
        </div>

        {connected && (
          <>
            <div className="mb-8">
              <Balances />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <ClaimCard />
              <StakeCard />
              <RedeemCard />
            </div>
          </>
        )}

        <Footer />
      </div>
    </main>
  );
}


