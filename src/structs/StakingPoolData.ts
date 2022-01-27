import * as BufferLayout from "@solana/buffer-layout";
import { AuthorityId } from "../models/AuthorityId";
import { Lamport } from "../models/basic";
import { ExchangeRate } from "../models/ExchangeRate";
import { Slot } from "../models/Slot";
import { TokenAccountId } from "../models/TokenAccountId";
import { BigType } from "../serialization/BigType";

export const StakingPoolLayout = BufferLayout.struct([
  BufferLayout.u8("version"),
  AuthorityId.field("ownerAuthority"),
  AuthorityId.field("adminAuthority"),
  TokenAccountId.field("rewardTokenPool"),
  Slot.field("lastUpdate"),
  Slot.field("endTime"),
  Slot.field("duration"),
  Slot.field("earliestRewardClaimTime"),
  ExchangeRate.field(BigType.D128, "ratePerSlot"),
  ExchangeRate.field(BigType.D128, "cumulativeRate"),
  Lamport.field(BigType.U64, "poolSize"),
  BufferLayout.u8("bumpSeedStakingProgram"),
  BufferLayout.u8("subRewardTokenPoolOption"),
  TokenAccountId.field("subRewardTokenPool"),
  BufferLayout.u8("subRatePerSlotOption"),
  ExchangeRate.field(BigType.D128, "subRatePerSlot"),
  BufferLayout.u8("subCumulativeRateOption"),
  ExchangeRate.field(BigType.D128, "subCumulativeRate"),
  BufferLayout.blob(32, "reserveField3"),
  BufferLayout.blob(29, "reserveField4"),
]);

export interface StakingPoolProto {
  version: number;
  ownerAuthority: AuthorityId;
  adminAuthority: AuthorityId;
  rewardTokenPool: TokenAccountId;
  lastUpdate: Slot;
  endTime: Slot;
  earliestRewardClaimTime: Slot;
  duration: Slot;
  ratePerSlot: ExchangeRate;
  cumulativeRate: ExchangeRate;
  poolSize: Lamport;
  bumpSeedStakingProgram: number;
  subRewardTokenPoolOption: number;
  subRewardTokenPool: TokenAccountId;
  subRatePerSlotOption: number;
  subRatePerSlot: ExchangeRate;
  subCumulativeRateOption: number;
  subCumulativeRate: ExchangeRate;
}

export const STAKING_POOL_DATA_SIZE = StakingPoolLayout.span;
