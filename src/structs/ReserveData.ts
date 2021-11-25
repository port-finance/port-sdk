import { AccountInfo, PublicKey } from "@solana/web3.js";

import BN from "bn.js";
import * as BufferLayout from "buffer-layout";
import * as Layout from "../utils/layout";
import { LastUpdate, LastUpdateLayout } from "./LastUpdate";

export const RESERVE_DATA_SIZE = 575;

export interface ReserveData {
  version: number;
  lastUpdate: LastUpdate;
  lendingMarket: PublicKey;
  liquidity: ReserveLiquidity;
  collateral: ReserveCollateral;
  config: ReserveConfig;
  // u8
  deposit_staking_pool_option: number;
  deposit_staking_pool: PublicKey;
}

export interface ReserveLiquidity {
  mintPubkey: PublicKey;
  mintDecimals: number;
  supplyPubkey: PublicKey;
  feeReceiver: PublicKey;
  oracleOption: number;
  oraclePubkey: PublicKey;
  availableAmount: BN;
  borrowedAmountWads: BN;
  cumulativeBorrowRateWads: BN;
  marketPrice: BN;
}

export interface ReserveCollateral {
  mintPubkey: PublicKey;
  mintTotalSupply: BN;
  supplyPubkey: PublicKey;
}

export interface ReserveConfig {
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
}


export const ReserveLiquidityLayout: typeof BufferLayout.Structure = BufferLayout.struct(
  [
    Layout.publicKey("mintPubkey"),
    BufferLayout.u8("mintDecimals"),
    Layout.publicKey("supplyPubkey"),
    Layout.publicKey("feeReceiver"),
    // TODO: replace u32 option with generic equivalent
    BufferLayout.u32("oracleOption"),
    Layout.publicKey("oraclePubkey"),
    Layout.uint64("availableAmount"),
    Layout.uint128("borrowedAmountWads"),
    Layout.uint128("cumulativeBorrowRateWads"),
    Layout.uint128("marketPrice"),
  ],
  "liquidity"
);

export const ReserveCollateralLayout: typeof BufferLayout.Structure = BufferLayout.struct(
  [
    Layout.publicKey("mintPubkey"),
    Layout.uint64("mintTotalSupply"),
    Layout.publicKey("supplyPubkey"),
  ],
  "collateral"
);

export const ReserveConfigLayout: typeof BufferLayout.Structure = BufferLayout.struct(
  [
    BufferLayout.u8("optimalUtilizationRate"),
    BufferLayout.u8("loanToValueRatio"),
    BufferLayout.u8("liquidationBonus"),
    BufferLayout.u8("liquidationThreshold"),
    BufferLayout.u8("minBorrowRate"),
    BufferLayout.u8("optimalBorrowRate"),
    BufferLayout.u8("maxBorrowRate"),
    BufferLayout.struct(
      [
        Layout.uint64("borrowFeeWad"), 
        Layout.uint64("flashLoanFeeWad"), 
        BufferLayout.u8("hostFeePercentage")
      ],
      "fees"
    ),
  ],
  "config"
);


export const ReserveLayout: typeof BufferLayout.Structure = BufferLayout.struct(
  [
    BufferLayout.u8("version"),

    LastUpdateLayout,

    Layout.publicKey("lendingMarket"),

    ReserveLiquidityLayout,

    ReserveCollateralLayout,

    ReserveConfigLayout,

    BufferLayout.blob(8, "padding1"),
    BufferLayout.u8("deposit_staking_pool_option"),
    Layout.publicKey("deposit_staking_pool"),
    BufferLayout.blob(215, "padding2"),
  ]
);

export const isReserve = (info: AccountInfo<Buffer>) => {
  return info.data.length === ReserveLayout.span;
};
