import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
// import { ReferralRegistry } from '../../../anchor/target/types/referral_registry';

export function getAnchorProgram() {
  const programId = new PublicKey(
    process.env.NEXT_PUBLIC_PROGRAM_ID || '34x2rCppX9NA7PbvR9Lew2EKXpwWo6Xeg82bKa9muTCG'
  );

  // TODO: Load IDL and initialize program
  // This will be completed after Anchor program is built
  return null;
}

export async function getCampaigns(connection: Connection) {
  // TODO: Query on-chain campaign accounts
  return [];
}

export async function createCampaign(/* params */) {
  // TODO: Build and send create_campaign instruction
  return null;
}

