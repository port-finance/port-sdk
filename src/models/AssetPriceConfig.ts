import Big from "big.js";

export class AssetPriceConfig {
  private readonly decimals: number;
  private readonly increment: Big;

  private constructor(decimals: number, increment: Big) {
    this.decimals = decimals;
    this.increment = increment;
  }

  public static fromDecimals(decimals: number): AssetPriceConfig {
    console.assert(Number.isInteger(decimals));
    console.assert(decimals >= 0);
    return new AssetPriceConfig(decimals, new Big(10).pow(decimals));
  }

  public getDecimals(): number {
    return this.decimals;
  }

  public getIncrement(): Big {
    return this.increment;
  }
}
