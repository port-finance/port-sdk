import { AssetId } from "./AssetId";
import { BigSource } from "big.js";
import { Ratio } from "./Ratio";

export class ReserveBorrowRate extends Ratio {
  private readonly assetId: AssetId;

  constructor(assetId: AssetId, pct?: BigSource) {
    super(pct);
    this.assetId = assetId;
  }

  static na(assetId: AssetId): ReserveBorrowRate {
    return new ReserveBorrowRate(assetId);
  }

  public getAssetId(): AssetId {
    return this.assetId;
  }
}
