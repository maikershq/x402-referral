# x402-Powered Referral Engine — Arch + Monetization

## Architecture (MVP → prod)

### Campaign Registry (Solana program)
- Stores: campaign_id, merchant pubkey, pricing (payout_per_action), caps, start/end, affiliate allowlist (optional)
- Writes immutable event hashes for audit: keccak(conv_id | affiliate | timestamp | amount)

### Tracking + Verifier (server)
- Webhooks from merchant apps (signup, purchase, etc.)
- Dedupe, cooldowns, fingerprinting, IP/ASN heuristics, captcha score, bot lists
- Produces a signed "conversion proof" → posts hash on-chain

### Payout Service (x402 client)
- For each verified conversion: hits affiliate's /invoice endpoint → gets HTTP 402 → pays USDC via x402 → stores receipt (payment hash, invoice id)
- Fallback: custodial payout to affiliate's USDC address if they don't host x402

### SDKs
- Merchant SDK: track('signup'|'purchase', meta) + webhook template
- Affiliate SDK: one-liner to spin up an /invoice x402 endpoint (Node/Rust)

### Referral Links
- /{campaign_id}/{affiliate_id}?sig=... with short TTL JWT; UTM passthrough; optional on-chain click attestation (cheap)

### Dashboard
- Real-time: clicks, conversions, fraud flags, paid/unpaid, on-chain proofs, x402 receipts

### Data model (off-chain DB)
- Campaign, Affiliate, Click, Conversion, Proof, Payout

## Agent Economy Integration

**Positioning:** Open infrastructure enabling **autonomous AI agents** to participate in the referral economy without human intervention.

### AI Agents as Affiliates
- **Autonomous discovery**: Agents query on-chain registry to find relevant campaigns
- **Auto-monetization**: Agents generate referral links, promote products, earn USDC instantly via x402
- **Framework support**: SDKs/plugins for elizaOS, LangChain, AutoGPT, Agent Protocol
- **No custody hassle**: Each agent hosts `/invoice` endpoint → receives payments directly

### AI Agents as Merchants
- Agent-operated services create campaigns to drive adoption
- Agent-to-agent referral networks (e.g., data labeling agent refers to training platform)
- Programmatic campaign management via on-chain calls

### Use Cases
- **Customer service agents**: Earn commissions for app signups during support interactions
- **Content creation agents**: Monetize tool recommendations in generated content
- **Research/analysis agents**: Get paid for high-converting insights
- **Specialized assistants**: Domain experts refer users to relevant platforms

### Why x402 + Solana = Agent-Native
- **x402**: Agents request payment via standard HTTP 402 → no wallet integration complexity
- **Solana**: Fast, cheap proof attestation → agents verify earnings on-chain in real-time
- **Permissionless**: Any agent can join → no approval, no custody, no middleman

## Flow

### Human-Driven
1. Merchant creates campaign → Solana registry entry
2. Affiliate gets referral URL
3. User converts → merchant webhook → Verifier checks → posts proof hash on-chain
4. Payout Service requests affiliate /invoice → pays via x402 → records receipt → marks paid
5. Dashboard shows proof↔receipt linkage

### Agent-Driven
1. Agent queries registry on-chain → selects campaign matching its specialty
2. Agent autonomously generates/shares referral links in interactions
3. User converts → webhook → proof on-chain
4. Payout service hits agent's `/invoice` → agent receives USDC via x402
5. Agent verifies payment on-chain → adjusts promotion strategy based on conversion data

## Fraud controls (built-in)

- Multi-touch attribution with last-click + time decay
- Device/agent fingerprint, ASN risk, geo anomalies, velocity limits
- On-chain deposit/bond per affiliate (slash on proven fraud, optional)
- Post-pay clawback window with escrow (configurable)

## Tech stack

- Solana: Anchor program for registry + proof logs
- x402: Coinbase CDP client; USDC
- Server: Rust (Axum) or Node (Fastify)
- DB: Postgres
- Frontend: Next.js 14+ (App Router)
- Signatures: Ed25519 (Solana keys) on webhook payloads

### Frontend Stack (React + Solana)

#### Core Dependencies
- **Next.js 14+**: App Router, Server Components, Server Actions
- **@solana/web3.js**: Solana blockchain interaction
- **@solana/wallet-adapter-react**: Wallet integration framework
- **@solana/wallet-adapter-react-ui**: Pre-built wallet UI components
- **@solana/wallet-adapter-wallets**: Support for multiple wallets (Phantom, Solflare, Backpack, etc.)
- **@coral-xyz/anchor**: TypeScript client for Anchor programs
- **@tanstack/react-query**: Data fetching and caching
- **shadcn/ui**: Component library (Button, Dialog, Card, etc.)
- **zod**: Schema validation for forms and API responses

#### Wallet Integration Features
- Multi-wallet support (Phantom, Solflare, Backpack, Solflare Mobile)
- Auto-reconnect on page refresh
- Network switching (devnet/mainnet)
- Transaction signing with user-friendly error handling
- Balance display (SOL + USDC)
- Copy address functionality

#### Pages & Features

**Merchant Dashboard** (`/merchant`)
- Connect wallet (authority check)
- Create campaign form (budget, payout amount, caps, duration)
- Campaign list with status (active/paused/ended)
- Real-time analytics: total clicks, conversions, payouts, ROI
- Webhook endpoint configuration
- Transaction history with Solscan links

**Affiliate Dashboard** (`/affiliate`)
- Connect wallet (affiliate identity)
- Browse available campaigns (query on-chain registry)
- Generate referral link for selected campaign
- Copy/share referral link with QR code
- Earnings tracker: pending, paid, total
- Payment history with x402 receipt links
- x402 endpoint setup guide

**Public Pages**
- Landing page with demo video embed
- Campaign discovery (no wallet required)
- Referral link handler (`/r/[campaign]/[affiliate]`)
- Demo merchant shop (signup/purchase flows)

#### State Management
- Wallet context (connected wallet, balance, network)
- Campaign state (TanStack Query for server state)
- Form state (React Hook Form + zod validation)
- Toast notifications (sonner)

#### Wallet Integration Pattern

**Provider Setup** (`app/layout.tsx`)
```typescript
<WalletProvider wallets={[phantom, solflare, backpack]} autoConnect>
  <WalletModalProvider>
    {children}
  </WalletModalProvider>
</WalletProvider>
```

**Hook Usage**
```typescript
const { publicKey, connected, signTransaction } = useWallet();
const { connection } = useConnection();
```

**Transaction Flow**
1. User clicks "Create Campaign" → validate form → build transaction
2. Request signature via `signTransaction(tx)`
3. Send to RPC via `connection.sendRawTransaction()`
4. Show toast with tx signature → link to Solscan
5. Poll confirmation status → update UI on success

**Auth Pattern**
- Merchant creates campaign: verify `publicKey` matches on-chain authority
- Sign message for API auth: `signMessage(nonce)` → verify on server
- Session management: store wallet signature + timestamp in JWT

**Network Configuration**
- Devnet: `https://api.devnet.solana.com`
- Commitment level: `confirmed` for UI updates, `finalized` for payouts
- Fallback RPC endpoints for reliability

## Monetization

### Take rate
- 1–3% of paid referrals (config per campaign size)

### SaaS tiers
- **Starter**: $99/mo (≤50k events)
- **Growth**: $499/mo (priority webhooks, advanced fraud)
- **Enterprise**: custom SLAs, white-label

### Add-ons
- Managed escrow/clawback: +0.5%
- Fraud ML: +$0.001/event
- Compliance pack (GDPR tooling, data residency): flat monthly
- Optional float on pre-funded balances (non-custodial or regulated partner—jurisdiction-dependent)

## What to build for the hackathon (2–3 days)

### Core Components

#### 1. Anchor Program (`programs/referral-registry`)
- Campaign registry account structure
- `create_campaign` instruction (merchant only)
- `log_proof` instruction (verifier authority)
- Event emissions for indexing

#### 2. Backend Service (`server/`)
- **Verifier API**: Webhook receiver, fraud detection, proof submission
- **Payout Service**: x402 client, payment orchestration
- **API**: Campaign queries, analytics endpoints
- Auth: Verify Solana signatures on requests

#### 3. React Frontend (`app/`)

**Setup & Configuration**
```typescript
// app/providers/WalletProvider.tsx
- Initialize wallet adapters (Phantom, Solflare, Backpack)
- Configure devnet endpoint
- Auto-reconnect logic
- Error boundary for wallet errors

// app/lib/anchor-client.ts
- Load IDL from Anchor build
- Initialize program client
- Helper functions: getCampaigns(), createCampaign(), etc.
```

**Key Components**
- `WalletButton` - Connect/disconnect with multi-wallet modal
- `CampaignCard` - Display campaign details, generate referral link
- `CreateCampaignForm` - Form with wallet signature for auth
- `TransactionToast` - Show tx status with Solscan link
- `BalanceDisplay` - SOL + USDC balance from connected wallet
- `ReferralLinkGenerator` - Create shareable referral links with signatures

**Pages to Build**
- `/` - Landing page (public)
- `/merchant/dashboard` - Create campaigns, view analytics (wallet required)
- `/affiliate/dashboard` - Browse campaigns, track earnings (wallet required)
- `/r/[campaign]/[affiliate]` - Referral link handler
- `/demo/shop` - Mock e-commerce for testing conversions

#### 4. SDKs (`packages/`)
- `@x402-referral/merchant-sdk` - Track events, generate webhooks
- `@x402-referral/affiliate-sdk` - Spin up x402 invoice endpoint (Node/Deno)
- `@x402-referral/link-utils` - Generate signed referral links with JWT

#### 5. Demo & Documentation
- Demo merchant shop (Next.js with webhook integration)
- Demo affiliate endpoint (simple Express server with x402)
- Video recording setup (OBS, screen capture, voiceover)
- Documentation site or comprehensive README

### Submission Requirements

#### 1. Open Source
- MIT
- Public GitHub repository with clear README
- All code (Anchor program, server, frontend, SDKs)

#### 2. Solana Integration
- ✅ Anchor program deployed to devnet
- ✅ x402 protocol integration (Coinbase CDP client)
- Program ID and deployment instructions in README

#### 3. Demo Video (≤3 minutes)
**Script outline:**
- 0:00-0:30 - Problem: slow, opaque affiliate payouts
- 0:30-1:00 - Solution: merchant creates campaign → shows on-chain registry
- 1:00-1:30 - Affiliate shares referral link → user converts
- 1:30-2:15 - Automated flow: webhook → fraud check → x402 payment (show dashboard)
- 2:15-2:45 - Show on-chain proof + x402 receipt matching
- 2:45-3:00 - "Open infrastructure for agent economy" + repo link

#### 4. Documentation
**Required docs:**
- `README.md` - Overview, architecture diagram, setup instructions
- `docs/SETUP.md` - Environment variables, deployment steps
- `docs/API.md` - Webhook payloads, SDK usage examples
- `docs/DEMO.md` - How to run the demo locally
- Inline code comments for complex logic (fraud detection, proof verification)

### Demo Scenario

**Full Walkthrough with Wallet Integration:**

1. **Merchant Setup**
   - Visit `/merchant/dashboard`
   - Click "Connect Wallet" → Phantom modal appears
   - Approve connection → wallet address displayed in header
   - Click "Create Campaign"
   - Fill form: "Demo Shop Signups", $5/conversion, 100 max payouts
   - Click "Create" → sign transaction in Phantom
   - Transaction confirmed → campaign appears in registry
   - Copy webhook URL for demo shop

2. **Affiliate Onboarding**
   - Visit `/affiliate/dashboard`
   - Connect wallet (different wallet than merchant)
   - Browse campaigns → see "Demo Shop Signups"
   - Click "Generate Referral Link"
   - Copy referral link: `https://app.com/r/demo-shop/AFFpubkey...?sig=...`
   - Share link (paste in chat/Twitter/Discord)

3. **User Conversion**
   - User clicks referral link → lands on demo shop (tracked with affiliate ID in URL)
   - User signs up on demo shop
   - Shop fires webhook to verifier

4. **Automated Verification & Payout**
   - Verifier receives webhook → runs fraud checks → passes
   - Verifier submits proof transaction to Solana
   - Proof hash stored on-chain (visible on Solscan)
   - Payout service queries affiliate's `/invoice` endpoint
   - Gets HTTP 402 response with payment request
   - Pays USDC via x402 protocol
   - x402 receipt generated

5. **Dashboard Update**
   - Affiliate dashboard auto-refreshes
   - Shows new conversion: +$5 pending → paid
   - Click proof link → opens Solscan showing on-chain hash
   - Click payment link → shows x402 receipt
   - Merchant dashboard shows: -$5 payout, conversion metrics updated

## Success metrics

- Median payout latency < 3s after webhook
- Cost/event (infra) < $0.0005 at 100k/day
- Fraud catch rate > 95% on seeded tests