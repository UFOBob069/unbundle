import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import { createMint, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Faucet } from '../target/types/faucet';
import { expect } from 'chai';

describe('faucet', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Faucet as Program<Faucet>;
  const payer = provider.wallet as anchor.Wallet;

  let googlMint: PublicKey;
  let faucetConfig: PublicKey;
  let mintAuthority: PublicKey;

  before(async () => {
    // Create GGL mint for testing
    googlMint = await createMint(
      provider.connection,
      payer.payer,
      payer.publicKey,
      null,
      6
    );

    // Derive PDA addresses
    [faucetConfig] = PublicKey.findProgramAddressSync(
      [Buffer.from('faucet'), googlMint.toBuffer()],
      program.programId
    );

    [mintAuthority] = PublicKey.findProgramAddressSync(
      [Buffer.from('faucet'), googlMint.toBuffer()],
      program.programId
    );

    // Initialize faucet
    const cooldownSeconds = new anchor.BN(86400); // 24 hours
    await program.methods
      .initializeFaucet(googlMint, cooldownSeconds)
      .accounts({
        authority: payer.publicKey,
        googlMint,
        faucetConfig,
        mintAuthority,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    // Transfer mint authority to PDA (simplified for test - in real setup, do this separately)
    // Note: This would require additional instructions in a real test
  });

  it('Initializes faucet correctly', async () => {
    const config = await program.account.faucetConfig.fetch(faucetConfig);
    expect(config.googlMint.toString()).to.equal(googlMint.toString());
    expect(config.cooldownSeconds.toNumber()).to.equal(86400);
    expect(config.authority.toString()).to.equal(payer.publicKey.toString());
  });

  it('Claims 10 GGL tokens', async () => {
    const userGglAta = await getAssociatedTokenAddress(googlMint, payer.publicKey);
    const [faucetUser] = PublicKey.findProgramAddressSync(
      [Buffer.from('faucet_user'), payer.publicKey.toBuffer()],
      program.programId
    );

    // Claim tokens
    await program.methods
      .claimOne()
      .accounts({
        faucetConfig,
        googlMint,
        mintAuthority,
        user: payer.publicKey,
        userGooglAta: userGglAta,
        faucetUser,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    // Verify claim was recorded
    const userAccount = await program.account.faucetUser.fetch(faucetUser);
    expect(userAccount.lastClaimUnix.toNumber()).to.be.greaterThan(0);
  });

  it('Enforces cooldown period', async () => {
    const userGglAta = await getAssociatedTokenAddress(googlMint, payer.publicKey);
    const [faucetUser] = PublicKey.findProgramAddressSync(
      [Buffer.from('faucet_user'), payer.publicKey.toBuffer()],
      program.programId
    );

    // Try to claim again immediately (should fail)
    try {
      await program.methods
        .claimOne()
        .accounts({
          faucetConfig,
          googlMint,
          mintAuthority,
          user: payer.publicKey,
          userGooglAta: userGglAta,
          faucetUser,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      expect.fail('Should have thrown cooldown error');
    } catch (err: any) {
      expect(err.message).to.include('CooldownNotMet');
    }
  });
});


