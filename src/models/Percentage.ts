import Big, { BigSource } from "big.js";
import { Decimal } from "./Decimal";

export class Percentage extends Decimal<Percentage> {
  private static PCT_ZERO = new Percentage(0);
  private static PCT_HUNDRED = new Percentage(1);

  constructor(value: BigSource) {
    super(value);
  }

  public static zero(): Percentage {
    return Percentage.PCT_ZERO;
  }

  public static hundred(): Percentage {
    return Percentage.PCT_HUNDRED;
  }

  public static fromHundredBased(hundredBased: number) {
    return new Percentage(new Big(hundredBased / 100));
  }

  public isHundredPct() {
    return this.raw.eq(1);
  }

  public toOneBasedNumber(dp: number): number {
    return this.raw.round(dp).toNumber();
  }

  public toHundredBasedNumber(dp: number): number {
    return this.raw.mul(100).round(dp, 0).toNumber();
  }

  public print(): string {
    return this.raw.mul(100).round(2, 1).toString() + "%"; // RoundHalfUp
  }

  protected isCompatibleWith(that: Percentage): boolean {
    return true;
  }

  protected withValue(value: BigSource): Percentage {
    return new Percentage(value);
  }
}
