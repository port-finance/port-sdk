import { AssetPrice } from "./AssetPrice";
import { MintId } from "./MintId";

export class PriceOracle {
  private readonly cache: Map<string, AssetPrice>;

  constructor(cache: Map<string, AssetPrice>) {
    this.cache = cache;
  }

  public static index(prices: AssetPrice[]): PriceOracle {
    const cache = new Map<string, AssetPrice>();
    prices.forEach((price) => cache.set(price.getMintId().toString(), price));
    return new PriceOracle(cache);
  }

  public getPrice(mintId: MintId): AssetPrice | undefined {
    const key = mintId.toString();
    return this.cache.get(key);
  }
}
