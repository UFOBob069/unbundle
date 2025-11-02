import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  SystemProgram,
} from '@solana/web3.js';
import {
  createSetAuthorityInstruction,
  AuthorityType,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { Program, AnchorProvider, BN } from '@coral-xyz/anchor';
import * as fs from 'fs';
import * as path from 'path';
import { FaucetIDL } from '../app/lib/idl/faucet';

async function initializeFaucet() {
  const connection = new Connection(
    process.env.RPC_URL || 'https://api.devnet.solana.com',
    'confirmed'
  );

  // Load payer keypair
  const payerPath = process.env.ANCHOR_WALLET || path.join(process.env.HOME || process.env.USERPROFILE || '', '.config', 'solana', 'id.json');
  if (!fs.existsSync(payerPath)) {
    console.error('Wallet not found. Please set ANCHOR_WALLET or ensure ~/.config/solana/id.json exists');
    return;
  }

  const secretKey = JSON.parse(fs.readFileSync(payerPath, 'utf-8'));
  const payer = Keypair.fromSecretKey(new Uint8Array(secretKey));

  console.log('Using payer:', payer.publicKey.toBase58());

  // Load mint addresses
  const configPath = path.join(__dirname, '..', 'app', 'config', 'mints.json');
  if (!fs.existsSync(configPath)) {
    console.error('Mints config not found. Please run yarn create-mints first.');
    return;
  }

  const mints = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const googlMint = new PublicKey(mints.GGL);

  const programId = new PublicKey(process.env.FAUCET_PROGRAM_ID || 'FauCet1111111111111111111111111111111111111111');
  
  // Derive PDA addresses
  const [faucetConfig] = PublicKey.findProgramAddressSync(
    [Buffer.from('faucet'), googlMint.toBuffer()],
    programId
  );

  const [mintAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from('faucet'), googlMint.toBuffer()],
    programId
  );

  console.log('\nFaucet Config PDA:', faucetConfig.toBase58());
  console.log('Mint Authority PDA:', mintAuthority.toBase58());

  // Create provider
  const provider = new AnchorProvider(
    connection,
    {
      publicKey: payer.publicKey,
      signTransaction: async (tx) => {
        tx.sign(payer);
        return tx;
      },
      signAllTransactions: async (txs) => {
        return txs.map((tx) => {
          tx.sign(payer);
          return tx;
        });
      },
    } as any,
    {}
  );

  const program = new Program(FaucetIDL, programId, provider);

  // Transfer mint authority to PDA
  console.log('\nTransferring GGL mint authority to faucet PDA...');
  const setAuthorityIx = createSetAuthorityInstruction(
    googlMint,
    payer.publicKey,
    AuthorityType.MintTokens,
    mintAuthority
  );

  const tx1 = new Transaction().add(setAuthorityIx);
  const sig1 = await provider.sendAndConfirm(tx1);
  console.log('Mint authority transferred:', sig1);

  // Initialize faucet
  console.log('\nInitializing faucet...');
  const cooldownSeconds = new BN(86400); // 24 hours

  try {
    const tx = await program.methods
      .initializeFaucet(googlMint, cooldownSeconds)
      .accounts({
        authority: payer.publicKey,
        googlMint,
        faucetConfig,
        mintAuthority,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log('✅ Faucet initialized:', tx);
    console.log('\nFaucet Config:', faucetConfig.toBase58());
  } catch (err: any) {
    if (err.message?.includes('already in use')) {
      console.log('⚠️  Faucet already initialized');
    } else {
      console.error('Error initializing faucet:', err);
      throw err;
    }
  }
}

initializeFaucet().catch(console.error);


