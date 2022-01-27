import * as BufferLayout from "@solana/buffer-layout";
import { Lamport } from "../models/basic";
import { ExchangeRate } from "../models/ExchangeRate";
import { StakingPoolId } from "../models/staking";
import { WalletId } from "../models/WalletId";
import { BigType } from "../serialization/BigType";

export const StakeAccountLayout = BufferLayout.struct([
  BufferLayout.u8("version"),
  ExchangeRate.field(BigType.D128, "startRate"),
  WalletId.field("owner"),
  StakingPoolId.field("poolPubkey"),
  Lamport.field(BigType.U64, "depositedAmount"),
  Lamport.field(BigType.D128, "unclaimedRewardWads"),
  BufferLayout.blob(32, "reserveField1"),
  BufferLayout.blob(32, "reserveField2"),
  BufferLayout.blob(32, "reserveField3"),
  BufferLayout.blob(32, "reserveField4"),
]);

export interface StakeAccountProto {
  version: number;
  startRate: ExchangeRate;
  owner: WalletId;
  poolPubkey: StakingPoolId;
  depositedAmount: Lamport;
  unclaimedRewardWads: Lamport;
}

export const STAKE_ACCOUNT_DATA_SIZE = StakeAccountLayout.span;
