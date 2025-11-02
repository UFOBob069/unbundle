# Unbundle Finance - Solana Devnet Demo

A complete Unbundle Finance platform with marketing website and Solana devnet demonstration of token unbundling.

🔗 **Live Demo**: [Deploy to Vercel](#deployment-to-vercel)

## Project Structure

- **`/app`** - Next.js application with:
  - **`/app/page.tsx`** - Main Unbundle Finance website
  - **`/app/app/page.tsx`** - Interactive Solana demo
  - **`/app/components`** - Shared and demo-specific components
- **`/programs`** - Anchor Solana programs (faucet & splitter)
- **`/scripts`** - Deployment and initialization scripts
- **`/tests`** - Anchor integration tests

## Overview

This demo allows users to:
- **Claim** 10 GGL tokens per wallet per 24 hours from a faucet
- **Stake** GGL tokens to receive constituent parts (SEARCH, YT, CLOUD, OTHER) in a 1:1:1:1 ratio
- **Redeem** complete sets of parts to get GGL tokens back

All tokens use 6 decimals. 1 GGL = 1_000_000 base units.

## Tech Stack

- **Anchor 0.29+** - Solana program framework
- **Rust** - Anchor programs
- **Next.js + TypeScript** - Frontend
- **Solana Wallet Adapter** - Wallet integration
- **SPL Token** - Token operations

## Prerequisites

1. **Rust** (stable)
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. **Solana CLI** (v1.18+)
   ```bash
   sh -c "$(curl -sSfL https://release.solana.com/v1.18.0/install)"
   ```

3. **Anchor** (v0.29.0+)
   ```bash
   cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
   avm install 0.29.0
   avm use 0.29.0
   ```

4. **Node.js** (v18+)
   ```bash
   # Use nvm or download from nodejs.org
   ```

5. **Yarn** or **npm**
   ```bash
   npm install -g yarn
   ```

## Setup

### 1. Install Dependencies

```bash
yarn install
```

### 2. Build Programs

```bash
yarn build
```

This compiles both Anchor programs (`faucet` and `splitter`).

### 3. Deploy to Devnet

```bash
# Set Solana CLI to devnet
solana config set --url devnet

# Create a keypair if needed
solana-keygen new

# Airdrop SOL for deployment (if needed)
solana airdrop 2

# Deploy programs
yarn deploy
```

### 4. Create Token Mints

Create the parent token (GGL) and part tokens (SEARCH, YT, CLOUD, OTHER) on devnet:

```bash
yarn create-mints
```

This creates 5 SPL token mints with 6 decimals and writes their addresses to `app/config/mints.json`.

### 5. Initialize Programs

#### Initialize Faucet

```bash
yarn init-faucet
```

This sets the cooldown to 86,400 seconds (24 hours) and links the parent mint.

#### Initialize Splitter

```bash
yarn init-split
```

This links the parent and part mints and creates the program-owned vault ATA.

### 6. Update Environment Variables

Copy `.env.local.example` to `app/.env.local` and update with:
- `RPC_URL` - Your devnet RPC endpoint (or use public devnet)
- Program IDs (from `anchor keys list` or deployment output)
- Mint addresses (from `app/config/mints.json`)

### 7. Run Frontend

```bash
cd app
yarn install
yarn dev
```

Visit `http://localhost:3000` to interact with the demo.

## Project Structure

```
/unbundle-demo
  /programs
    /faucet        # Anchor program: mint 10 GGL per wallet per 24h
    /splitter      # Anchor program: stake/redeem GGL ↔ parts
  /app             # Next.js frontend
  /scripts         # Initialization scripts
  /tests           # Anchor integration tests
  Anchor.toml      # Anchor workspace configuration
  package.json     # Root workspace package.json
```

## Programs

### Faucet Program

**Instructions:**
- `initialize_faucet` - Initialize faucet with authority, GGL mint, and cooldown
- `claim_one` - Claim 10 GGL tokens (subject to 24h cooldown)

**Accounts:**
- `FaucetConfig` - PDA storing faucet configuration
- `FaucetUser` - PDA per wallet storing last claim timestamp

### Splitter Program

**Instructions:**
- `initialize_split` - Initialize splitter with parent/part mints
- `stake_gl` - Stake GGL → receive 1 of each part per GGL
- `redeem_gl` - Redeem complete sets of parts → get GGL back

**Accounts:**
- `SplitConfig` - PDA storing splitter configuration
- `vault_googl_ata` - Program-owned ATA holding staked GGL

## Frontend Features

- **Connect Wallet** - Connect Phantom, Solflare, or other Solana wallets
- **Balances** - View GGL and part token balances
- **Claim** - Claim 10 GGL from faucet (once per 24h)
- **Stake** - Stake GGL tokens to receive parts
- **Redeem** - Redeem complete sets of parts for GGL

## Testing

Run Anchor tests:

```bash
yarn test
```

## Important Notes

- **Demo Only**: This is a demonstration on Solana devnet. Tokens are not equity and have no real value.
- **Devnet**: All operations use Solana devnet. Tokens are test tokens.
- **Mint Authorities**: Parent mint authority is set to faucet PDA; part mint authorities are set to splitter PDA.

## Deployment to Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/unbundle)

### Manual Deployment

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Set **Root Directory** to `app`

3. **Add Environment Variables**
   
   In Vercel project settings, add these environment variables:
   ```
   NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
   NEXT_PUBLIC_FAUCET_PROGRAM_ID=AacgyqyCJhybFsvfc7GfAvA5GjV9oc6nqhNGJNSKW477
   NEXT_PUBLIC_SPLITTER_PROGRAM_ID=DMrAqzweWu8UQvCvGK2yfrGwUdkjiav4MafRV1SKxx6j
   NEXT_PUBLIC_GGL_MINT=A4LSQwKv81VU8QJjciJ6FjmEh1auQNWo4jjPN6LrJBCg
   NEXT_PUBLIC_GGL_SEARCH_MINT=CmCvVkLbHBCDh99ofVBnYqSKbRoonCeTJzNdwyD9163t
   NEXT_PUBLIC_GGL_YT_MINT=Cwhfr2HjTswHqVVqXk5vnXBgrmERfiCdADXg5UapvQD6
   NEXT_PUBLIC_GGL_CLOUD_MINT=7KDYsV1akCjcEp4WnSJD3dJHxmeQ6WS6i6bR4tZvM7w9
   NEXT_PUBLIC_GGL_OTHER_MINT=9PbfnELF689JAyudsBXZ9NmF1onoB5ygTiwnuJnPq2Lw
   ```

   Plus any Firebase/Analytics variables from `env.local.example`

4. **Deploy**
   - Click "Deploy"
   - Your site will be live at `https://your-project.vercel.app`
   - Demo available at `https://your-project.vercel.app/app`

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Deployed Programs (Devnet)

These programs are already deployed and initialized on Solana devnet:

- **Faucet Program**: `AacgyqyCJhybFsvfc7GfAvA5GjV9oc6nqhNGJNSKW477`
- **Splitter Program**: `DMrAqzweWu8UQvCvGK2yfrGwUdkjiav4MafRV1SKxx6j`
- **GGL Mint**: `A4LSQwKv81VU8QJjciJ6FjmEh1auQNWo4jjPN6LrJBCg`

Anyone can use these programs on devnet - no additional setup required!

## Features

### Main Website
- Marketing landing page
- Video demo
- Waitlist signup
- "Try Live Demo" button → links to `/app`

### Demo App (`/app`)
- ✅ Connect Solana wallet (Phantom, Solflare, etc.)
- ✅ **Claim** 10 GGL tokens every 24 hours
- ✅ **Stake** GGL → receive SEARCH, YT, CLOUD, OTHER tokens (1:1:1:1 ratio)
- ✅ **Redeem** part tokens → get GGL back
- ✅ View real-time token balances
- ✅ All transactions on Solana devnet

## Troubleshooting

- **Deployment fails**: Ensure you have enough SOL on devnet (`solana balance`)
- **Program IDs mismatch**: Run `anchor keys list` to see program IDs
- **RPC errors**: Try using a custom RPC endpoint (Alchemy, QuickNode, etc.)
- **Vercel build errors**: Check all environment variables are set correctly
- **Demo not working**: Users need SOL on devnet - direct them to https://faucet.solana.com

## License

MIT
