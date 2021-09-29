import { QuoteValue } from "./QuoteValue";
import { AssetId } from "./AssetId";

export class AssetValue {
  private readonly assetId: AssetId;
  private readonly value: QuoteValue;

  constructor(assetId: AssetId, value: QuoteValue) {
    this.assetId = assetId;
    this.value = value;
  }

  public static zero(assetId: AssetId) {
    return new AssetValue(assetId, QuoteValue.zero());
  }

  public getAssetId(): AssetId {
    return this.assetId;
  }

  public getValue(): QuoteValue {
    return this.value;
  }
}
