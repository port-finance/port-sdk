import Big, { BigSource } from "big.js";
import { Value } from "./Value";
import { ValueRatio } from "./ValueRatio";
import { Percentage, DecimalField } from "./basic";
import { BigType } from "../serialization/BigType";
import { Field } from "../serialization/Field";
import { Margin } from "./Margin";

export class QuoteValue extends Value<QuoteValue> {
  private static readonly QUOTE_VALUE_ZERO = new QuoteValue(0);

  private constructor(raw: BigSource) {
    super(raw);
  }

  public static of(raw: BigSource): QuoteValue {
    const result = new QuoteValue(raw);
    if (result.isZero()) {
      return QuoteValue.zero();
    }

    return result;
  }

  public static zero(): QuoteValue {
    return QuoteValue.QUOTE_VALUE_ZERO;
  }

  public static field(property: string): Field<QuoteValue> {
    return new QuoteValueField(property);
  }

  public toCollateralMargin(loanToValue: Percentage): Margin {
    return Margin.of(this.getRaw().mul(loanToValue.getRaw()));
  }

  public toLoanMargin(): Margin {
    return Margin.of(this.getRaw());
  }

  public toRatioAgainst(threshold: QuoteValue): ValueRatio {
    if (threshold.isZero()) {
      return ValueRatio.na();
    }
    const pct = Percentage.fromOneBased(this.getRaw().div(threshold.raw));
    return ValueRatio.of(pct);
  }

  public replaceWithValue(value: BigSource): QuoteValue {
    return new QuoteValue(value);
  }
}

class QuoteValueField extends DecimalField<QuoteValue> {
  public constructor(property: string) {
    super(BigType.D128, property);
  }

  protected fromBig(big: Big): QuoteValue {
    return QuoteValue.of(big);
  }
}
