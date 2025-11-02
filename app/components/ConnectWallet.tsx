'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';

export default function ConnectWallet() {
  const { connected, publicKey } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Wallet Connection
          </h2>
          {connected && publicKey && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Connected: {publicKey.toBase58().slice(0, 8)}...
              {publicKey.toBase58().slice(-8)}
            </p>
          )}
        </div>
        {mounted && <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-700" />}
      </div>
    </div>
  );
}


