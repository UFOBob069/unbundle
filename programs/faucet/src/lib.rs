use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

declare_id!("FauCet1111111111111111111111111111111111111111");

#[program]
pub mod faucet {
    use super::*;

    pub fn initialize_faucet(
        ctx: Context<InitializeFaucet>,
        googl_mint: Pubkey,
        cooldown_seconds: i64,
    ) -> Result<()> {
        let config = &mut ctx.accounts.faucet_config;
        config.authority = ctx.accounts.authority.key();
        config.googl_mint = googl_mint;
        config.cooldown_seconds = cooldown_seconds;
        config.mint_authority = ctx.accounts.mint_authority.key();
        config.bump = ctx.bumps.faucet_config;
        config.paused = false;
        Ok(())
    }

    pub fn claim_one(ctx: Context<ClaimOne>) -> Result<()> {
        let config = &ctx.accounts.faucet_config;
        require!(!config.paused, FaucetError::Paused);

        let user = &mut ctx.accounts.faucet_user;
        let clock = Clock::get()?;
        let current_time = clock.unix_timestamp;

        if user.last_claim_unix > 0 {
            let elapsed = current_time - user.last_claim_unix;
            require!(
                elapsed >= config.cooldown_seconds,
                FaucetError::CooldownNotMet
            );
        }

        // Mint 10 GGL (10 * 10^6 base units with 6 decimals)
        let amount = 10u64
            .checked_mul(1_000_000u64)
            .ok_or(FaucetError::MathOverflow)?;

        let seeds = &[
            b"faucet",
            config.googl_mint.as_ref(),
            &[config.bump],
        ];
        let signer = &[&seeds[..]];

        token::mint_to(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                token::MintTo {
                    mint: ctx.accounts.googl_mint.to_account_info(),
                    to: ctx.accounts.user_googl_ata.to_account_info(),
                    authority: ctx.accounts.mint_authority.to_account_info(),
                },
                signer,
            ),
            amount,
        )?;

        user.last_claim_unix = current_time;
        Ok(())
    }

    pub fn set_paused(ctx: Context<SetPaused>, paused: bool) -> Result<()> {
        require_keys_eq!(
            ctx.accounts.authority.key(),
            ctx.accounts.faucet_config.authority,
            FaucetError::Unauthorized
        );
        ctx.accounts.faucet_config.paused = paused;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeFaucet<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    pub googl_mint: Account<'info, Mint>,

    /// CHECK: PDA derived from ["faucet", googl_mint]
    #[account(
        init,
        payer = authority,
        space = 8 + FaucetConfig::LEN,
        seeds = [b"faucet", googl_mint.key().as_ref()],
        bump
    )]
    pub faucet_config: Account<'info, FaucetConfig>,

    /// CHECK: PDA that will be mint authority
    #[account(
        seeds = [b"faucet", googl_mint.key().as_ref()],
        bump
    )]
    pub mint_authority: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimOne<'info> {
    #[account(
        seeds = [b"faucet", faucet_config.googl_mint.as_ref()],
        bump = faucet_config.bump
    )]
    pub faucet_config: Account<'info, FaucetConfig>,

    pub googl_mint: Account<'info, Mint>,

    /// CHECK: Mint authority PDA
    #[account(
        seeds = [b"faucet", faucet_config.googl_mint.as_ref()],
        bump = faucet_config.bump
    )]
    pub mint_authority: UncheckedAccount<'info>,

    #[account(mut)]
    pub user: Signer<'info>,

    /// CHECK: User's GGL ATA (will be created if needed)
    #[account(mut)]
    pub user_googl_ata: UncheckedAccount<'info>,

    /// CHECK: Faucet user PDA
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + FaucetUser::LEN,
        seeds = [b"faucet_user", user.key().as_ref()],
        bump
    )]
    pub faucet_user: Account<'info, FaucetUser>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SetPaused<'info> {
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [b"faucet", faucet_config.googl_mint.as_ref()],
        bump = faucet_config.bump
    )]
    pub faucet_config: Account<'info, FaucetConfig>,
}

#[account]
pub struct FaucetConfig {
    pub authority: Pubkey,
    pub googl_mint: Pubkey,
    pub cooldown_seconds: i64,
    pub mint_authority: Pubkey,
    pub bump: u8,
    pub paused: bool,
}

impl FaucetConfig {
    pub const LEN: usize = 32 + 32 + 8 + 32 + 1 + 1;
}

#[account]
pub struct FaucetUser {
    pub wallet: Pubkey,
    pub last_claim_unix: i64,
}

impl FaucetUser {
    pub const LEN: usize = 32 + 8;
}

#[error_code]
pub enum FaucetError {
    #[msg("Faucet is paused")]
    Paused,
    #[msg("Cooldown period not met")]
    CooldownNotMet,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Math overflow")]
    MathOverflow,
}


