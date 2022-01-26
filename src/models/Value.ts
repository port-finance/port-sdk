import { BigSource } from "big.js";
import { Decimal, Lamport } from "./basic";
import { AssetPrice } from "./AssetPrice";
import { Asset } from "./Asset";
import { QuantityContext } from "./QuantityContext";

export abstract class Value<V extends Value<V>> extends Decimal<V> {
  // eslint-disable-next-line new-cap
  private static FORMATTER = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  protected constructor(raw: BigSource) {
    super(raw);
  }

  public toAsset(price: AssetPrice, context: QuantityContext): Asset {
    const lamport = Lamport.of(
      this.raw.div(price.getRaw()).mul(context.multiplier)
    );
    return Asset.of(price.getMintId(), lamport);
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
}
