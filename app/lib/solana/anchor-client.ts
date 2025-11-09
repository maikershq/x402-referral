import { Program, AnchorProvider, BN } from '@coral-xyz/anchor';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import type { ReferralRegistry } from './referral_registry';
import idlJson from './referral_registry.json';

export const PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_PROGRAM_ID || '2grt1SPQdTVbb7dhd24LseNR8Rpy7TKcEY3R3raj2cqq'
);

export function getProgram(connection: Connection, wallet: AnchorWallet): Program<ReferralRegistry> {
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

export interface CreateCampaignParams {
  name: string;
  payoutAmount: BN;
  maxPayouts: BN;
  startTimestamp: BN;
  endTimestamp: BN | null;
}

export async function createCampaign(
  program: Program<ReferralRegistry>,
  wallet: AnchorWallet,
  params: CreateCampaignParams
): Promise<string> {
  const tx = await program.methods
    .createCampaign(
      params.name,
      params.payoutAmount,
      params.maxPayouts,
      params.startTimestamp,
      params.endTimestamp
    )
    .accounts({
      business: wallet.publicKey,
    })
    .rpc();

  return tx;
}

export async function getCampaign(
  program: Program<ReferralRegistry>,
  campaignPda: PublicKey
) {
  try {
    const campaign = await program.account.campaign.fetch(campaignPda);
    return campaign;
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return null;
  }
}

export async function getAllCampaigns(program: Program<ReferralRegistry>) {
  try {
    const campaigns = await program.account.campaign.all();
    return campaigns;
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return [];
  }
}

export async function logProof(
  program: Program<ReferralRegistry>,
  campaignPda: PublicKey,
  conversionId: string,
  affiliate: PublicKey,
  amount: BN,
  proofHash: number[]
): Promise<string> {
  const tx = await program.methods
    .logProof(conversionId, affiliate, amount, proofHash)
    .accounts({
      campaign: campaignPda,
      authority: program.provider.publicKey,
    })
    .rpc();

  return tx;
}

export async function pauseCampaign(
  program: Program<ReferralRegistry>,
  campaignPda: PublicKey,
  business: PublicKey
): Promise<string> {
  const tx = await program.methods
    .pauseCampaign()
    .accounts({
      campaign: campaignPda,
    })
    .rpc();

  return tx;
}

export async function resumeCampaign(
  program: Program<ReferralRegistry>,
  campaignPda: PublicKey,
  business: PublicKey
): Promise<string> {
  const tx = await program.methods
    .resumeCampaign()
    .accounts({
      campaign: campaignPda,
    })
    .rpc();

  return tx;
}
