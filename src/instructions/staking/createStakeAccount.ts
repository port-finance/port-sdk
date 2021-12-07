import { PublicKey, SYSVAR_RENT_PUBKEY, TransactionInstruction } from '@solana/web3.js';
import * as BufferLayout from 'buffer-layout';
import { AccessType, getAccess } from 'src/utils/Instructions';
import { StakingInstructions } from './instructions';

/// Accounts expected by this instruction:
///
///   0. `[writable]` Stake account - uninitialized.
///   1. `[]` Staking Pool.
///   2. `[]` Stake account owner.
///   3. `[]` Rent sysvar.

export function createStakeAccountInstruction(
  transaction: Transaction,
  stakeAccountPubkey: PublicKey, // 0
  stakingPoolPubkey: PublicKey, // 1
): TransactionInstruction {
  const dataLayout = BufferLayout.struct([BufferLayout.u8('instruction')]);
  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    { instruction: StakingInstructions.CreateStakeAccount },
    data,
  );

  const keys = [
    getAccess(stakeAccountPubkey, AccessType.WRITE),
    getAccess(stakingPoolPubkey, AccessType.READ),
    transaction.getWalletId().getAccess(AccessType.READ),
    getAccess(SYSVAR_RENT_PUBKEY, AccessType.READ)
  ];

  const programId = transaction.getStakingProgramId();
  if (!programId) {
    throw new Error('Missing staking program ID');
  }

  return new TransactionInstruction({ keys, programId, data });
}
