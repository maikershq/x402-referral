import { Program, AnchorProvider, Idl, BN } from '@coral-xyz/anchor';
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';

// This will be replaced with actual IDL after anchor build
export type ReferralRegistry = any;

export const PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_PROGRAM_ID || '34x2rCppX9NA7PbvR9Lew2EKXpwWo6Xeg82bKa9muTCG'
);

export function getProgram(connection: Connection, wallet: AnchorWallet) {
  const provider = new AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
  });

  // Note: IDL will need to be imported after anchor build
  // For now, this is a placeholder structure
  const idl = {
    version: '0.1.0',
    name: 'referral_registry',
    instructions: [],
    accounts: [],
    errors: [],
  } as Idl;

  return new Program(idl, PROGRAM_ID, provider) as Program<ReferralRegistry>;
}

export function getCampaignPDA(merchant: PublicKey, name: string) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('campaign'), merchant.toBuffer(), Buffer.from(name)],
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
  const [campaignPda] = getCampaignPDA(wallet.publicKey, params.name);

  const tx = await program.methods
    .createCampaign(
      params.name,
      params.payoutAmount,
      params.maxPayouts,
      params.startTimestamp,
      params.endTimestamp
    )
    .accounts({
      campaign: campaignPda,
      merchant: wallet.publicKey,
      systemProgram: SystemProgram.programId,
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
  merchant: PublicKey
): Promise<string> {
  const tx = await program.methods
    .pauseCampaign()
    .accounts({
      campaign: campaignPda,
      merchant,
    })
    .rpc();

  return tx;
}

export async function resumeCampaign(
  program: Program<ReferralRegistry>,
  campaignPda: PublicKey,
  merchant: PublicKey
): Promise<string> {
  const tx = await program.methods
    .resumeCampaign()
    .accounts({
      campaign: campaignPda,
      merchant,
    })
    .rpc();

  return tx;
}
