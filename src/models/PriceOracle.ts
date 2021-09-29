import { AssetPrice } from "./AssetPrice";
import { AssetId } from "./AssetId";

export class PriceOracle {
  private readonly cache: Map<string, AssetPrice>;

  constructor(cache: Map<string, AssetPrice>) {
    this.cache = cache;
  }

  public static index(prices: AssetPrice[]): PriceOracle {
    const cache = new Map<string, AssetPrice>();
    prices.forEach((price) => cache.set(price.assetId.toString(), price));
    return new PriceOracle(cache);
  }

  public getPrice(assetId: AssetId): AssetPrice | undefined {
    const key = assetId.toString();
    return this.cache.get(key);
  }
}
