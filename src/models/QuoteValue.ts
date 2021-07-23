import Big, {BigSource} from "big.js";
import BN from "bn.js";
import {Wads} from "./Wads";
import {Value} from "./Value";
import {ValueRatio} from "./ValueRatio";

export class QuoteValue extends Value<QuoteValue> {

  private static VALUE_ZERO = new QuoteValue(0);

  private constructor(raw: BigSource) {
    super(raw);
  }

  public static fromWads(wads: BN): QuoteValue {
    return QuoteValue.of(new Wads(wads).toBig());
  }

  public static of(raw: BigSource): QuoteValue {
    const big = new Big(raw);
    if (big.eq(this.BIG_ZERO)) {
      return this.zero();
    }

    return new QuoteValue(big);
  }

  public static zero(): QuoteValue {
    return QuoteValue.VALUE_ZERO;
  }

  public toRatioAgainst(threshold: QuoteValue): ValueRatio {
    if (threshold.isZero()) {
      return ValueRatio.na();
    }
    return ValueRatio.of(this.getRaw().div(threshold.raw));
  }

  protected withValue(value: BigSource): QuoteValue {
    return new QuoteValue(value);
  }
}
