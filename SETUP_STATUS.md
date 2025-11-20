# Setup Status

## ✅ Completed Steps

1. ✅ **Dependencies installed** - Root and app dependencies installed via npm
2. ✅ **Project structure created** - All Anchor programs, frontend, and scripts are in place

## ⚠️ Required Prerequisites

Before continuing, you need to install:

### 1. Rust (stable)
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
# On Windows, use rustup-init.exe from https://rustup.rs/
```

### 2. Solana CLI (v1.18+)
```bash
# Windows (PowerShell):
sh -c "$(curl -sSfL https://release.solana.com/v1.18.0/install)"
```

Or download from: https://docs.solana.com/cli/install-solana-cli-tools

### 3. Anchor CLI (v0.29.0+)
```bash
# Install avm (Anchor Version Manager)
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force

# Install Anchor 0.29.0
avm install 0.29.0
avm use 0.29.0
```

## 📋 Next Steps (After Installing Prerequisites)

### 1. Configure Solana CLI
```bash
# Set to devnet
solana config set --url devnet

# Create a keypair if needed
solana-keygen new

# Airdrop SOL for deployment
solana airdrop 2
```

### 2. Build Anchor Programs
```bash
anchor build
```

### 3. Deploy to Devnet
```bash
anchor deploy
```

### 4. Create Token Mints
```bash
# Set RPC_URL and ANCHOR_WALLET environment variables if needed
npm run create-mints
```

This will create 5 SPL token mints:
- GGL (parent token)
- GGL_SEARCH
- GGL_YT
- GGL_CLOUD
- GGL_OTHER

The mint addresses will be saved to `app/config/mints.json`

### 5. Initialize Faucet
```bash
npm run init-faucet
```

This will:
- Transfer GGL mint authority to faucet PDA
- Initialize faucet with 24h cooldown

### 6. Initialize Splitter
```bash
npm run init-split
```

This will:
- Transfer part mint authorities to splitter PDA
- Create vault GGL ATA
- Initialize splitter

### 7. Configure Frontend Environment
Copy `app/.env.local.example` to `app/.env.local` and update with:
- RPC_URL (default: https://api.devnet.solana.com)
- Program IDs (from deployment output)
- Mint addresses (from `app/config/mints.json`)

### 8. Start Frontend
```bash
cd app
npm run dev
```

Visit `http://localhost:3000`

## 🔍 Verification

After setup, verify:
- [ ] Anchor programs build without errors
- [ ] Programs deployed to devnet
- [ ] Token mints created (check `app/config/mints.json`)
- [ ] Faucet initialized (check program account on explorer)
- [ ] Splitter initialized (check program account on explorer)
- [ ] Frontend loads without errors
- [ ] Can connect wallet
- [ ] Can view balances

## 📝 Notes

- All tokens use **6 decimals**
- Cooldown period: **86,400 seconds (24 hours)**
- Staking ratio: **1 GGL = 1 of each part** (1:1:1:1)
- Mint authorities are PDAs for security
- This is a **demo on devnet only** - tokens have no real value




