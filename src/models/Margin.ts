import { BigSource } from "big.js";
import { Collateral } from "./Collateral";
import { ReserveInfo } from "./ReserveInfo";
import { Loan } from "./Loan";
import { Value } from "./Value";
import BN from "bn.js";
import { Wads } from "./Wads";
import { MarginRatio } from "./MarginRatio";

export class Margin extends Value<Margin> {
  private static MARGIN_ZERO = new Margin(0);

  private constructor(value: BigSource) {
    super(value);
  }

  public static fromCollateral(
    collateral: Collateral,
    reserve: ReserveInfo
  ): Margin {
    const ltv = reserve.params.loanToValueRatio;
    if (!ltv.isPresent()) {
      return Margin.zero();
    }

    const value = collateral.getRecordedValue();
    return new Margin(value.getRaw().mul(ltv.getUnchecked()));
  }

  public static fromLoan(loan: Loan) {
    const value = loan.getRecordedValue();
    return new Margin(value.getRaw());
  }

  public static fromWads(wads: BN) {
    return new Margin(new Wads(wads).toBig());
  }

  public static zero(): Margin {
    return Margin.MARGIN_ZERO;
  }

  public toRatioAgainst(threshold: Margin): MarginRatio {
    if (threshold.isZero()) {
      return MarginRatio.na();
    }
    return MarginRatio.of(this.getRaw().div(threshold.raw));
  }

  protected withValue(value: BigSource): Margin {
    return new Margin(value);
  }
}
