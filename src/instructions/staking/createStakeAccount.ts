import {
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from "@solana/web3.js";
import * as BufferLayout from "@solana/buffer-layout";
import { PORT_STAKING } from "../../constants";
import { AccessType, getAccess } from "../../utils/Instructions";
import { StakingInstructions } from "./instruction";

// Accounts expected by this instruction:
//
//   0. `[writable]` Stake account - uninitialized.
//   1. `[]` Staking Pool.
//   2. `[]` Stake account owner.
//   3. `[]` Rent sysvar.

export function createStakeAccountInstruction(
  stakeAccountPubkey: PublicKey, // 0
  stakingPoolPubkey: PublicKey, // 1
  stakeAccountOwnerPubkey: PublicKey, // 2
  stakingProgramId: PublicKey = PORT_STAKING
): TransactionInstruction {
  const dataLayout = BufferLayout.struct([BufferLayout.u8("instruction")]);
  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    { instruction: StakingInstructions.CreateStakeAccount },
    data
  );

  const keys = [
    getAccess(stakeAccountPubkey, AccessType.WRITE),
    getAccess(stakingPoolPubkey, AccessType.READ),
    getAccess(stakeAccountOwnerPubkey, AccessType.READ),
    getAccess(SYSVAR_RENT_PUBKEY, AccessType.READ),
  ];

  return new TransactionInstruction({
    keys,
    programId: stakingProgramId,
    data,
  });
}
