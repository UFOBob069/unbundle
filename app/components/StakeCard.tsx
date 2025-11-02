'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, BN } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, getAccount } from '@solana/spl-token';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { SplitterIDL } from '@/lib/idl/splitter';
import { getExplorerUrl } from '@/lib/utils';

export default function StakeCard() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [amount, setAmount] = useState('1');
  const [loading, setLoading] = useState(false);

  const handleStake = async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet');
      return;
    }

    const stakeAmount = parseFloat(amount);
    if (isNaN(stakeAmount) || stakeAmount <= 0) {
      toast.error('Please enter a valid amount');
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

      const userGglAta = await getAssociatedTokenAddress(googlMint, publicKey);
      const userPartAtas = await Promise.all(
        partMints.map((mint) => getAssociatedTokenAddress(mint, publicKey))
      );

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

      const amountBaseUnits = new BN(Math.floor(stakeAmount * 1_000_000));

      const instructions = [];

      // Create user ATAs if needed
      try {
        await getAccount(connection, userGglAta);
      } catch {
        instructions.push(
          createAssociatedTokenAccountInstruction(
            publicKey,
            userGglAta,
            publicKey,
            googlMint
          )
        );
      }

      for (let i = 0; i < partMints.length; i++) {
        try {
          await getAccount(connection, userPartAtas[i]);
        } catch {
          instructions.push(
            createAssociatedTokenAccountInstruction(
              publicKey,
              userPartAtas[i],
              publicKey,
              partMints[i]
            )
          );
        }
      }

      const [splitMintAuthority] = PublicKey.findProgramAddressSync(
        [Buffer.from('split'), googlMint.toBuffer()],
        programId
      );

      console.log('Stake transaction params:', {
        splitConfig: splitConfig.toBase58(),
        googlMint: googlMint.toBase58(),
        partMints: partMints.map(m => m.toBase58()),
        vaultGglAta: vaultGglAta.toBase58(),
        amount: amountBaseUnits.toString()
      });

      const tx = await program.methods
        .stakeGl(amountBaseUnits)
        .accounts({
          splitConfig,
          googlMint,
          userGooglAta: userGglAta,
          partMint0: partMints[0],
          partMint1: partMints[1],
          partMint2: partMints[2],
          partMint3: partMints[3],
          userPartAta0: userPartAtas[0],
          userPartAta1: userPartAtas[1],
          userPartAta2: userPartAtas[2],
          userPartAta3: userPartAtas[3],
          vaultGooglAta: vaultGglAta,
          splitMintAuthority,
          user: publicKey,
          tokenProgram: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
        })
        .instruction();

      instructions.push(tx);

      const transaction = new Transaction().add(...instructions);
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

      toast.success(`Staked ${stakeAmount} GGL! ${getExplorerUrl(signature)}`);
      setAmount('1');
    } catch (err: any) {
      console.error('Error staking:', err);
      toast.error(err.message || 'Failed to stake GGL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Stake GGL
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Stake GGL → Receive 1x SEARCH, 1x YT, 1x CLOUD, 1x OTHER per GGL
      </p>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Amount (GGL)
        </label>
        <input
          type="number"
          min="0.000001"
          step="0.000001"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>
      <button
        onClick={handleStake}
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
      >
        {loading ? 'Staking...' : 'Stake GGL'}
      </button>
    </div>
  );
}

