import Big, { BigSource } from "big.js";
import { Decimal, DecimalField } from "./Decimal";
import { Field } from "../../serialization/Field";
import { BigType } from "../../serialization/BigType";

export class Percentage extends Decimal<Percentage> {
  private static PCT_BIP = new Percentage(0.0001);
  private static PCT_ZERO = new Percentage(0);
  private static PCT_HUNDRED = new Percentage(1);
  private static PCT_THOUSAND = new Percentage(10);

  private constructor(value: BigSource) {
    super(value);
  }

  public static zero(): Percentage {
    return Percentage.PCT_ZERO;
  }

  public static hundred(): Percentage {
    return Percentage.PCT_HUNDRED;
  }

  public static fromOneBased(oneBased: BigSource): Percentage {
    return Percentage.fromRaw(oneBased, false);
  }

  public static fromHundredBased(hundredBased: BigSource): Percentage {
    return Percentage.fromRaw(hundredBased, true);
  }

  public static fromRaw(raw: BigSource, isHundredBased: boolean): Percentage {
    const big = new Big(raw);
    if (!isHundredBased) {
      return new Percentage(big);
    }
    return new Percentage(big.div(100));
  }

  public static field(property: string): Field<Percentage> {
    return new PercentageField(true, property);
  }

  public isTrivial(): boolean {
    return this.lt(Percentage.PCT_BIP);
  }

  public isHundredPct(): boolean {
    return this.eq(Percentage.PCT_HUNDRED);
  }

  public toOneBasedNumber(dp: number): number {
    return this.raw.round(dp).toNumber();
  }

  public toHundredBasedNumber(dp: number): number {
    return this.raw.mul(100).round(dp, 0).toNumber();
  }

  public print(): string {
    if (this.gt(Percentage.PCT_THOUSAND)) {
      return this.raw.round(1, 1).toString() + "x"; // RoundHalfUp
    }
    return this.raw.mul(100).round(2, 1).toString() + "%"; // RoundHalfUp
  }

  public replaceWithValue(value: BigSource): Percentage {
    return new Percentage(value);
  }
}

class PercentageField extends DecimalField<Percentage> {
  private readonly isHundredBased: boolean;

  public constructor(isHundredBased: boolean, property: string) {
    super(BigType.U8, property);
    this.isHundredBased = isHundredBased;
  }

  protected fromBig(big: Big): Percentage {
    return Percentage.fromRaw(big, this.isHundredBased);
  }
}
