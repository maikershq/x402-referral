use anchor_lang::prelude::*;

declare_id!("34x2rCppX9NA7PbvR9Lew2EKXpwWo6Xeg82bKa9muTCG");

#[program]
pub mod referral_registry {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
