import {Ratio} from "./Ratio";
import {BigSource} from "big.js";

export class MarginRatio extends Ratio {

  private static MARGIN_RATIO_NA = new MarginRatio();

  private constructor(pct?: BigSource) {
    super(pct);
  }

  public static of(pct?: BigSource): MarginRatio {
    if (!pct) {
      return MarginRatio.na();
    }
    return new MarginRatio(pct);
  }

  public static na(): MarginRatio {
    return MarginRatio.MARGIN_RATIO_NA;
  }
}
