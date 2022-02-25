import { Ratio, Percentage } from "./basic";

export class ValueRatio extends Ratio<ValueRatio> {
  private static VALUE_RATIO_NA = new ValueRatio();

  private constructor(pct?: Percentage) {
    super(pct);
  }

  public static of(pct?: Percentage): ValueRatio {
    if (!pct) {
      return ValueRatio.na();
    }
    return new ValueRatio(pct);
  }

  public static na(): ValueRatio {
    return ValueRatio.VALUE_RATIO_NA;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected isCompatibleWith(that: ValueRatio): boolean {
    return true;
  }
}
