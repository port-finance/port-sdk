import { AssetId } from "./AssetId";
import { BigSource } from "big.js";
import { Ratio } from "./Ratio";

export class ReserveUtilizationRatio extends Ratio {
  private readonly assetId: AssetId;

  constructor(assetId: AssetId, pct?: BigSource) {
    super(pct);
    this.assetId = assetId;
  }

  public static na(assetId: AssetId): ReserveUtilizationRatio {
    return new ReserveUtilizationRatio(assetId);
  }

  public getAssetId(): AssetId {
    return this.assetId;
  }
}
