import BufferLayout from "buffer-layout";
import {ParsedAccount} from "./ParsedAccount";
import {
  ObligationCollateralLayout,
  ObligationLayout,
  ObligationLiquidityLayout,
  PortBalanceCollateralData,
  PortBalanceData,
  PortBalanceLoanData,
  ProtoObligation
} from "../structs/PortBalanceData";
import {RawAccount} from "./RawAccount";


export function PortBalanceParser(
  raw: RawAccount,
): ParsedAccount<PortBalanceData> | undefined {
  const pubkey = raw.pubkey;
  const buffer = Buffer.from(raw.account.data);
  const {
    version,
    lastUpdate,
    lendingMarket,
    owner,
    depositedValue,
    borrowedValue,
    allowedBorrowValue,
    unhealthyBorrowValue,
    depositsLen,
    borrowsLen,
    dataFlat,
  } = ObligationLayout.decode(buffer) as ProtoObligation;

  if (lastUpdate.slot.isZero()) {
    return;
  }

  const depositsBuffer = dataFlat.slice(
    0,
    depositsLen * ObligationCollateralLayout.span,
  );
  const deposits = BufferLayout.seq(
    ObligationCollateralLayout,
    depositsLen,
  ).decode(depositsBuffer) as PortBalanceCollateralData[];

  const borrowsBuffer = dataFlat.slice(
    depositsBuffer.length,
    depositsBuffer.length + borrowsLen * ObligationLiquidityLayout.span,
  );
  const borrows = BufferLayout.seq(
    ObligationLiquidityLayout,
    borrowsLen,
  ).decode(borrowsBuffer) as PortBalanceLoanData[];

  const data = {
    version,
    lastUpdate,
    lendingMarket,
    owner,
    depositedValue,
    borrowedValue,
    allowedBorrowValue,
    unhealthyBorrowValue,
    deposits,
    borrows,
  } as PortBalanceData;

  return {
    pubkey,
    data,
  };
}