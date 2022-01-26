import { Margin } from "../models/Margin";
import { QuoteValue } from "../models/QuoteValue";
import { WalletId } from "../models/WalletId";
import { SlotInfo, SlotInfoLayout } from "./SlotInfo";
import * as BufferLayout from "@solana/buffer-layout";
import * as Layout from "../serialization/layout";
import { ReserveId } from "../models/ReserveId";
import { Lamport } from "../models/basic";
import { BigType } from "../serialization/BigType";
import { ExchangeRate } from "../models/ExchangeRate";
import { PublicKey } from "@solana/web3.js";

export const ObligationLayout = BufferLayout.struct([
  BufferLayout.u8("version"),
  // eslint-disable-next-line new-cap
  SlotInfoLayout("lastUpdate"),
  Layout.publicKey("lendingMarket"),
  WalletId.field("owner"),
  QuoteValue.field("depositedValue"),
  Margin.field("borrowedValue"),
  Margin.field("allowedBorrowValue"),
  Margin.field("unhealthyBorrowValue"),

  BufferLayout.u8("depositsLen"),
  BufferLayout.u8("borrowsLen"),
  BufferLayout.blob(776, "dataFlat"),
]);

export const ObligationCollateralLayout = BufferLayout.struct([
  ReserveId.field("depositReserve"),
  Lamport.field(BigType.U64, "depositedAmount"),
  QuoteValue.field("marketValue"),
]);

export const ObligationLiquidityLayout = BufferLayout.struct([
  ReserveId.field("borrowReserve"),
  ExchangeRate.field(BigType.D128, "cumulativeBorrowRateWads"),
  Lamport.field(BigType.D128, "borrowedAmountWads"),
  QuoteValue.field("marketValue"),
]);

export interface ProtoObligation {
  version: number;
  lastUpdate: SlotInfo;
  lendingMarket: PublicKey;
  owner: WalletId;
  depositedValue: QuoteValue;
  borrowedValue: Margin;
  allowedBorrowValue: Margin;
  unhealthyBorrowValue: Margin;
  depositsLen: number;
  borrowsLen: number;
  dataFlat: Buffer;
}

export interface PortProfileData {
  version: number;
  lastUpdate: SlotInfo;
  lendingMarket: PublicKey;
  owner: PublicKey;
  deposits: PortProfileCollateralData[];
  borrows: PortProfileLoanData[];
  depositedValue: QuoteValue;
  borrowedValue: Margin;
  allowedBorrowValue: Margin;
  unhealthyBorrowValue: Margin;
}

export interface PortProfileCollateralData {
  depositReserve: ReserveId;
  depositedAmount: Lamport;
  marketValue: QuoteValue;
}

export interface PortProfileLoanData {
  borrowReserve: ReserveId;
  cumulativeBorrowRateWads: ExchangeRate;
  borrowedAmountWads: Lamport;
  marketValue: QuoteValue;
}

export const PORT_PROFILE_DATA_SIZE = ObligationLayout.span;
