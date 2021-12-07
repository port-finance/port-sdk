import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from "@solana/web3.js";
import * as BufferLayout from "buffer-layout";
import * as Layout from "../utils/layout";
import { PORT_STAKING } from "../constants";
import BN from "bn.js";
import { LendingInstruction } from './instruction';

interface Data {
  instruction: number;
  supply: number;
  duration: number;
  earliestRewardTime: number;
  bumpSeed: number;
  poolOwnerAuthority: PublicKey;
  adminAuthority: PublicKey;
}

const DataLayout = BufferLayout.struct<Data>([
  BufferLayout.u8("instruction"),
  Layout.uint64("supply"),
  Layout.uint64("duration"),
  Layout.uint64("earliestRewardTime"),
  BufferLayout.u8("bumpSeed"),
  Layout.publicKey("poolOwnerAuthority"),
  Layout.publicKey("adminAuthority"),
]);

export const initStakingPool = (
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
  adminAuthority: PublicKey
): TransactionInstruction => {
  const data = Buffer.alloc(DataLayout.span);
  DataLayout.encode(
    {
      instruction: LendingInstruction.InitLendingMarket,
      supply: new BN(supply),
      duration: new BN(duration),
      earliestRewardTime: new BN(earliestRewardTime),
      bumpSeed,
      poolOwnerAuthority,
      adminAuthority,
    },
    data
  );

  const keys = [
    // signer
    { pubkey: transferRewardSupply, isSigner: true, isWritable: false },
    // write accounts
    { pubkey: rewardTokenSupply, isSigner: false, isWritable: true },
    { pubkey: rewardTokenPool, isSigner: false, isWritable: true },
    { pubkey: stakingPool, isSigner: false, isWritable: true },
    // read accounts
    { pubkey: rewardTokenMint, isSigner: false, isWritable: false },
    { pubkey: derivedStakingProgram, isSigner: false, isWritable: false },
    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
  ];

  return new TransactionInstruction({
    keys,
    programId: PORT_STAKING,
    data,
  });
};
