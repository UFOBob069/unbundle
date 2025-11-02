'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, BN } from '@coral-xyz/anchor';
import { PublicKey, Transaction } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { SplitterIDL } from '@/lib/idl/splitter';
import { getExplorerUrl } from '@/lib/utils';

export default function RedeemCard() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [maxSets, setMaxSets] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!publicKey) {
      setMaxSets(0);
      return;
    }

    async function calculateMaxSets() {
      if (!publicKey) return;
      
      try {
        const partMints = [
          new PublicKey(process.env.NEXT_PUBLIC_GGL_SEARCH_MINT!),
          new PublicKey(process.env.NEXT_PUBLIC_GGL_YT_MINT!),
          new PublicKey(process.env.NEXT_PUBLIC_GGL_CLOUD_MINT!),
          new PublicKey(process.env.NEXT_PUBLIC_GGL_OTHER_MINT!),
        ];

        const balances = await Promise.all(
          partMints.map(async (mint) => {
            if (!publicKey) return BigInt(0);
            try {
              const ata = await getAssociatedTokenAddress(mint, publicKey);
              const account = await getAccount(connection, ata);
              return account.amount;
            } catch {
              return BigInt(0);
            }
          })
        );

        const minBalance = balances.reduce((min, balance) => {
          return balance < min ? balance : min;
        }, balances[0] || BigInt(0));

        setMaxSets(Number(minBalance));
      } catch (err) {
        console.error('Error calculating max sets:', err);
        setMaxSets(0);
      }
    }

    calculateMaxSets();
    const interval = setInterval(calculateMaxSets, 5000);
    return () => clearInterval(interval);
  }, [publicKey, connection]);

  const handleRedeem = async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet');
      return;
    }

    if (maxSets === 0) {
      toast.error('You need complete sets of all parts to redeem');
      return;
    }

    try {
      setLoading(true);
      const programId = new PublicKey(process.env.NEXT_PUBLIC_SPLITTER_PROGRAM_ID!);
      const googlMint = new PublicKey(process.env.NEXT_PUBLIC_GGL_MINT!);
      const partMints = [
        new PublicKey(process.env.NEXT_PUBLIC_GGL_SEARCH_MINT!),
        new PublicKey(process.env.NEXT_PUBLIC_GGL_YT_MINT!),
        new PublicKey(process.env.NEXT_PUBLIC_GGL_CLOUD_MINT!),
        new PublicKey(process.env.NEXT_PUBLIC_GGL_OTHER_MINT!),
      ];

      const [splitConfig] = PublicKey.findProgramAddressSync(
        [Buffer.from('split'), googlMint.toBuffer()],
        programId
      );

      const userPartAtas = await Promise.all(
        partMints.map((mint) => getAssociatedTokenAddress(mint, publicKey))
      );

      const userGglAta = await getAssociatedTokenAddress(googlMint, publicKey);

      // Create provider to fetch config
      const provider = new AnchorProvider(
        connection,
        {
          publicKey,
          signTransaction: async (tx: any) => tx,
          signAllTransactions: async (txs: any) => txs,
        } as any,
        {}
      );
      const program = new Program(SplitterIDL as any, programId, provider);

      const configAccount = await program.account.splitConfig.fetch(splitConfig) as any;
      const vaultGglAta = configAccount.vaultGooglAta;

      const setsAmount = new BN(maxSets);

      // Create user GGL ATA if needed
      try {
        await getAccount(connection, userGglAta);
      } catch {
        // Will be created by the program if needed
      }

      console.log('Redeem transaction params:', {
        splitConfig: splitConfig.toBase58(),
        googlMint: googlMint.toBase58(),
        partMints: partMints.map(m => m.toBase58()),
        vaultGglAta: vaultGglAta.toBase58(),
        sets: setsAmount.toString()
      });

      const tx = await program.methods
        .redeemGl(setsAmount)
        .accounts({
          splitConfig,
          googlMint,
          partMint0: partMints[0],
          partMint1: partMints[1],
          partMint2: partMints[2],
          partMint3: partMints[3],
          userPartAta0: userPartAtas[0],
          userPartAta1: userPartAtas[1],
          userPartAta2: userPartAtas[2],
          userPartAta3: userPartAtas[3],
          userGooglAta: userGglAta,
          vaultGooglAta: vaultGglAta,
          user: publicKey,
          tokenProgram: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
        })
        .instruction();

      const transaction = new Transaction().add(tx);
      const latestBlockhash = await connection.getLatestBlockhash();
      transaction.recentBlockhash = latestBlockhash.blockhash;
      transaction.feePayer = publicKey;

      // Simulate first to get detailed error
      try {
        const simulation = await connection.simulateTransaction(transaction);
        console.log('Simulation result:', simulation);
        if (simulation.value.err) {
          console.error('Simulation error:', simulation.value.err);
          console.error('Logs:', simulation.value.logs);
          throw new Error(`Simulation failed: ${JSON.stringify(simulation.value.err)}`);
        }
      } catch (simErr: any) {
        console.error('Simulation exception:', simErr);
        throw simErr;
      }

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');

      const setsRedeemed = Number(setsAmount) / 1_000_000;
      toast.success(`Redeemed ${setsRedeemed} sets! ${getExplorerUrl(signature)}`);
    } catch (err: any) {
      console.error('Error redeeming:', err);
      toast.error(err.message || 'Failed to redeem parts');
    } finally {
      setLoading(false);
    }
  };

  const setsDisplay = (maxSets / 1_000_000).toFixed(6);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Redeem Parts
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Redeem complete sets to get GGL back
      </p>
      {maxSets > 0 && (
        <p className="text-sm text-green-600 dark:text-green-400 mb-4">
          Complete sets available: {setsDisplay}
        </p>
      )}
      {maxSets === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          No complete sets available
        </p>
      )}
      <button
        onClick={handleRedeem}
        disabled={loading || maxSets === 0}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
      >
        {loading ? 'Redeeming...' : 'Redeem Complete Sets'}
      </button>
    </div>
  );
}

