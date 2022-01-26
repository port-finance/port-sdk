import {
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  TransactionInstruction,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import * as BufferLayout from "@solana/buffer-layout";
import { StakingInstructions } from "./instruction";
import { AccessType, getAccess } from "../../utils/Instructions";
import { PORT_STAKING } from "../../constants";

// Claim all unclaimed Reward from a stake account
//
// Accounts expected by this instruction:
//   0. `[signer]` Stake account owner.
//   1. `[writable]` Stake account.
//   2. `[writable]` Staking pool.
//   3. `[writable]` Reward token pool.
//   4. `[writable]` Reward destination.
//   5. `[]` Staking Pool owner derived from staking pool pubkey
//   6. `[]` Clock sysvar.
//   7. `[]` Token program.
export function claimRewardInstruction(
  stakeAccountOwnerPubkey: PublicKey, // 0
  stakeAccountPubkey: PublicKey, // 1
  stakingPoolPubkey: PublicKey, // 2
  rewardTokenPoolPubkey: PublicKey, // 3,
  rewardDestPubkey: PublicKey, // 4
  stakingProgramId: PublicKey = PORT_STAKING,
  destSubAccountId?: PublicKey,
  subRewardTokenPool?: PublicKey
): TransactionInstruction {
  const dataLayout = BufferLayout.struct([BufferLayout.u8("instruction")]);
  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode({ instruction: StakingInstructions.ClaimReward }, data);

  const keys = [
    getAccess(stakeAccountOwnerPubkey, AccessType.SIGNER),
    getAccess(stakeAccountPubkey, AccessType.WRITE),
    getAccess(stakingPoolPubkey, AccessType.WRITE),
    getAccess(rewardTokenPoolPubkey, AccessType.WRITE),
    getAccess(rewardDestPubkey, AccessType.WRITE),
    getAccess(SYSVAR_CLOCK_PUBKEY, AccessType.READ),
    getAccess(TOKEN_PROGRAM_ID, AccessType.READ),
  ];

  if (destSubAccountId && subRewardTokenPool) {
    keys.push(
      getAccess(subRewardTokenPool, AccessType.WRITE),
      getAccess(destSubAccountId, AccessType.WRITE)
    );
  }

  return new TransactionInstruction({
    keys,
    programId: stakingProgramId,
    data,
  });
}
