# Quick Start Guide

Get up and running with X402 Referral Engine in 5 minutes.

## ⚡ Fast Track (For Demo)

### 1. Prerequisites

```bash
# Check you have these installed:
node --version    # v18+
pnpm --version    # v9+
anchor --version  # v0.32.1
solana --version  # v2.x
```

Don't have them? See [INSTALL.md](./INSTALL.md) for setup.

### 2. Install Dependencies

```bash
# Clone repo (if you haven't already)
git clone https://github.com/your-org/x402-referral.git
cd x402-referral

# Install Next.js dependencies
cd app
pnpm install
```

### 3. Start Development Server

```bash
cd app
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

### 4. Try the Demo Flow

**Without wallet** (UI only):
- Browse landing page
- Visit `/merchant/dashboard`
- Visit `/affiliate/dashboard`  
- Visit `/demo/shop`

**With wallet** (full functionality):
1. Connect Phantom wallet
2. Go to `/merchant/dashboard` → Create Campaign
3. Go to `/affiliate/dashboard` → Generate Link
4. Click link → Complete signup on demo shop
5. See conversion tracked!

---

## 🔧 Full Setup (With Anchor)

### 1. Build Anchor Program

```bash
cd anchor
anchor build
```

This takes 5-10 minutes on first build.

### 2. Deploy to Devnet

```bash
# Make sure you have SOL for deployment
solana balance  # Check balance
solana airdrop 2  # If needed

# Deploy
anchor deploy --provider.cluster devnet
```

Copy the Program ID from output.

### 3. Configure Environment

```bash
cd ..
cp .env.example .env.local
```

Edit `.env.local`:
```bash
NEXT_PUBLIC_PROGRAM_ID=<paste-program-id-here>
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
```

### 4. Copy IDL to Frontend

```bash
# After anchor build completes:
cp anchor/target/idl/referral_registry.json app/lib/solana/
```

Update `app/lib/solana/anchor-client.ts`:
```typescript
// Replace getProgram() with:
import idl from './referral_registry.json';

export function getProgram(connection: Connection, wallet: AnchorWallet) {
  const provider = new AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
  });
  return new Program(idl as any, provider);
}
```

### 5. Restart Dev Server

```bash
cd app
pnpm dev
```

Now campaigns will actually be created on Solana! 🚀

---

## 🎮 Interactive Demo

### Scenario: Holiday Sale Campaign

**As Merchant:**
```bash
1. Open http://localhost:3000/merchant/dashboard
2. Click "Connect Wallet" (Phantom)
3. Click "Create Campaign"
4. Fill:
   - Name: Holiday Sale Signups
   - Payout: 5.00 USDC
   - Max Payouts: 100
   - Duration: 30 days
5. Click "Create" → Approve in Phantom
6. Wait for confirmation toast ✅
```

**As Affiliate:**
```bash
1. Open http://localhost:3000/affiliate/dashboard (new incognito window)
2. Click "Connect Wallet" (different wallet)
3. See "Holiday Sale Signups" campaign
4. Click "Generate Referral Link"
5. Click "Copy" button
6. Paste link in new tab
```

**As User:**
```bash
1. Click the referral link
2. See "Referral detected!" message
3. Enter email: test@example.com
4. Click "Sign Up Now"
5. See success messages! 🎉
```

**Check Results:**
- Affiliate dashboard shows +$5.00 earnings
- Merchant dashboard shows conversion tracked
- Console logs show fraud check passed

---

## 🐛 Common Issues

### "Anchor program not initialized"
**Solution:** This is expected before running `anchor build`. The app works for UI demo, but campaign creation requires the Anchor program to be built and deployed.

### "Wallet connection failed"
**Solution:** Make sure Phantom wallet is:
1. Installed in your browser
2. Set to Devnet (Settings → Network → Devnet)
3. Has some SOL (for transaction fees)

### "Transaction failed"
**Solution:**
```bash
# Check wallet has SOL
solana balance

# Airdrop if needed
solana airdrop 2
```

### "Build errors"
**Solution:**
```bash
# Clear caches and rebuild
cd app
rm -rf .next
pnpm build
```

---

## 📺 Demo Mode (No Anchor Required)

Want to demo the UI without deploying to Solana? You can!

The app works in "demo mode" showing:
- ✅ Wallet connection
- ✅ Dashboard UIs
- ✅ Form validation
- ✅ Referral link generation
- ✅ Demo shop flow
- ✅ Webhook tracking
- ✅ Fraud detection

Just skip the Anchor build steps and use the app as-is. Perfect for UI/UX demos!

---

## 🚀 Deploy to Production

### Option A: Vercel (Frontend)

```bash
cd app
vercel deploy
```

Set environment variables in Vercel dashboard.

### Option B: Full Stack (Anchor + Frontend)

1. Deploy Anchor to mainnet:
```bash
cd anchor
anchor deploy --provider.cluster mainnet-beta
```

2. Update `.env` with mainnet config
3. Deploy frontend to Vercel with mainnet env vars

---

## 📚 Next Steps

- **Read [DEMO.md](./DEMO.md)** - Full demo script and video guide
- **Read [SPECS.md](./SPECS.md)** - Technical architecture details  
- **Read [INSTALL.md](./INSTALL.md)** - Complete installation guide
- **Watch demo video** - (link coming soon)

---

## 💡 Pro Tips

1. **Use devnet for demos** - Free SOL, fast iterations
2. **Multiple wallets** - Use different wallets for merchant vs affiliate
3. **Incognito windows** - Simulate different users
4. **Check console** - Logs show fraud detection and webhook processing
5. **Keep it simple** - Demo the core flow, don't overcomplicate

---

**Ready to demo in <5 minutes!** ⚡

The complete referral system with blockchain transparency and instant payouts.

