import { Share } from "./Share";
import { ReserveId } from "./ReserveId";
import { ShareId } from "./ShareId";
import Big from "big.js";
import { QuoteValue } from "./QuoteValue";
import { PortBalanceCollateralData } from "../structs/PortBalanceData";

export class Collateral {
  private readonly reserveId: ReserveId;
  private readonly share: Share;
  private readonly recordedValue: QuoteValue;

  private constructor(
    reserveId: ReserveId,
    share: Share,
    recordedValue: QuoteValue
  ) {
    this.reserveId = reserveId;
    this.share = share;
    this.recordedValue = recordedValue;
  }

  public static fromRaw(
    raw: PortBalanceCollateralData,
    shareId: ShareId
  ): Collateral {
    const lamport = new Share(shareId, new Big(raw.depositedAmount.toString()));
    const recordedValue = QuoteValue.fromWads(raw.marketValue);
    return new Collateral(
      new ReserveId(raw.depositReserve),
      lamport,
      recordedValue
    );
  }

  public getReserveId(): ReserveId {
    return this.reserveId;
  }

  public getShareId(): ShareId {
    return this.getShare().getShareId();
  }

  public isPositive(): boolean {
    return this.getShare().isPositive();
  }

  public getShare(): Share {
    return this.share;
  }

  public getRecordedValue(): QuoteValue {
    return this.recordedValue;
  }
}
