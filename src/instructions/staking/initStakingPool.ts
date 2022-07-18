import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  Keypair,
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from "@solana/web3.js";
import * as BufferLayout from "@solana/buffer-layout";
import BN from "bn.js";

import * as Layout from "../../serialization/layout";
import { PORT_STAKING } from "../../constants";
import { StakingInstructions } from "./instruction";
import { AccessType, getAccess } from "../../utils/Instructions";

// interface Data {
//   instruction: number;
//   supply: number;
//   duration: number;
//   earliestRewardTime: number;
//   bumpSeed: number;
//   poolOwnerAuthority: PublicKey;
//   adminAuthority: PublicKey;
// }

const DataLayout = BufferLayout.struct([
  BufferLayout.u8("instruction"),
  Layout.uint64("supply"),
  BufferLayout.u8("sub_supply_opt"),
  Layout.uint64("sub_supply"),
  Layout.uint64("duration"),
  Layout.uint64("earliestRewardTime"),
  BufferLayout.u8("bumpSeed"),
  Layout.publicKey("poolOwnerAuthority"),
  Layout.publicKey("adminAuthority"),
]);

// Accounts expected by this instruction:
//   0. `[signer]` Transfer reward token authority.
//   1. `[writable]` Reward token supply.
//   2. `[writable]` Reward token pool - uninitialized.
//   3. `[writable]` Staking pool - uninitialized.
//   4. `[]` Reward token mint.
//   5. `[]` Staking program derived that owns reward token pool.
//   6. `[]` Rent sysvar .
//   7. `[]` Token program.
export const initStakingPoolInstruction = (
  supply: number | BN,
  duration: number | BN,
  earliestRewardTime: number | BN,
  bumpSeed: number,
  transferRewardSupply: PublicKey,
  rewardTokenSupply: PublicKey,
  rewardTokenPool: PublicKey,
  stakingPool: PublicKey,
  rewardTokenMint: PublicKey,
  derivedStakingProgram: PublicKey,
  poolOwnerAuthority: PublicKey,
  adminAuthority: PublicKey,
  stakingProgramId: PublicKey = PORT_STAKING,
  subReward?: {
    supply: number | BN;
    tokenSupply: PublicKey;
    tokenPool: PublicKey;
    rewardTokenMint: PublicKey;
  }
): TransactionInstruction => {
  const data = Buffer.alloc(DataLayout.span);
  let params = {
    instruction: StakingInstructions.InitStakingPool,
    supply: new BN(supply),
    sub_supply_opt: 0,
    sub_supply: new BN(0),
    duration: new BN(duration),
    earliestRewardTime: new BN(earliestRewardTime),
    bumpSeed,
    poolOwnerAuthority,
    adminAuthority,
  };
  if (subReward) {
    params.sub_supply_opt = 1;
    params.sub_supply = new BN(subReward.supply);
  }
  DataLayout.encode(params, data);

  const dummyKey = Keypair.generate().publicKey;
  const subRewardTokenSupply = subReward ? subReward.tokenSupply : dummyKey;
  const subRewardTokenPool = subReward ? subReward.tokenPool : dummyKey;
  const subRewardTokenMint = subReward ? subReward.rewardTokenMint : dummyKey;

  const keys = [
    // signer
    getAccess(transferRewardSupply, AccessType.SIGNER),
    // write accounts
    getAccess(rewardTokenSupply, AccessType.WRITE),
    getAccess(rewardTokenPool, AccessType.WRITE),
    getAccess(subRewardTokenSupply, AccessType.WRITE),
    getAccess(subRewardTokenPool, AccessType.WRITE),
    getAccess(stakingPool, AccessType.WRITE),
    // read accounts
    getAccess(rewardTokenMint, AccessType.READ),
    getAccess(subRewardTokenMint, AccessType.READ),
    getAccess(derivedStakingProgram, AccessType.READ),
    getAccess(SYSVAR_RENT_PUBKEY, AccessType.READ),
    getAccess(TOKEN_PROGRAM_ID, AccessType.READ),
  ];

  return new TransactionInstruction({
    keys,
    programId: stakingProgramId,
    data,
  });
};
