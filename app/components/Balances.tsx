'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { formatUnits } from '@/lib/utils';

interface TokenBalance {
  mint: string;
  symbol: string;
  balance: string;
}

export default function Balances() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!publicKey) {
      setBalances([]);
      setLoading(false);
      return;
    }

    async function fetchBalances() {
      try {
        setLoading(true);
        const mints = {
          GGL: process.env.NEXT_PUBLIC_GGL_MINT!,
          SEARCH: process.env.NEXT_PUBLIC_GGL_SEARCH_MINT!,
          YT: process.env.NEXT_PUBLIC_GGL_YT_MINT!,
          CLOUD: process.env.NEXT_PUBLIC_GGL_CLOUD_MINT!,
          OTHER: process.env.NEXT_PUBLIC_GGL_OTHER_MINT!,
        };

        const balancePromises = Object.entries(mints).map(async ([symbol, mintAddress]) => {
          if (!mintAddress || !publicKey) return null;
          try {
            const mint = new PublicKey(mintAddress);
            const ata = await getAssociatedTokenAddress(mint, publicKey);
            const account = await getAccount(connection, ata);
            const balance = formatUnits(account.amount, 6);
            return { mint: mintAddress, symbol, balance };
          } catch (err) {
            return { mint: mintAddress, symbol, balance: '0' };
          }
        });

        const results = await Promise.all(balancePromises);
        setBalances(results.filter((b): b is TokenBalance => b !== null));
      } catch (err) {
        console.error('Error fetching balances:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchBalances();
    const interval = setInterval(fetchBalances, 5000);
    return () => clearInterval(interval);
  }, [publicKey, connection]);

  if (!publicKey) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Token Balances
      </h2>
      {loading ? (
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {balances.map((token) => (
            <div key={token.symbol} className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {token.symbol}
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {parseFloat(token.balance).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


