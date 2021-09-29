import { ReserveId } from "./ReserveId";
import { Asset } from "./Asset";
import { AssetId } from "./AssetId";
import { Wads } from "./Wads";
import { QuoteValue } from "./QuoteValue";
import { PortBalanceLoanData } from "../structs/PortBalanceData";

export class Loan {
  private readonly reserveId: ReserveId;
  private readonly asset: Asset;
  private readonly recordedValue: QuoteValue;

  private constructor(
    reserveId: ReserveId,
    lamport: Asset,
    recordedValue: QuoteValue
  ) {
    this.reserveId = reserveId;
    this.asset = lamport;
    this.recordedValue = recordedValue;
  }

  public static fromRaw(raw: PortBalanceLoanData, assetId: AssetId): Loan {
    const lamport = new Asset(
      assetId,
      new Wads(raw.borrowedAmountWads).toBig()
    );
    const recordedValue = QuoteValue.fromWads(raw.marketValue);
    return new Loan(new ReserveId(raw.borrowReserve), lamport, recordedValue);
  }

  public getReserveId(): ReserveId {
    return this.reserveId;
  }

  public getAssetId(): AssetId {
    return this.getAsset().getAssetId();
  }

  public isPositive(): boolean {
    return this.getAsset().isPositive();
  }

  public getAsset(): Asset {
    return this.asset;
  }

  public getRecordedValue(): QuoteValue {
    return this.recordedValue;
  }
}
