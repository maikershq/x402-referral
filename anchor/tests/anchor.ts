import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { ReferralRegistry } from "../target/types/referral_registry";
import { assert } from "chai";

describe("referral_registry", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.referralRegistry as Program<ReferralRegistry>;
  const merchant = provider.wallet;

  it("Creates a campaign", async () => {
    const campaignName = "Test Campaign";
    const payoutAmount = new BN(5_000_000); // 5 USDC (6 decimals)
    const maxPayouts = new BN(100);
    const startTimestamp = new BN(Math.floor(Date.now() / 1000));
    const endTimestamp = null;

    const [campaignPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("campaign"),
        merchant.publicKey.toBuffer(),
        Buffer.from(campaignName),
      ],
      program.programId
    );

    const tx = await program.methods
      .createCampaign(
        campaignName,
        payoutAmount,
        maxPayouts,
        startTimestamp,
        endTimestamp
      )
      .accounts({
        campaign: campaignPda,
        merchant: merchant.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Campaign created:", tx);

    const campaign = await program.account.campaign.fetch(campaignPda);
    
    assert.equal(campaign.name, campaignName);
    assert.equal(campaign.merchant.toString(), merchant.publicKey.toString());
    assert.equal(campaign.payoutAmount.toString(), payoutAmount.toString());
    assert.equal(campaign.maxPayouts.toString(), maxPayouts.toString());
    assert.equal(campaign.totalPayouts.toString(), "0");
  });

  it("Logs a conversion proof", async () => {
    const campaignName = "Test Campaign";
    const [campaignPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("campaign"),
        merchant.publicKey.toBuffer(),
        Buffer.from(campaignName),
      ],
      program.programId
    );

    const conversionId = "conv_123456";
    const affiliate = anchor.web3.Keypair.generate().publicKey;
    const amount = new BN(5_000_000);
    const proofHash = Array.from(Buffer.alloc(32, 1));

    const tx = await program.methods
      .logProof(conversionId, affiliate, amount, proofHash)
      .accounts({
        campaign: campaignPda,
        authority: merchant.publicKey,
      })
      .rpc();

    console.log("Proof logged:", tx);

    const campaign = await program.account.campaign.fetch(campaignPda);
    assert.equal(campaign.totalPayouts.toString(), "1");
  });

  it("Pauses and resumes a campaign", async () => {
    const campaignName = "Test Campaign";
    const [campaignPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("campaign"),
        merchant.publicKey.toBuffer(),
        Buffer.from(campaignName),
      ],
      program.programId
    );

    // Pause campaign
    await program.methods
      .pauseCampaign()
      .accounts({
        campaign: campaignPda,
        merchant: merchant.publicKey,
      })
      .rpc();

    let campaign = await program.account.campaign.fetch(campaignPda);
    assert.equal(campaign.status.paused !== undefined, true);

    // Resume campaign
    await program.methods
      .resumeCampaign()
      .accounts({
        campaign: campaignPda,
        merchant: merchant.publicKey,
      })
      .rpc();

    campaign = await program.account.campaign.fetch(campaignPda);
    assert.equal(campaign.status.active !== undefined, true);
  });
});
