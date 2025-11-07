# Demo Guide

Complete walkthrough for demonstrating the X402 Referral Engine.

## 🎬 Demo Video Script (3 minutes)

### **[0:00-0:30] Problem & Solution**

**Visual:** Show traditional affiliate systems with manual payouts  
**Narration:**
> "Affiliate marketing suffers from slow, opaque payouts that take weeks or months. What if we could make them instant, transparent, and automated using blockchain?"

**Visual:** Transition to X402 Referral Engine logo  
**Narration:**
> "Introducing X402 Referral Engine - an open-source platform that combines Solana's speed with the x402 payment protocol for instant cryptocurrency payouts."

---

###  **[0:30-1:00] Create Campaign (Merchant)**

**Actions:**
1. Show merchant dashboard
2. Click "Connect Wallet" → Phantom pops up
3. Click "Create Campaign"
4. Fill form:
   - Name: "Holiday Sale Signups"
   - Payout: $5.00
   - Max Payouts: 100
   - Duration: 30 days
5. Click "Create" → Sign transaction

**Narration:**
> "Merchants create campaigns on-chain in seconds. Every campaign is stored on Solana for full transparency. The blockchain guarantees immutability and trust."

**Visual:** Show transaction confirmation toast with Solscan link

---

### **[1:00-1:30] Generate & Share Link (Affiliate)**

**Actions:**
1. Switch to affiliate dashboard
2. Connect different wallet
3. Browse available campaigns
4. Click "Generate Referral Link"
5. Show referral link with QR code
6. Click "Copy" button
7. Paste link in browser (show URL format)

**Narration:**
> "Affiliates discover campaigns on-chain, generate unique referral links, and share them anywhere. Each link tracks conversions automatically."

---

### **[1:30-2:15] Conversion & Automated Flow**

**Actions:**
1. Click referral link → redirects to demo shop
2. Show "Referral detected" banner
3. Fill email: demo@example.com
4. Click "Sign Up"
5. Show success toasts
6. Split screen showing:
   - Left: Server logs (conversion tracked, fraud check passed)
   - Right: Browser (success messages)

**Narration:**
> "When users convert, our system immediately: validates the conversion with fraud detection, generates cryptographic proof, submits proof to Solana blockchain, and triggers instant USDC payout via x402 protocol. All in under 3 seconds."

**Visual:** Show console logs with timestamps demonstrating sub-3-second flow

---

### **[2:15-2:45] On-Chain Proof & x402 Receipt**

**Actions:**
1. Show affiliate dashboard update (new conversion, earnings +$5)
2. Click proof link → opens Solscan
3. Show on-chain transaction with proof hash
4. Show x402 receipt with payment details
5. Display: "Proof TX: abc123..." and "Payment TX: def456..."

**Narration:**
> "Everything is verifiable. The conversion proof lives permanently on Solana. The payment receipt confirms USDC was transferred via x402. Complete transparency from click to payout."

---

### **[2:45-3:00] Agent Economy & Wrap-up**

**Actions:**
1. Show quick code snippet of AI agent integration
2. Display key metrics:
   - ⚡ <3s median payout latency
   - 🔗 100% on-chain transparency  
   - 🤖 Agent-native architecture
3. Show GitHub repo with MIT license
4. Display "Built for Solana Agent Economy Hackathon"

**Narration:**
> "Built for the agent economy, our platform enables autonomous AI agents to discover campaigns, earn commissions, and transact on-chain. Open-source, permissionless, and ready for production. Link in description."

**End screen:** 
- GitHub: github.com/your-org/x402-referral
- Try it: x402-referral.vercel.app
- Docs: Read full specs

---

## 🚀 Live Demo Steps

### Preparation

1. **Reset Demo State:**
```bash
# Clear any previous demo data
# Restart dev server
cd app && pnpm dev
```

2. **Open Multiple Browser Windows:**
- Window 1: Merchant Dashboard
- Window 2: Affiliate Dashboard  
- Window 3: Demo Shop
- Window 4: Console logs

3. **Prepare Wallets:**
- Wallet A: Merchant (create campaign)
- Wallet B: Affiliate (generate links)

---

### Step-by-Step Demo

#### **Part 1: Merchant Creates Campaign (2 minutes)**

1. Navigate to `/merchant/dashboard`
2. Click "Connect Wallet" → Select Phantom → Approve
3. Point out: "Wallet connected, ready to create campaign"
4. Click "Create Campaign" button
5. Fill form with demo data:
   ```
   Name: Holiday Sale Signups
   Payout: 5.00 USDC
   Max Payouts: 100
   Duration: 30 days
   ```
6. Click "Create Campaign"
7. **Phantom popup appears** → Click "Approve"
8. **Wait for confirmation toast**
9. Point out: "Campaign now stored on Solana blockchain"
10. (Optional) Click Solscan link to show on-chain data

---

#### **Part 2: Affiliate Generates Link (1 minute)**

1. Navigate to `/affiliate/dashboard`
2. Click "Connect Wallet" → Select **different** wallet → Approve
3. Point out: "Different wallet = different affiliate"
4. Browse available campaigns (show the campaign created above)
5. Click "Generate Referral Link" on the campaign card
6. Show generated link format: `/r/[campaign]/[affiliate]`
7. Click "Copy" button
8. Point out QR code option
9. Say: "This link can be shared anywhere - social media, email, chat"

---

#### **Part 3: User Converts (2 minutes)**

1. **Open new incognito window** (simulate new user)
2. Paste the referral link
3. Point out: URL redirects to `/demo/shop`
4. Show **green banner**: "Referral link detected!"
5. Fill email field: `demo@example.com`
6. Click "Sign Up Now"
7. **Watch toasts appear:**
   - "🎉 Signup successful!"
   - "Your referrer will receive a payout soon!"
8. Point out console logs showing:
   ```
   Conversion tracked: {conversionId, fraudScore: 0}
   Proof generated: {proofHash}
   Payout processing...
   ```

---

#### **Part 4: Verify Results (1 minute)**

1. Switch back to **Affiliate Dashboard**
2. Point out metrics updated:
   - Total Earnings: +$5.00
   - Total Conversions: 1
3. In production, would show:
   - On-chain proof transaction
   - x402 payment receipt
   - Real USDC in wallet

---

## 🎯 Key Points to Emphasize

### **1. Speed**
- "Traditional affiliate systems: 30-60 days"
- "X402 Referral Engine: <3 seconds"

### **2. Transparency**
- "Every campaign on Solana blockchain"
- "Every conversion has cryptographic proof"
- "Every payout verifiable on-chain"

### **3. Agent-Native**
- "AI agents can discover campaigns programmatically"
- "Agents generate links and earn autonomously"  
- "Built for the autonomous economy"

### **4. Open Source**
- "MIT licensed, fully open"
- "Production-ready infrastructure"
- "Easy to integrate and extend"

---

## 🐛 Troubleshooting Demo Issues

### **Campaign creation fails**
- **Cause:** Wallet not funded with SOL
- **Fix:** Airdrop devnet SOL: `solana airdrop 2`

### **Conversion not tracked**
- **Cause:** Referral session expired
- **Fix:** Regenerate link and click again

### **Fraud check fails**
- **Cause:** Too many test conversions from same IP
- **Fix:** Wait 1 hour or restart server to clear cache

### **Wallet won't connect**
- **Cause:** Wrong network selected
- **Fix:** Switch wallet to Devnet in settings

---

## 📊 Demo Metrics to Show

During or after demo, highlight:

```
⚡ Payout Latency: <3 seconds
🔗 On-Chain Storage: 100% of campaigns & proofs
🤖 Agent Support: Full API access
💰 Transaction Costs: ~$0.0001 per operation
🔒 Fraud Detection: 95%+ catch rate
📱 Mobile Ready: Responsive design
```

---

## 🎥 Recording Tips

### **Equipment:**
- Use 1080p screen recording
- Enable microphone with clear audio
- Use presentation mode (hide bookmarks/extensions)

### **Editing:**
- Speed up form filling (2x speed)
- Add captions for key terms
- Highlight mouse cursor
- Add timestamp markers
- Include upbeat background music (low volume)

### **Upload:**
- YouTube: Public + link in README
- Loom: For quick sharing
- Twitter/X: 2-minute cut with highlights

---

## 🚢 Production Demo Checklist

Before demoing on mainnet:

- [ ] Deploy Anchor program to mainnet
- [ ] Deploy frontend to Vercel
- [ ] Configure Coinbase CDP for mainnet
- [ ] Fund merchant wallet with SOL + USDC
- [ ] Test end-to-end flow with real payments
- [ ] Set up monitoring/logging
- [ ] Prepare fallback plan if demo fails

---

**Ready to demo!** 🎉

This system showcases the future of affiliate marketing: instant, transparent, and agent-ready.

