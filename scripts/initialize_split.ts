import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
} from '@solana/web3.js';
import {
  createSetAuthorityInstruction,
  AuthorityType,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { Program, AnchorProvider, BN } from '@coral-xyz/anchor';
import * as fs from 'fs';
import * as path from 'path';
import { SplitterIDL } from '../app/lib/idl/splitter';

async function initializeSplit() {
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
  const partMints = [
    new PublicKey(mints.SEARCH),
    new PublicKey(mints.YT),
    new PublicKey(mints.CLOUD),
    new PublicKey(mints.OTHER),
  ];

  const programId = new PublicKey(process.env.SPLITTER_PROGRAM_ID || 'SplItEr1111111111111111111111111111111111111111');

  // Derive PDA addresses
  const [splitConfig] = PublicKey.findProgramAddressSync(
    [Buffer.from('split'), googlMint.toBuffer()],
    programId
  );

  const [splitMintAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from('split'), googlMint.toBuffer()],
    programId
  );

  console.log('\nSplit Config PDA:', splitConfig.toBase58());
  console.log('Split Mint Authority PDA:', splitMintAuthority.toBase58());

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

  const program = new Program(SplitterIDL, programId, provider);

  // Transfer part mint authorities to splitter PDA
  console.log('\nTransferring part mint authorities to splitter PDA...');
  for (let i = 0; i < partMints.length; i++) {
    const partName = ['SEARCH', 'YT', 'CLOUD', 'OTHER'][i];
    console.log(`Transferring ${partName} mint authority...`);
    const setAuthorityIx = createSetAuthorityInstruction(
      partMints[i],
      payer.publicKey,
      AuthorityType.MintTokens,
      splitMintAuthority
    );

    const { Transaction } = await import('@solana/web3.js');
    const tx = await provider.sendAndConfirm(new Transaction().add(setAuthorityIx));
    console.log(`${partName} mint authority transferred:`, tx);
  }

  // Create vault GGL ATA
  console.log('\nCreating vault GGL ATA...');
  const vaultGglAta = await getAssociatedTokenAddress(googlMint, splitConfig, true);

  try {
    const createAtaIx = createAssociatedTokenAccountInstruction(
      payer.publicKey,
      vaultGglAta,
      splitConfig,
      googlMint
    );
    const { Transaction } = await import('@solana/web3.js');
    const tx = await provider.sendAndConfirm(new Transaction().add(createAtaIx));
    console.log('Vault ATA created:', tx);
  } catch (err: any) {
    if (err.message?.includes('already in use')) {
      console.log('Vault ATA already exists');
    } else {
      throw err;
    }
  }

  console.log('Vault GGL ATA:', vaultGglAta.toBase58());

  // Initialize splitter
  console.log('\nInitializing splitter...');
  try {
    const tx = await program.methods
      .initializeSplit(googlMint, partMints)
      .accounts({
        authority: payer.publicKey,
        googlMint,
        partMint0: partMints[0],
        partMint1: partMints[1],
        partMint2: partMints[2],
        partMint3: partMints[3],
        vaultGooglAta: vaultGglAta,
        splitConfig,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log('✅ Splitter initialized:', tx);
    console.log('\nSplit Config:', splitConfig.toBase58());
    console.log('Vault GGL ATA:', vaultGglAta.toBase58());
  } catch (err: any) {
    if (err.message?.includes('already in use')) {
      console.log('⚠️  Splitter already initialized');
    } else {
      console.error('Error initializing splitter:', err);
      throw err;
    }
  }
}

initializeSplit().catch(console.error);

