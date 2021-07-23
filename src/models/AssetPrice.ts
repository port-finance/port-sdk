import {AssetId} from "./AssetId";
import {BigSource} from "big.js";
import {Decimal} from "./Decimal";
import {AssetConfig} from "./AssetConfig";

export class AssetPrice extends Decimal<AssetPrice> {

  readonly assetId: AssetId;

  private constructor(assetId: AssetId, value: BigSource) {
    super(value);
    this.assetId = assetId;
  }

  public static of(assetId: AssetId, value: BigSource): AssetPrice {
    return new AssetPrice(assetId, value);
  }

  public print(config: AssetConfig): string {
    const decimals = config.price.getDecimals();
    return '$' + this.raw.round(decimals, 1).toFixed(decimals); // RoundHalfUp
  }

  protected isCompatibleWith(that: AssetPrice): boolean {
    return this.assetId.equals(that.assetId);
  }

  protected withValue(value: BigSource): AssetPrice {
    return new AssetPrice(this.assetId, value);
  }
}
