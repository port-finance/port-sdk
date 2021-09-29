import { AssetConfig } from "./AssetConfig";
import { AssetId } from "./AssetId";

export class AssetContext {
  private readonly cache: Map<string, AssetConfig>;

  private constructor(cache: Map<string, AssetConfig>) {
    this.cache = cache;
  }

  public static index(configs: AssetConfig[]): AssetContext {
    const cache = new Map<string, AssetConfig>();
    configs.forEach((config) => cache.set(config.assetId.toString(), config));
    return new AssetContext(cache);
  }

  public getAllConfigs(): AssetConfig[] {
    return Array.from(this.cache.values());
  }

  public getConfig(assetId: AssetId): AssetConfig {
    const key = assetId.toString();
    const result = this.cache.get(key);
    if (!result) {
      throw Error("Unknown Asset: " + assetId);
    }

    return result;
  }
}
