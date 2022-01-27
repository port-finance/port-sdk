import { Ratio, Percentage } from "./basic";

export class MarginRatio extends Ratio<MarginRatio> {
  private static MARGIN_RATIO_NA = new MarginRatio();

  private constructor(pct?: Percentage) {
    super(pct);
  }

  public static of(pct?: Percentage): MarginRatio {
    if (!pct) {
      return MarginRatio.na();
    }
    return new MarginRatio(pct);
  }

  public static na(): MarginRatio {
    return MarginRatio.MARGIN_RATIO_NA;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected isCompatibleWith(that: MarginRatio): boolean {
    return true;
  }
}
