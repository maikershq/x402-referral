# Installation Guide

Complete setup instructions for x402-referral development environment.

## Prerequisites

Before starting, ensure you have:
- **macOS, Linux, or WSL2** (Windows Subsystem for Linux)
- **Rust 1.70+** - [Install Rust](https://rustup.rs/)
- **Node.js 18+** - [Install Node.js](https://nodejs.org/)
- **pnpm 9+** - `npm install -g pnpm`

## Step 1: Install Solana CLI 2.x

Install Solana CLI 2.x using Anza's official installer:

```bash
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
```

Add Solana to your PATH (if not automatically added):

```bash
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
```

Verify installation:

```bash
solana --version
# Expected output: solana-cli 2.x.x
```

### Configure Solana CLI

Set cluster to devnet:

```bash
solana config set --url devnet
```

Create a wallet (if you don't have one):

```bash
solana-keygen new --outfile ~/.config/solana/id.json
```

Airdrop SOL for testing:

```bash
solana airdrop 2
```

## Step 2: Install Anchor CLI via AVM

### Install Anchor Version Manager (AVM)

```bash
cargo install --git https://github.com/coral-xyz/anchor avm --force
```

This will take a few minutes. Once complete, verify:

```bash
avm --version
# Expected output: avm 0.x.x
```

### Install Anchor CLI

Install the latest version:

```bash
avm install latest
avm use latest
```

**OR** install a specific version (recommended for stability):

```bash
avm install 0.32.1
avm use 0.32.1
```

Verify Anchor installation:

```bash
anchor --version
# Expected output: anchor-cli 0.32.1
```

## Step 3: Clone and Install Dependencies

```bash
# Clone repository
git clone https://github.com/maikershq/x402-referral.git
cd x402-referral
```

### Install Next.js App Dependencies

```bash
cd app
pnpm install
```

Expected output: ~1300+ packages installed

### Install Anchor Dependencies

```bash
cd ../anchor
yarn install
```

## Step 4: Configure Environment

### Root Environment

Copy the example environment file:

```bash
cd /path/to/x402-referral
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```bash
# Required
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_CDP_CLIENT_KEY=your_coinbase_cdp_key  # Get from Coinbase Developer Portal

# Database (use Vercel Postgres for quick setup)
DATABASE_URL=postgresql://user:pass@host:5432/x402_referral

# Your Solana wallet
ANCHOR_WALLET=~/.config/solana/id.json
```

### Get Coinbase CDP API Key

1. Visit [Coinbase Developer Portal](https://portal.cdp.coinbase.com/)
2. Create a new project
3. Generate API credentials
4. Copy the Client Key to your `.env.local`

## Step 5: Build Anchor Program

```bash
cd anchor
anchor build
```

First build will take 5-10 minutes (downloads dependencies).

After successful build:

```bash
# Deploy to devnet
anchor deploy --provider.cluster devnet
```

**Important:** Copy the program ID from the output and update:
- `.env.local`: `NEXT_PUBLIC_PROGRAM_ID=<your-program-id>`
- `anchor/Anchor.toml`: Update the program ID in `[programs.localnet]`

## Step 6: Verify Installation

### Test Anchor Program

```bash
cd anchor
anchor test
```

Expected output: Tests should pass ✅

### Start Next.js Dev Server

```bash
cd ../app
pnpm dev
```

Visit http://localhost:3000 - You should see the landing page.

## Common Issues & Solutions

### Issue: Solana CLI not found

**Solution:**
```bash
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
# Add to ~/.bashrc or ~/.zshrc for persistence
```

### Issue: AVM installation fails

**Solution:**
```bash
# Make sure you have the latest Rust
rustup update stable

# Try installing AVM again
cargo install --git https://github.com/coral-xyz/anchor avm --force
```

### Issue: Anchor build fails with version mismatch

**Solution:**
```bash
# Check Anchor version
anchor --version

# Ensure Cargo.toml uses matching version
# Edit anchor/programs/referral_registry/Cargo.toml
anchor-lang = "0.32.1"  # Match your CLI version
```

### Issue: Insufficient SOL for deployment

**Solution:**
```bash
solana airdrop 2
# Wait a few seconds, then try again
```

### Issue: Node version incompatibility

**Solution:**
```bash
# Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node 18
nvm install 18
nvm use 18
```

## Next Steps

After successful installation:

1. ✅ Read [README.md](./README.md) for project overview
2. ✅ Review [SPECS.md](./SPECS.md) for technical details
3. ✅ Start building features (see README.md "Next Steps" section)

## Updating Tools

### Update Solana CLI

```bash
solana-install update
```

### Update Anchor CLI

```bash
avm install latest
avm use latest
```

### Update Dependencies

```bash
# Update Next.js app
cd app
pnpm update

# Update Anchor dependencies
cd ../anchor
yarn upgrade
```

## Support

If you encounter issues not covered here:
- Check [Anchor Documentation](https://book.anchor-lang.com)
- Visit [Solana Stack Exchange](https://solana.stackexchange.com)
- Open an issue on GitHub

---

**Installation complete!** 🎉 You're ready to build on Solana with x402.

