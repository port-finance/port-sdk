import Big from "big.js";

export class QuantityContext {
  readonly decimals: number;
  readonly multiplier: Big;

  private constructor(decimals: number, increment: Big) {
    this.decimals = decimals;
    this.multiplier = increment;
  }

  public static fromDecimals(decimals: number): QuantityContext {
    console.assert(Number.isInteger(decimals));
    console.assert(decimals >= 0);
    return new QuantityContext(decimals, new Big(10).pow(decimals));
  }
}
