import Big from "big.js";

export class AssetQuantityContext {

  readonly decimals: number;
  readonly multiplier: Big;

  private constructor(decimals: number, increment: Big) {
    this.decimals = decimals;
    this.multiplier = increment;
  }

  public static fromDecimals(decimals: number): AssetQuantityContext {
    console.assert(Number.isInteger(decimals));
    console.assert(decimals >= 0);
    return new AssetQuantityContext(decimals, new Big(10).pow(decimals));
  }
}
