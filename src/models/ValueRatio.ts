import {Ratio} from './Ratio';
import {BigSource} from 'big.js';

export class ValueRatio extends Ratio {
  private static VALUE_RATIO_NA = new ValueRatio();

  private constructor(pct?: BigSource) {
    super(pct);
  }

  public static of(pct?: BigSource): ValueRatio {
    if (!pct) {
      return ValueRatio.na();
    }
    return new ValueRatio(pct);
  }

  public static na(): ValueRatio {
    return ValueRatio.VALUE_RATIO_NA;
  }
}
