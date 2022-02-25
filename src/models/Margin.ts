import Big, { BigSource } from "big.js";

import { Value } from "./Value";
import { MarginRatio } from "./MarginRatio";
import { Percentage, DecimalField } from "./basic";
import { BigType } from "../serialization/BigType";
import { Field } from "../serialization/Field";
import { QuoteValue } from "./QuoteValue";

export class Margin extends Value<Margin> {
  private static MARGIN_ZERO = new Margin(0);

  private constructor(value: BigSource) {
    super(value);
  }

  public static of(raw: Big): Margin {
    return new Margin(raw);
  }

  public static zero(): Margin {
    return Margin.MARGIN_ZERO;
  }

  public static field(property: string): Field<Margin> {
    return new MarginField(property);
  }

  public toCollateralValue(loanToValue: Percentage): QuoteValue {
    return QuoteValue.of(this.getRaw().div(loanToValue.getRaw()));
  }

  public toRatioAgainst(threshold: Margin): MarginRatio {
    if (threshold.isZero()) {
      return MarginRatio.na();
    }

    return MarginRatio.of(
      Percentage.fromOneBased(this.getRaw().div(threshold.raw))
    );
  }

  public replaceWithValue(value: BigSource): Margin {
    return new Margin(value);
  }
}

class MarginField extends DecimalField<Margin> {
  public constructor(property: string) {
    super(BigType.D128, property);
  }

  protected fromBig(big: Big): Margin {
    return Margin.of(big);
  }
}
