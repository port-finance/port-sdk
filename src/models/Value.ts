import { BigSource } from "big.js";
import { Decimal } from "./Decimal";
import { AssetPrice } from "./AssetPrice";
import { Asset } from "./Asset";
import { AssetQuantityContext } from "./AssetQuantityContext";

export abstract class Value<V extends Value<V>> extends Decimal<V> {
  private static FORMATTER = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  protected constructor(raw: BigSource) {
    super(raw);
  }

  public toAsset(price: AssetPrice, context: AssetQuantityContext): Asset {
    const lamport = this.raw.div(price.getRaw()).mul(context.multiplier);
    return new Asset(price.assetId, lamport);
  }

  public toNumber(): number {
    return this.raw.round(2, 0).toNumber();
  }

  public print(): string {
    return Value.FORMATTER.format(this.toNumber());
  }

  public toString(): string {
    return this.print();
  }

  protected isCompatibleWith(that: V): boolean {
    return true;
  }
}
