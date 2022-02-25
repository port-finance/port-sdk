import Big, { BigSource } from "big.js";
import { Decimal, DecimalField } from "./basic";
import { Field } from "../serialization/Field";
import { BigType } from "../serialization/BigType";

export class ExchangeRate extends Decimal<ExchangeRate> {
  private static ZERO = ExchangeRate.of(0);

  private constructor(value: BigSource) {
    super(value);
  }

  public static zero(): ExchangeRate {
    return ExchangeRate.ZERO;
  }

  public static of(raw: BigSource): ExchangeRate {
    return new ExchangeRate(raw);
  }

  public static field(type: BigType, property: string): Field<ExchangeRate> {
    return new ExchangeRateField(type, property);
  }

  public replaceWithValue(value: BigSource): ExchangeRate {
    return ExchangeRate.of(value);
  }
}

class ExchangeRateField extends DecimalField<ExchangeRate> {
  public constructor(type: BigType, property: string) {
    super(type, property);
  }

  protected fromBig(big: Big): ExchangeRate {
    return ExchangeRate.of(big);
  }
}
