import { Program, AnchorProvider, BN, Wallet } from '@coral-xyz/anchor';
import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import type { ReferralRegistry } from './referral_registry';
import idlJson from './referral_registry.json';
import bs58 from 'bs58';

export const PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_PROGRAM_ID || '2grt1SPQdTVbb7dhd24LseNR8Rpy7TKcEY3R3raj2cqq'
);

export function getServerProgram(): Program<ReferralRegistry> {
  const connection = new Connection(
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com',
    'confirmed'
  );

  const authorityKeyPair = Keypair.fromSecretKey(
    bs58.decode(process.env.SOLANA_AUTHORITY_PRIVATE_KEY || '')
  );

  const wallet = new Wallet(authorityKeyPair);
  const provider = new AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
  });

  return new Program(idlJson as unknown as ReferralRegistry, provider);
}

export function getCampaignPDA(business: PublicKey, name: string) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('campaign'), business.toBuffer(), Buffer.from(name)],
    PROGRAM_ID
  );
}

export async function submitProofToChain(
  campaignPda: PublicKey,
  conversionId: string,
  affiliate: PublicKey,
  amount: BN,
  proofHash: number[]
): Promise<string> {
  const program = getServerProgram();

  const tx = await program.methods
    .logProof(conversionId, affiliate, amount, proofHash)
    .accounts({
      campaign: campaignPda,
      authority: program.provider.publicKey,
    })
    .rpc();

  return tx;
}

export async function getCampaignFromChain(campaignPda: PublicKey) {
  const program = getServerProgram();
  try {
    const campaign = await program.account.campaign.fetch(campaignPda);
    return campaign;
  } catch (error) {
    console.error('Error fetching campaign from chain:', error);
    return null;
  }
}

