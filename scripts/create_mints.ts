import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  getMinimumBalanceForRentExemptMint,
  createSetAuthorityInstruction,
  AuthorityType,
} from '@solana/spl-token';
import * as fs from 'fs';
import * as path from 'path';
import bs58 from 'bs58';

const DECIMALS = 6;

async function createMints() {
  const connection = new Connection(
    process.env.RPC_URL || 'https://api.devnet.solana.com',
    'confirmed'
  );

  // Load or generate keypair
  const payerPath = process.env.ANCHOR_WALLET || path.join(process.env.HOME || process.env.USERPROFILE || '', '.config', 'solana', 'id.json');
  let payer: Keypair;
  
  if (fs.existsSync(payerPath)) {
    const secretKey = JSON.parse(fs.readFileSync(payerPath, 'utf-8'));
    payer = Keypair.fromSecretKey(new Uint8Array(secretKey));
  } else {
    payer = Keypair.generate();
    console.log('Generated new keypair. Please fund it and save to:', payerPath);
    console.log('Public key:', payer.publicKey.toBase58());
    return;
  }

  console.log('Using payer:', payer.publicKey.toBase58());

  const mints: Record<string, string> = {};

  // Create parent GGL mint
  console.log('\nCreating GGL mint...');
  const googlMint = await createMint(
    connection,
    payer,
    payer.publicKey, // mint authority (will be transferred to faucet PDA later)
    null, // freeze authority
    DECIMALS
  );
  mints.GGL = googlMint.toBase58();
  console.log('GGL mint:', googlMint.toBase58());

  // Create part mints
  const partNames = ['SEARCH', 'YT', 'CLOUD', 'OTHER'];
  for (const partName of partNames) {
    console.log(`\nCreating GGL_${partName} mint...`);
    const partMint = await createMint(
      connection,
      payer,
      payer.publicKey, // mint authority (will be transferred to splitter PDA later)
      null, // freeze authority
      DECIMALS
    );
    mints[partName] = partMint.toBase58();
    console.log(`GGL_${partName} mint:`, partMint.toBase58());
  }

  // Write to config file
  const configPath = path.join(__dirname, '..', 'app', 'config', 'mints.json');
  const configDir = path.dirname(configPath);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  fs.writeFileSync(configPath, JSON.stringify(mints, null, 2));
  console.log(`\n✅ Mint addresses written to ${configPath}`);

  console.log('\n📝 Next steps:');
  console.log('1. Update app/.env.local with these mint addresses');
  console.log('2. Run yarn init-faucet to transfer GGL mint authority to faucet PDA');
  console.log('3. Run yarn init-split to transfer part mint authorities to splitter PDA');
}

createMints().catch(console.error);


