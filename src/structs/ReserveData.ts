/* eslint-disable new-cap */
import { AccountInfo, PublicKey } from "@solana/web3.js";
import Big from "big.js";

import * as BufferLayout from "@solana/buffer-layout";
import { Lamport, Percentage } from "../models/basic";
import { ExchangeRate } from "../models/ExchangeRate";
import { MintId } from "../models/MintId";
import { StakingPoolId } from "../models/staking";
import { TokenAccountId } from "../models/TokenAccountId";
import { BigField } from "../serialization/BigField";
import { BigType } from "../serialization/BigType";
import { Optional } from "../serialization/Optional";
import * as Layout from "../serialization/layout";
import { SlotInfo, SlotInfoLayout } from "./SlotInfo";
import BN from "bn.js";

export interface ReserveData {
  version: number;
  lastUpdate: SlotInfo;
  lendingMarket: PublicKey;
  liquidity: ReserveLiquidity;
  collateral: ReserveCollateral;
  config: ReserveConfig;
}

export interface ReserveLiquidity {
  mintPubkey: MintId;
  mintDecimals: number;
  supplyPubkey: TokenAccountId;
  feeReceiver: TokenAccountId;
  oracleOption: number;
  oraclePubkey: PublicKey;
  availableAmount: Lamport;
  borrowedAmountWads: Lamport;
  cumulativeBorrowRateWads: ExchangeRate;
  marketPrice: Big;
}

export interface ReserveCollateral {
  mintPubkey: MintId;
  mintTotalSupply: Lamport;
  supplyPubkey: TokenAccountId;
}

// only use in create-reserve instruction.
export interface ReserveConfigProto {
  optimalUtilizationRate: number;
  loanToValueRatio: number;
  liquidationBonus: number;
  liquidationThreshold: number;
  minBorrowRate: number;
  optimalBorrowRate: number;
  maxBorrowRate: number;
  fees: {
    borrowFeeWad: BN;
    flashLoanFeeWad: BN;
    hostFeePercentage: number;
  };
  stakingPoolOption: number;
  stakingPool: PublicKey;
}

// only use in create-reserve instruction.
export const ReserveConfigProtoLayout = (
  property: string
): BufferLayout.Structure =>
  BufferLayout.struct(
    [
      BufferLayout.u8("optimalUtilizationRate"),
      BufferLayout.u8("loanToValueRatio"),
      BufferLayout.u8("liquidationBonus"),
      BufferLayout.u8("liquidationThreshold"),
      BufferLayout.u8("minBorrowRate"),
      BufferLayout.u8("optimalBorrowRate"),
      BufferLayout.u8("maxBorrowRate"),
      ReserveFeesProtoLayout("fees"),
      BufferLayout.u8("stakingPoolOption"),
      Layout.publicKey("stakingPool"),
    ],
    property
  );

// only use in create-reserve instruction.
const ReserveFeesProtoLayout = (property: string): BufferLayout.Structure =>
  BufferLayout.struct(
    [
      Layout.uint64("borrowFeeWad"),
      Layout.uint64("flashLoanFeeWad"),
      BufferLayout.u8("hostFeePercentage"),
    ],
    property
  );

export interface ReserveConfig {
  optimalUtilizationRate: Percentage;
  loanToValueRatio: Percentage;
  liquidationBonus: Percentage;
  liquidationThreshold: Percentage;
  minBorrowRate: Percentage;
  optimalBorrowRate: Percentage;
  maxBorrowRate: Percentage;
  fees: {
    borrowFeeWad: Big;
    flashLoanFeeWad: Big;
    hostFeePercentage: number;
  };
  stakingPoolId: StakingPoolId | undefined;
}

export const ReserveLiquidityLayout = (
  property: string
): BufferLayout.Structure =>
  BufferLayout.struct(
    [
      MintId.field("mintPubkey"),
      BufferLayout.u8("mintDecimals"),
      TokenAccountId.field("supplyPubkey"),
      TokenAccountId.field("feeReceiver"),
      BufferLayout.u32("oracleOption"),
      Layout.publicKey("oraclePubkey"),
      Lamport.field(BigType.U64, "availableAmount"),
      Lamport.field(BigType.D128, "borrowedAmountWads"),
      ExchangeRate.field(BigType.D128, "cumulativeBorrowRateWads"),
      BigField.forType(BigType.D128, "marketPrice"),
    ],
    property
  );

export const ReserveCollateralLayout = (
  property: string
): BufferLayout.Structure =>
  BufferLayout.struct(
    [
      MintId.field("mintPubkey"),
      Lamport.field(BigType.U64, "mintTotalSupply"),
      TokenAccountId.field("supplyPubkey"),
    ],
    property
  );

export const ReserveFeesLayout = (property: string): BufferLayout.Structure =>
  BufferLayout.struct(
    [
      BigField.forType(BigType.D64, "borrowFeeWad"),
      BigField.forType(BigType.D64, "flashLoanFeeWad"),
      BufferLayout.u8("hostFeePercentage"),
    ],
    property
  );

export const ReserveConfigLayout = (property: string): BufferLayout.Structure =>
  BufferLayout.struct(
    [
      Percentage.field("optimalUtilizationRate"),
      Percentage.field("loanToValueRatio"),
      Percentage.field("liquidationBonus"),
      Percentage.field("liquidationThreshold"),
      Percentage.field("minBorrowRate"),
      Percentage.field("optimalBorrowRate"),
      Percentage.field("maxBorrowRate"),
      ReserveFeesLayout("fees"),
      Optional.of(StakingPoolId.field("stakingPoolId")),
    ],
    property
  );

export const ReserveLayout = BufferLayout.struct([
  BufferLayout.u8("version"),
  SlotInfoLayout("lastUpdate"),
  Layout.publicKey("lendingMarket"),
  ReserveLiquidityLayout("liquidity"),
  ReserveCollateralLayout("collateral"),
  ReserveConfigLayout("config"),
  BufferLayout.blob(215, "padding2"),
]);

export const isReserve = (info: AccountInfo<Buffer>): boolean => {
  return info.data.length === ReserveLayout.span;
};

export const RESERVE_DATA_SIZE = ReserveLayout.span;
