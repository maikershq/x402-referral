# x402 Referral

> Open-source infrastructure enabling autonomous AI agents to participate in the referral economy on Solana

**Built with x402 payment protocol + Solana blockchain + Agent Economy integration**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Solana](https://img.shields.io/badge/Solana-Devnet-green)](https://solana.com)

## Overview

x402 Referral is a permissionless referral platform that combines:
- **Solana blockchain** for transparent campaign registry and proof logging
- **x402 protocol** for instant cryptocurrency payouts (HTTP 402)
- **Agent Economy** support for autonomous AI agents to earn and transact

### Key Features

✅ **On-chain transparency** - All campaigns and conversion proofs stored on Solana  
✅ **Instant payouts** - Automated USDC payments via x402 protocol (< 3s latency)  
✅ **Fraud prevention** - Built-in detection with IP/fingerprint/velocity checks  
✅ **Agent-native** - AI agents can discover campaigns, generate links, and earn autonomously  
✅ **Permissionless** - No approval needed, just connect wallet and start

## Architecture

```
┌─────────────────┐
│   Merchant      │ Creates campaign
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  Campaign Registry (Solana Program)     │ ◄── On-chain
│  - Campaign metadata                    │
│  - Proof event logs (immutable)         │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────┐         ┌──────────────────┐
│   Affiliate     │────────►│  Referral Link   │
└─────────────────┘         └──────────────────┘
                                     │
                                     ▼
                            ┌──────────────────┐
                            │   User Converts  │
                            └────────┬─────────┘
                                     │
                                     ▼
                            ┌──────────────────────┐
                            │ Webhook → Verifier   │
                            │ - Fraud checks       │
                            │ - Submit proof       │
                            └────────┬─────────────┘
                                     │
                                     ▼
                            ┌──────────────────────┐
                            │   Payout Service     │
                            │ - Query /invoice     │
                            │ - Pay via x402       │
                            │ - USDC on Solana     │
                            └──────────────────────┘
```

## Tech Stack

| Component | Technology |
|-----------|-----------|
| **Blockchain** | Solana (Anchor 0.31.1) |
| **Smart Contracts** | Rust + Anchor Framework |
| **Frontend** | Next.js 16 (App Router) |
| **Payments** | x402 protocol + Coinbase CDP |
| **Wallets** | Phantom, Solflare, Backpack |
| **Database** | PostgreSQL (optional: Vercel Postgres) |
| **Styling** | Tailwind CSS 4 |
| **State** | TanStack Query + Zustand |
| **Validation** | Zod |

## Project Structure

```
x402-referral/
├── anchor/                    # Solana program
│   ├── programs/
│   │   └── referral_registry/ # Campaign registry + proof logging
│   └── tests/                 # Anchor tests
├── app/                       # Next.js frontend + API
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── webhooks/      # Conversion webhooks
│   │   │   ├── campaigns/     # Campaign CRUD
│   │   │   ├── payouts/       # Payout processing
│   │   │   └── x402/          # x402 endpoints
│   │   ├── merchant/          # Merchant dashboard
│   │   ├── affiliate/         # Affiliate dashboard
│   │   ├── r/[campaign]/[affiliate]/  # Referral handler
│   │   └── demo/              # Demo shop
│   ├── components/            # React components
│   ├── lib/
│   │   ├── solana/            # Anchor client
│   │   ├── db/                # Database schema
│   │   └── fraud/             # Fraud detection
│   └── providers/             # Wallet providers
├── packages/                  # Shared SDKs (optional)
└── SPECS.md                   # Detailed specifications
```

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm 9+
- Rust 1.70+
- Solana CLI 2.x (via Anza)
- Anchor CLI (latest via AVM)

### 1. Install Solana CLI 2.x

```bash
# Install Solana 2.x via Anza
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"

# Verify installation
solana --version
```

### 2. Install Anchor CLI via AVM

```bash
# Install Anchor Version Manager
cargo install --git https://github.com/coral-xyz/anchor avm --force

# Verify AVM installation
avm --version

# Install latest Anchor CLI
avm install latest
avm use latest

# Or install specific version
# avm install 0.32.1
# avm use 0.32.1

# Verify Anchor installation
anchor --version
```

### 3. Clone and Install

```bash
git clone https://github.com/maikershq/x402-referral.git
cd x402-referral

# Install Next.js dependencies
cd app && pnpm install

# Install Anchor dependencies
cd ../anchor && yarn install
```

### 4. Setup Environment

```bash
# Copy environment template
cp .env.example .env.local

# Configure your variables (see .env.example for details)
# Required:
# - NEXT_PUBLIC_CDP_CLIENT_KEY (from Coinbase Developer Portal)
# - DATABASE_URL (PostgreSQL connection string)
```

### 5. Build Anchor Program

```bash
cd anchor
anchor build
anchor deploy --provider.cluster devnet

# Copy the program ID and update .env.local
```

### 6. Run Development Server

```bash
cd ../app
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Usage

### For Merchants

1. **Connect Wallet** - Use Phantom/Solflare
2. **Create Campaign** - Set payout amount, max conversions, duration
3. **Get Webhook URL** - Configure in your app to track conversions
4. **Monitor Dashboard** - Real-time analytics, fraud alerts, payouts

### For Affiliates

1. **Connect Wallet** - Connects your identity
2. **Browse Campaigns** - See available campaigns on-chain
3. **Generate Link** - Creates signed referral URL
4. **Share & Earn** - Get paid instantly via x402 when users convert

### For AI Agents

```typescript
// Pseudo-code: Agent discovers and joins campaign
const campaigns = await querySolanaRegistry();
const bestCampaign = agent.selectByCriteria(campaigns);
const referralLink = await generateLink(bestCampaign.id, agent.pubkey);

// Agent promotes link in interactions
// When conversion happens, agent receives USDC via x402 /invoice endpoint
```

## Development

### Run Tests

```bash
# Anchor tests
cd anchor
anchor test

# Frontend tests (if implemented)
cd app
pnpm test
```

### Build for Production

```bash
# Build Anchor program
cd anchor
anchor build

# Build Next.js app
cd ../app
pnpm build
```

### Deploy to Mainnet

1. Update `Anchor.toml` to use mainnet
2. Get mainnet RPC endpoint (Helius/QuickNode recommended)
3. Deploy program: `anchor deploy --provider.cluster mainnet-beta`
4. Update frontend env vars with mainnet config
5. Deploy frontend to Vercel: `vercel deploy --prod`

## Environment Variables

See `.env.example` for all configuration options.

Key variables:
- `NEXT_PUBLIC_SOLANA_NETWORK` - devnet or mainnet-beta
- `NEXT_PUBLIC_PROGRAM_ID` - Your deployed Anchor program ID
- `NEXT_PUBLIC_CDP_CLIENT_KEY` - Coinbase CDP API key
- `DATABASE_URL` - PostgreSQL connection string

## Fraud Controls

Built-in fraud detection includes:
- Device fingerprinting
- IP/ASN risk scoring
- Velocity limits (conversions per time window)
- Geo-anomaly detection
- Multi-touch attribution

Configure thresholds in `lib/fraud/detector.ts`

## Agent Economy Integration

### Supported Frameworks
- elizaOS
- LangChain
- AutoGPT
- Agent Protocol

### Agent Use Cases
- Customer service agents earning commissions
- Content creation agents monetizing recommendations
- Analysis agents getting paid for insights
- Specialized assistants referring to platforms

## API Reference

### Webhooks

**POST** `/api/webhooks/conversion`
```json
{
  "campaign_id": "string",
  "affiliate_id": "string",
  "conversion_type": "signup|purchase",
  "metadata": { "fingerprint": "string" }
}
```

### Campaigns

**GET** `/api/campaigns` - List all campaigns  
**POST** `/api/campaigns` - Create new campaign (requires wallet signature)

### x402 Invoice

**GET** `/api/x402/invoice?amount=5&conversion_id=123`  
Returns HTTP 402 with payment request details

## Contributing

Contributions welcome! Please open an issue or PR.

1. Fork the repo
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## Security

- Smart contracts audited: ❌ (TODO)
- Bug bounty program: ❌ (TODO)
- Report vulnerabilities: security@example.com

## License

MIT License - see [LICENSE](LICENSE) file

## Resources

- [SPECS.md](./SPECS.md) - Detailed technical specifications
- [x402 Protocol](https://x402.org) - Payment protocol docs
- [Solana Docs](https://docs.solana.com) - Solana blockchain
- [Anchor Book](https://book.anchor-lang.com) - Anchor framework

## Quick Demo

### Try It Locally

```bash
# 1. Start dev server
cd app && pnpm dev

# 2. Open browser to http://localhost:3000

# 3. Try the flow:
# - Go to /merchant/dashboard → Connect wallet → Create campaign
# - Go to /affiliate/dashboard → Connect wallet → Generate referral link  
# - Click referral link → Complete signup on demo shop
# - See conversion tracked with fraud check and proof generation!
```

### Demo Flow

1. **Merchant** creates campaign on-chain (Solana transaction)
2. **Affiliate** generates referral link (unique per affiliate)
3. **User** clicks link → tracked via session → signs up on demo shop
4. **System** validates (fraud check) → generates proof → processes payout
5. **Result**: Affiliate earns USDC in <3 seconds ⚡

See [DEMO.md](./DEMO.md) for complete demo guide and video script.

## Demo Video

🎥 Demo video coming soon (see DEMO.md for recording script)

## Support

- GitHub Issues: [Create an issue](https://github.com/maikershq/x402-referral/issues)
- Discord: [Join community](https://discord.gg/your-server)
- Email: support@example.com

---

**Built for the Solana Agent Economy Hackathon**  
*Enabling autonomous agents to transact and earn on-chain* 🚀

