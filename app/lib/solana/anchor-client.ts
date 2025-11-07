import { Program, AnchorProvider, Idl, BN } from '@coral-xyz/anchor';
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';

// This will be replaced with actual IDL after anchor build
// To use: 
// 1. Run `anchor build` in the anchor directory
// 2. Copy anchor/target/idl/referral_registry.json to app/lib/solana/
// 3. Import it and use: import idl from './referral_registry.json';
export type ReferralRegistry = any;

export const PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_PROGRAM_ID || '34x2rCppX9NA7PbvR9Lew2EKXpwWo6Xeg82bKa9muTCG'
);

export function getProgram(connection: Connection, wallet: AnchorWallet): any {
  // Note: This function requires the actual IDL from anchor build
  // For now, return a mock to prevent build errors
  console.warn('Anchor program not initialized - run anchor build first');
  return null;
  
  // Uncomment after anchor build:
  // const provider = new AnchorProvider(connection, wallet, {
  //   commitment: 'confirmed',
  // });
  // const idl = require('./referral_registry.json'); 
  // return new Program(idl, provider);
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
  program: any,
  wallet: AnchorWallet,
  params: CreateCampaignParams
): Promise<string> {
  if (!program) {
    throw new Error('Program not initialized. Run anchor build and import IDL first.');
  }
  
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
  program: any,
  campaignPda: PublicKey
) {
  if (!program) return null;
  try {
    const campaign = await program.account.campaign.fetch(campaignPda);
    return campaign;
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return null;
  }
}

export async function getAllCampaigns(program: any) {
  if (!program) return [];
  try {
    const campaigns = await program.account.campaign.all();
    return campaigns;
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return [];
  }
}

export async function logProof(
  program: any,
  campaignPda: PublicKey,
  conversionId: string,
  affiliate: PublicKey,
  amount: BN,
  proofHash: number[]
): Promise<string> {
  if (!program) {
    throw new Error('Program not initialized');
  }
  
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
  program: any,
  campaignPda: PublicKey,
  merchant: PublicKey
): Promise<string> {
  if (!program) {
    throw new Error('Program not initialized');
  }
  
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
  program: any,
  campaignPda: PublicKey,
  merchant: PublicKey
): Promise<string> {
  if (!program) {
    throw new Error('Program not initialized');
  }
  
  const tx = await program.methods
    .resumeCampaign()
    .accounts({
      campaign: campaignPda,
      merchant,
    })
    .rpc();

  return tx;
}
