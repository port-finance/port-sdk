import { QuoteValue } from "./QuoteValue";
import { MintId } from "./MintId";
import { Asset } from "./Asset";

export class AssetValue {
  private readonly asset: Asset;
  private readonly value: QuoteValue;

  constructor(asset: Asset, value: QuoteValue) {
    this.asset = asset;
    this.value = value;
  }

  public static zero(mintId: MintId): AssetValue {
    return new AssetValue(Asset.zero(mintId), QuoteValue.zero());
  }

  public getMintId(): MintId {
    return this.getAsset().getMintId();
  }

  public getAsset(): Asset {
    return this.asset;
  }

  public getValue(): QuoteValue {
    return this.value;
  }
}
