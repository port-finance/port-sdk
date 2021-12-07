import {PublicKey, SYSVAR_CLOCK_PUBKEY, TransactionInstruction} from '@solana/web3.js';
import {TOKEN_PROGRAM_ID} from '@solana/spl-token';
import * as BufferLayout from 'buffer-layout';
import { StakingInstructions } from './instructions';
import { AccessType, getAccess } from 'src/utils/Instructions';

/// Claim all unclaimed Reward from a stake account
///
/// Accounts expected by this instruction:
///   0. `[signer]` Stake account owner.
///   1. `[writable]` Stake account.
///   2. `[writable]` Staking pool.
///   3. `[writable]` Reward token pool.
///   4. `[writable]` Reward destination.
///   5. `[]` Staking Pool owner derived from staking pool pubkey
///   6. `[]` Clock sysvar.
///   7. `[]` Token program.
export function claimRewardInstruction(
  transaction: Transaction,
  stakeAccountPubkey: PublicKey, // 1
  stakingPoolPubkey: PublicKey, // 2
  rewardTokenPoolPubkey: PublicKey, // 3,
  rewardDestPubkey: PublicKey, // 4
): TransactionInstruction {
  const dataLayout = BufferLayout.struct([BufferLayout.u8('instruction')]);
  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    { instruction: StakingInstructions.ClaimReward },
    data,
  );

  const keys = [
    transaction.getWalletId().getAccess(AccessType.SIGNER),
    getAccess(stakeAccountPubkey, AccessType.WRITE),
    getAccess(stakingPoolPubkey, AccessType.WRITE),
    getAccess(rewardTokenPoolPubkey, AccessType.WRITE),
    getAccess(rewardDestPubkey, AccessType.WRITE),
    getAccess(SYSVAR_CLOCK_PUBKEY, AccessType.READ),
    getAccess(TOKEN_PROGRAM_ID, AccessType.READ)
  ];

  const programId = transaction.getStakingProgramId();
  if (!programId) {
    throw new Error('Missing staking program ID');
  }

  return new TransactionInstruction({ keys, programId, data });
}
