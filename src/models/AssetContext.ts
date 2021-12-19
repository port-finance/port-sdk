import {ReserveId} from '.';
import {AssetConfig} from './AssetConfig';
import {AssetId} from './AssetId';

export class AssetContext {
  private readonly cache: Map<string, AssetConfig>;
  private readonly bySymbol: Map<string, AssetConfig>;
  private readonly byReserveId: Map<string, AssetConfig>;

  private constructor(
      cache: Map<string, AssetConfig>,
      bySymbol: Map<string, AssetConfig>,
      byReserveId: Map<string, AssetConfig>,
  ) {
    this.cache = cache;
    this.bySymbol = bySymbol;
    this.byReserveId = byReserveId;
  }

  public static index(configs: AssetConfig[]): AssetContext {
    const cache = new Map<string, AssetConfig>();
    configs.forEach((config) => cache.set(config.getAssetId().toString(), config));
    const bySymbol = new Map<string, AssetConfig>();
    configs.forEach((config) => bySymbol.set(config.getDisplayConfig().getSymbol(), config));
    const byReserveId = new Map<string, AssetConfig>();
    for (const config of configs) {
      const reserveId = config.getReserveId();
      if (reserveId) {
        byReserveId.set(reserveId.toString(), config);
      }
    }
    return new AssetContext(cache, bySymbol, byReserveId);
  }

  public getAllConfigs(): AssetConfig[] {
    return Array.from(this.cache.values());
  }

  public findConfig(assetId: AssetId): AssetConfig | undefined {
    const key = assetId.toString();
    return this.cache.get(key);
  }

  public findConfigBySymbol(symbol: string): AssetConfig | undefined {
    return this.bySymbol.get(symbol);
  }

  public findConfigByReserveId(reserveId: ReserveId): AssetConfig | undefined {
    return this.byReserveId.get(reserveId.toString());
  }
}
