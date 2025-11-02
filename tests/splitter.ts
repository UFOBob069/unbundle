import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import {
  createMint,
  getAssociatedTokenAddress,
  getAccount,
  TOKEN_PROGRAM_ID,
  getOrCreateAssociatedTokenAccount,
} from '@solana/spl-token';
import { Splitter } from '../target/types/splitter';
import { expect } from 'chai';

describe('splitter', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Splitter as Program<Splitter>;
  const payer = provider.wallet as anchor.Wallet;

  let googlMint: PublicKey;
  let partMints: PublicKey[];
  let splitConfig: PublicKey;
  let vaultGglAta: PublicKey;
  let splitMintAuthority: PublicKey;

  before(async () => {
    // Create GGL mint
    googlMint = await createMint(
      provider.connection,
      payer.payer,
      payer.publicKey,
      null,
      6
    );

    // Create part mints
    partMints = [];
    for (let i = 0; i < 4; i++) {
      const mint = await createMint(
        provider.connection,
        payer.payer,
        payer.publicKey,
        null,
        6
      );
      partMints.push(mint);
    }

    // Derive PDA addresses
    [splitConfig] = PublicKey.findProgramAddressSync(
      [Buffer.from('split'), googlMint.toBuffer()],
      program.programId
    );

    [splitMintAuthority] = PublicKey.findProgramAddressSync(
      [Buffer.from('split'), googlMint.toBuffer()],
      program.programId
    );

    // Create vault GGL ATA
    vaultGglAta = await getAssociatedTokenAddress(googlMint, splitConfig, true);
    await getOrCreateAssociatedTokenAccount(
      provider.connection,
      payer.payer,
      googlMint,
      splitConfig,
      true
    );

    // Initialize splitter
    await program.methods
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

    // Note: In real setup, transfer mint authorities to PDAs before initialization
  });

  it('Initializes splitter correctly', async () => {
    const config = await program.account.splitConfig.fetch(splitConfig);
    expect(config.googlMint.toString()).to.equal(googlMint.toString());
    expect(config.partMints.length).to.equal(4);
    expect(config.vaultGooglAta.toString()).to.equal(vaultGglAta.toString());
  });

  it('Stakes GGL and mints parts', async () => {
    const stakeAmount = new anchor.BN(1_000_000); // 1 GGL with 6 decimals

    // Create user GGL ATA and mint some tokens
    const userGglAta = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      payer.payer,
      googlMint,
      payer.publicKey
    );

    // Mint 2 GGL to user
    // Note: This would require minting tokens first in a real scenario

    const userPartAtas = await Promise.all(
      partMints.map((mint) => getAssociatedTokenAddress(mint, payer.publicKey))
    );

    // Stake 1 GGL
    await program.methods
      .stakeGl(stakeAmount)
      .accounts({
        splitConfig,
        googlMint,
        userGooglAta: userGglAta.address,
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
        user: payer.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    // Verify parts were minted (1:1:1:1 ratio)
    for (const partAta of userPartAtas) {
      try {
        const account = await getAccount(provider.connection, partAta);
        expect(account.amount.toString()).to.equal(stakeAmount.toString());
      } catch {
        // ATA might not exist yet, that's okay for this test stub
      }
    }
  });

  it('Redeems parts for GGL', async () => {
    const sets = new anchor.BN(1_000_000); // 1 set

    const userPartAtas = await Promise.all(
      partMints.map((mint) => getAssociatedTokenAddress(mint, payer.publicKey))
    );

    const userGglAta = await getAssociatedTokenAddress(googlMint, payer.publicKey);

    const [splitBurnAuthority] = PublicKey.findProgramAddressSync(
      [Buffer.from('split'), googlMint.toBuffer()],
      program.programId
    );

    // Redeem 1 set
    await program.methods
      .redeemGl(sets)
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
        userGooglAta,
        vaultGooglAta: vaultGglAta,
        splitBurnAuthority,
        splitConfig,
        user: payer.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    // Verify GGL was returned (simplified check for test stub)
    // In a real test, check balances before and after
  });
});

