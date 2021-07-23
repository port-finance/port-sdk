import {AssetId} from "./AssetId";
import {BigSource} from "big.js";
import {Ratio} from "./Ratio";

export class BorrowApy extends Ratio {

  private readonly assetId: AssetId;

  constructor(assetId: AssetId, pct?: BigSource) {
    super(pct);
    this.assetId = assetId;
  }

  static na(assetId: AssetId): BorrowApy {
    return new BorrowApy(assetId);
  }

  public getAssetId(): AssetId {
    return this.assetId;
  }
}
