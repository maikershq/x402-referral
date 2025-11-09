use anchor_lang::prelude::*;

declare_id!("2grt1SPQdTVbb7dhd24LseNR8Rpy7TKcEY3R3raj2cqq");

#[program]
pub mod referral_registry {
    use super::*;

    pub fn create_campaign(
        ctx: Context<CreateCampaign>,
        name: String,
        payout_amount: u64,
        max_payouts: u64,
        start_timestamp: i64,
        end_timestamp: Option<i64>,
    ) -> Result<()> {
        require!(name.len() <= 64, ErrorCode::NameTooLong);
        require!(payout_amount > 0, ErrorCode::InvalidPayoutAmount);
        require!(max_payouts > 0, ErrorCode::InvalidMaxPayouts);

        let campaign = &mut ctx.accounts.campaign;
        campaign.business = ctx.accounts.business.key();
        campaign.name = name;
        campaign.payout_amount = payout_amount;
        campaign.max_payouts = max_payouts;
        campaign.total_payouts = 0;
        campaign.start_timestamp = start_timestamp;
        campaign.end_timestamp = end_timestamp;
        campaign.status = CampaignStatus::Active;
        campaign.bump = ctx.bumps.campaign;

        emit!(CampaignCreated {
            campaign: campaign.key(),
            business: campaign.business,
            name: campaign.name.clone(),
            payout_amount,
            max_payouts,
        });

        Ok(())
    }

    pub fn log_proof(
        ctx: Context<LogProof>,
        conversion_id: String,
        affiliate: Pubkey,
        amount: u64,
        proof_hash: [u8; 32],
    ) -> Result<()> {
        require!(conversion_id.len() <= 64, ErrorCode::ConversionIdTooLong);

        let campaign = &mut ctx.accounts.campaign;
        campaign.total_payouts = campaign.total_payouts.checked_add(1)
            .ok_or(ErrorCode::PayoutOverflow)?;

        require!(
            campaign.total_payouts <= campaign.max_payouts,
            ErrorCode::MaxPayoutsReached
        );

        let clock = Clock::get()?;

        emit!(ProofLogged {
            campaign: campaign.key(),
            conversion_id,
            affiliate,
            amount,
            proof_hash,
            timestamp: clock.unix_timestamp,
        });

        Ok(())
    }

    pub fn pause_campaign(ctx: Context<UpdateCampaign>) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        campaign.status = CampaignStatus::Paused;
        
        emit!(CampaignStatusChanged {
            campaign: campaign.key(),
            status: CampaignStatus::Paused,
        });
        
        Ok(())
    }

    pub fn resume_campaign(ctx: Context<UpdateCampaign>) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        campaign.status = CampaignStatus::Active;
        
        emit!(CampaignStatusChanged {
            campaign: campaign.key(),
            status: CampaignStatus::Active,
        });
        
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct CreateCampaign<'info> {
    #[account(
        init,
        payer = business,
        space = 8 + Campaign::INIT_SPACE,
        seeds = [b"campaign", business.key().as_ref(), name.as_bytes()],
        bump
    )]
    pub campaign: Account<'info, Campaign>,
    
    #[account(mut)]
    pub business: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct LogProof<'info> {
    #[account(mut)]
    pub campaign: Account<'info, Campaign>,
    
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpdateCampaign<'info> {
    #[account(
        mut,
        has_one = business @ ErrorCode::Unauthorized
    )]
    pub campaign: Account<'info, Campaign>,
    
    pub business: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct Campaign {
    pub business: Pubkey,
    #[max_len(64)]
    pub name: String,
    pub payout_amount: u64,
    pub max_payouts: u64,
    pub total_payouts: u64,
    pub start_timestamp: i64,
    pub end_timestamp: Option<i64>,
    pub status: CampaignStatus,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum CampaignStatus {
    Active,
    Paused,
    Ended,
}

#[event]
pub struct CampaignCreated {
    pub campaign: Pubkey,
    pub business: Pubkey,
    pub name: String,
    pub payout_amount: u64,
    pub max_payouts: u64,
}

#[event]
pub struct ProofLogged {
    pub campaign: Pubkey,
    pub conversion_id: String,
    pub affiliate: Pubkey,
    pub amount: u64,
    pub proof_hash: [u8; 32],
    pub timestamp: i64,
}

#[event]
pub struct CampaignStatusChanged {
    pub campaign: Pubkey,
    pub status: CampaignStatus,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Campaign name is too long (max 64 characters)")]
    NameTooLong,
    #[msg("Payout amount must be greater than 0")]
    InvalidPayoutAmount,
    #[msg("Max payouts must be greater than 0")]
    InvalidMaxPayouts,
    #[msg("Conversion ID is too long (max 64 characters)")]
    ConversionIdTooLong,
    #[msg("Maximum payouts reached for this campaign")]
    MaxPayoutsReached,
    #[msg("Payout counter overflow")]
    PayoutOverflow,
    #[msg("Unauthorized: only campaign business can perform this action")]
    Unauthorized,
}
