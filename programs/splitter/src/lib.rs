use anchor_lang::prelude::*;
use anchor_spl::token::{self, burn, mint_to, Burn, Mint, MintTo, Token, TokenAccount, Transfer};

declare_id!("SplItEr1111111111111111111111111111111111111111");

const NUM_PARTS: usize = 4;

#[program]
pub mod splitter {
    use super::*;

    pub fn initialize_split(
        ctx: Context<InitializeSplit>,
        googl_mint: Pubkey,
        part_mints: [Pubkey; NUM_PARTS],
    ) -> Result<()> {
        let config = &mut ctx.accounts.split_config;
        config.authority = ctx.accounts.authority.key();
        config.googl_mint = googl_mint;
        config.part_mints = part_mints;
        config.vault_googl_ata = ctx.accounts.vault_googl_ata.key();
        config.bump = ctx.bumps.split_config;
        config.paused = false;
        Ok(())
    }

    pub fn stake_gl(ctx: Context<StakeGl>, amount: u64) -> Result<()> {
        let config = &ctx.accounts.split_config;
        require!(!config.paused, SplitterError::Paused);
        require!(amount > 0, SplitterError::InvalidAmount);

        // Transfer GGL from user to vault
        let seeds = &[
            b"split",
            config.googl_mint.as_ref(),
            &[config.bump],
        ];
        let signer = &[&seeds[..]];

        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.user_googl_ata.to_account_info(),
                    to: ctx.accounts.vault_googl_ata.to_account_info(),
                    authority: ctx.accounts.user.to_account_info(),
                },
            ),
            amount,
        )?;

        // Mint exactly `amount` of each part to user
        // (1:1:1:1 ratio - 1 base unit of each part per 1 base unit of GGL)
        for part_mint in &config.part_mints {
            // Find the part mint account
            let part_mint_account = if part_mint == &ctx.accounts.part_mint_0.key() {
                &ctx.accounts.part_mint_0
            } else if part_mint == &ctx.accounts.part_mint_1.key() {
                &ctx.accounts.part_mint_1
            } else if part_mint == &ctx.accounts.part_mint_2.key() {
                &ctx.accounts.part_mint_2
            } else if part_mint == &ctx.accounts.part_mint_3.key() {
                &ctx.accounts.part_mint_3
            } else {
                return Err(SplitterError::InvalidPartMint.into());
            };

            let mint_seeds = &[
                b"split",
                config.googl_mint.as_ref(),
                &[config.bump],
            ];
            let mint_signer = &[&mint_seeds[..]];

            // Find corresponding user ATA
            let user_part_ata = if part_mint == &ctx.accounts.part_mint_0.key() {
                &ctx.accounts.user_part_ata_0
            } else if part_mint == &ctx.accounts.part_mint_1.key() {
                &ctx.accounts.user_part_ata_1
            } else if part_mint == &ctx.accounts.part_mint_2.key() {
                &ctx.accounts.user_part_ata_2
            } else if part_mint == &ctx.accounts.part_mint_3.key() {
                &ctx.accounts.user_part_ata_3
            } else {
                return Err(SplitterError::InvalidPartMint.into());
            };

            let mint_authority_seeds = &[
                b"split",
                config.googl_mint.as_ref(),
                &[config.bump],
            ];
            let mint_authority_signer = &[&mint_authority_seeds[..]];

            mint_to(
                CpiContext::new_with_signer(
                    ctx.accounts.token_program.to_account_info(),
                    MintTo {
                        mint: part_mint_account.to_account_info(),
                        to: user_part_ata.to_account_info(),
                        authority: ctx.accounts.split_mint_authority.to_account_info(),
                    },
                    mint_authority_signer,
                ),
                amount,
            )?;
        }

        Ok(())
    }

    pub fn redeem_gl(ctx: Context<RedeemGl>, sets: u64) -> Result<()> {
        let config = &ctx.accounts.split_config;
        require!(!config.paused, SplitterError::Paused);
        require!(sets > 0, SplitterError::InvalidAmount);

        let amount_per_part = sets;

        // Burn `sets` of each part from user
        let burn_seeds = &[
            b"split",
            config.googl_mint.as_ref(),
            &[config.bump],
        ];
        let burn_signer = &[&burn_seeds[..]];

        // Burn from each part ATA
        let part_atas = [
            &ctx.accounts.user_part_ata_0,
            &ctx.accounts.user_part_ata_1,
            &ctx.accounts.user_part_ata_2,
            &ctx.accounts.user_part_ata_3,
        ];

        let part_mints = [
            &ctx.accounts.part_mint_0,
            &ctx.accounts.part_mint_1,
            &ctx.accounts.part_mint_2,
            &ctx.accounts.part_mint_3,
        ];

        for (part_mint, part_ata) in part_mints.iter().zip(part_atas.iter()) {
            burn(
                CpiContext::new_with_signer(
                    ctx.accounts.token_program.to_account_info(),
                    Burn {
                        mint: part_mint.to_account_info(),
                        from: part_ata.to_account_info(),
                        authority: ctx.accounts.split_burn_authority.to_account_info(),
                    },
                    burn_signer,
                ),
                amount_per_part,
            )?;
        }

        // Transfer `sets` GGL from vault to user
        // The vault ATA owner is the split_config PDA, which signs this transfer
        let transfer_seeds = &[
            b"split",
            config.googl_mint.as_ref(),
            &[config.bump],
        ];
        let transfer_signer = &[&transfer_seeds[..]];

        // Create authority account for vault ATA (it's the split_config itself)
        let vault_authority_seeds = &[
            b"split",
            config.googl_mint.as_ref(),
            &[config.bump],
        ];
        let vault_authority_signer = &[&vault_authority_seeds[..]];

        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.vault_googl_ata.to_account_info(),
                    to: ctx.accounts.user_googl_ata.to_account_info(),
                    authority: ctx.accounts.split_config.to_account_info(),
                },
                vault_authority_signer,
            ),
            sets,
        )?;

        Ok(())
    }

    pub fn set_paused(ctx: Context<SetPaused>, paused: bool) -> Result<()> {
        require_keys_eq!(
            ctx.accounts.authority.key(),
            ctx.accounts.split_config.authority,
            SplitterError::Unauthorized
        );
        ctx.accounts.split_config.paused = paused;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeSplit<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    /// CHECK: Parent GGL mint
    pub googl_mint: UncheckedAccount<'info>,

    /// CHECK: Part mints array (passed as parameters)
    pub part_mint_0: UncheckedAccount<'info>,
    /// CHECK: Part mints array (passed as parameters)
    pub part_mint_1: UncheckedAccount<'info>,
    /// CHECK: Part mints array (passed as parameters)
    pub part_mint_2: UncheckedAccount<'info>,
    /// CHECK: Part mints array (passed as parameters)
    pub part_mint_3: UncheckedAccount<'info>,

    #[account(
        mut,
        constraint = vault_googl_ata.mint == googl_mint.key(),
        constraint = vault_googl_ata.owner == split_config.key()
    )]
    pub vault_googl_ata: Account<'info, TokenAccount>,

    /// CHECK: PDA for split config
    #[account(
        init,
        payer = authority,
        space = 8 + SplitConfig::LEN,
        seeds = [b"split", googl_mint.key().as_ref()],
        bump
    )]
    pub split_config: Account<'info, SplitConfig>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct StakeGl<'info> {
    #[account(
        seeds = [b"split", split_config.googl_mint.as_ref()],
        bump = split_config.bump
    )]
    pub split_config: Account<'info, SplitConfig>,

    pub googl_mint: Account<'info, Mint>,

    #[account(
        mut,
        constraint = user_googl_ata.mint == googl_mint.key(),
        constraint = user_googl_ata.owner == user.key()
    )]
    pub user_googl_ata: Account<'info, TokenAccount>,

    pub part_mint_0: Account<'info, Mint>,
    pub part_mint_1: Account<'info, Mint>,
    pub part_mint_2: Account<'info, Mint>,
    pub part_mint_3: Account<'info, Mint>,

    /// CHECK: User's part ATAs (will be created if needed)
    #[account(mut)]
    pub user_part_ata_0: UncheckedAccount<'info>,
    #[account(mut)]
    pub user_part_ata_1: UncheckedAccount<'info>,
    #[account(mut)]
    pub user_part_ata_2: UncheckedAccount<'info>,
    #[account(mut)]
    pub user_part_ata_3: UncheckedAccount<'info>,

    #[account(
        mut,
        constraint = vault_googl_ata.mint == googl_mint.key(),
        constraint = vault_googl_ata.key() == split_config.vault_googl_ata
    )]
    pub vault_googl_ata: Account<'info, TokenAccount>,

    /// CHECK: Split mint authority PDA
    #[account(
        seeds = [b"split", split_config.googl_mint.as_ref()],
        bump = split_config.bump
    )]
    pub split_mint_authority: UncheckedAccount<'info>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct RedeemGl<'info> {
    #[account(
        seeds = [b"split", split_config.googl_mint.as_ref()],
        bump = split_config.bump
    )]
    pub split_config: Account<'info, SplitConfig>,

    pub googl_mint: Account<'info, Mint>,

    pub part_mint_0: Account<'info, Mint>,
    pub part_mint_1: Account<'info, Mint>,
    pub part_mint_2: Account<'info, Mint>,
    pub part_mint_3: Account<'info, Mint>,

    #[account(
        mut,
        constraint = user_part_ata_0.mint == part_mint_0.key(),
        constraint = user_part_ata_0.owner == user.key()
    )]
    pub user_part_ata_0: Account<'info, TokenAccount>,
    #[account(
        mut,
        constraint = user_part_ata_1.mint == part_mint_1.key(),
        constraint = user_part_ata_1.owner == user.key()
    )]
    pub user_part_ata_1: Account<'info, TokenAccount>,
    #[account(
        mut,
        constraint = user_part_ata_2.mint == part_mint_2.key(),
        constraint = user_part_ata_2.owner == user.key()
    )]
    pub user_part_ata_2: Account<'info, TokenAccount>,
    #[account(
        mut,
        constraint = user_part_ata_3.mint == part_mint_3.key(),
        constraint = user_part_ata_3.owner == user.key()
    )]
    pub user_part_ata_3: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = user_googl_ata.mint == googl_mint.key(),
        constraint = user_googl_ata.owner == user.key()
    )]
    pub user_googl_ata: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = vault_googl_ata.mint == googl_mint.key(),
        constraint = vault_googl_ata.key() == split_config.vault_googl_ata
    )]
    pub vault_googl_ata: Account<'info, TokenAccount>,

    /// CHECK: Split burn authority PDA
    #[account(
        seeds = [b"split", split_config.googl_mint.as_ref()],
        bump = split_config.bump
    )]
    pub split_burn_authority: UncheckedAccount<'info>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct SetPaused<'info> {
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [b"split", split_config.googl_mint.as_ref()],
        bump = split_config.bump
    )]
    pub split_config: Account<'info, SplitConfig>,
}

#[account]
pub struct SplitConfig {
    pub authority: Pubkey,
    pub googl_mint: Pubkey,
    pub part_mints: [Pubkey; NUM_PARTS],
    pub vault_googl_ata: Pubkey,
    pub bump: u8,
    pub paused: bool,
}

impl SplitConfig {
    pub const LEN: usize = 32 + 32 + (32 * NUM_PARTS) + 32 + 1 + 1;
}

#[error_code]
pub enum SplitterError {
    #[msg("Splitter is paused")]
    Paused,
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Invalid part mint")]
    InvalidPartMint,
}

