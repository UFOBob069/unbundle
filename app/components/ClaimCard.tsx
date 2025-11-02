'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, BN } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, getAccount } from '@solana/spl-token';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaucetIDL } from '@/lib/idl/faucet';
import { getExplorerUrl } from '@/lib/utils';

export default function ClaimCard() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [cooldown, setCooldown] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!publicKey) return;

    async function fetchCooldown() {
      if (!publicKey) return;
      
      try {
        const programId = new PublicKey(process.env.NEXT_PUBLIC_FAUCET_PROGRAM_ID!);
        const googlMint = new PublicKey(process.env.NEXT_PUBLIC_GGL_MINT!);
        const [faucetConfig] = PublicKey.findProgramAddressSync(
          [Buffer.from('faucet'), googlMint.toBuffer()],
          programId
        );

        const [faucetUser] = PublicKey.findProgramAddressSync(
          [Buffer.from('faucet_user'), publicKey.toBuffer()],
          programId
        );

        try {
          // Fetch account data directly
          const userAccountInfo = await connection.getAccountInfo(faucetUser);
          const configAccountInfo = await connection.getAccountInfo(faucetConfig);
          
          if (userAccountInfo && configAccountInfo) {
            // Parse account data (simplified - in production, use proper deserialization)
            const provider = new AnchorProvider(connection, {} as any, {});
            const program = new Program(FaucetIDL as any, programId, provider);
            const userAccount = await program.account.faucetUser.fetch(faucetUser) as any;
            const configAccount = await program.account.faucetConfig.fetch(faucetConfig) as any;
            const timestamp = Date.now() / 1000;
            const lastClaim = userAccount.lastClaimUnix.toNumber();
            const elapsed = timestamp - lastClaim;
            const remaining = Math.max(0, configAccount.cooldownSeconds.toNumber() - elapsed);
            setCooldown(remaining);
          } else {
            setCooldown(0);
          }
        } catch {
          setCooldown(0);
        }
      } catch (err) {
        console.error('Error fetching cooldown:', err);
        setCooldown(0);
      }
    }

    fetchCooldown();
    const interval = setInterval(fetchCooldown, 1000);
    return () => clearInterval(interval);
  }, [publicKey, connection]);

  const handleClaim = async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet');
      return;
    }

    if (cooldown && cooldown > 0) {
      toast.error(`Cooldown active: ${Math.floor(cooldown / 3600)}h ${Math.floor((cooldown % 3600) / 60)}m remaining`);
      return;
    }

    try {
      setLoading(true);
      const programId = new PublicKey(process.env.NEXT_PUBLIC_FAUCET_PROGRAM_ID!);
      const googlMint = new PublicKey(process.env.NEXT_PUBLIC_GGL_MINT!);
      const [faucetConfig, faucetConfigBump] = PublicKey.findProgramAddressSync(
        [Buffer.from('faucet'), googlMint.toBuffer()],
        programId
      );

      const [faucetUser, faucetUserBump] = PublicKey.findProgramAddressSync(
        [Buffer.from('faucet_user'), publicKey.toBuffer()],
        programId
      );

      const [mintAuthority] = PublicKey.findProgramAddressSync(
        [Buffer.from('faucet'), googlMint.toBuffer()],
        programId
      );

      const userGglAta = await getAssociatedTokenAddress(googlMint, publicKey);

      const instructions = [];

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

      // Create provider with wallet for instruction building
      const provider = new AnchorProvider(
        connection,
        {
          publicKey,
          signTransaction: async (tx: any) => tx,
          signAllTransactions: async (txs: any) => txs,
        } as any,
        {}
      );
      const program = new Program(FaucetIDL as any, programId, provider);

      const tx = await program.methods
        .claimOne()
        .accounts({
          faucetConfig,
          googlMint,
          mintAuthority,
          user: publicKey,
          userGooglAta: userGglAta,
          faucetUser,
          tokenProgram: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
          systemProgram: SystemProgram.programId,
        })
        .instruction();

      instructions.push(tx);

      const transaction = new Transaction().add(...instructions);
      const latestBlockhash = await connection.getLatestBlockhash();
      transaction.recentBlockhash = latestBlockhash.blockhash;
      transaction.feePayer = publicKey;

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');

      toast.success(`Claimed 10 GGL! ${getExplorerUrl(signature)}`);
      setCooldown(86400);
    } catch (err: any) {
      console.error('Error claiming:', err);
      toast.error(err.message || 'Failed to claim tokens');
    } finally {
      setLoading(false);
    }
  };

  const formatCooldown = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Claim 10 GGL (demo)
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Once per 24h
      </p>
      {cooldown !== null && cooldown > 0 && (
        <p className="text-sm text-orange-600 dark:text-orange-400 mb-4">
          Cooldown: {formatCooldown(cooldown)}
        </p>
      )}
      <button
        onClick={handleClaim}
        disabled={loading || (cooldown !== null && cooldown > 0)}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
      >
        {loading ? 'Claiming...' : 'Claim 10 GGL'}
      </button>
    </div>
  );
}

