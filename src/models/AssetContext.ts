import {AssetConfig} from './AssetConfig';
import {MintId} from './MintId';
import {ReserveId} from './ReserveId';

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
    configs.forEach((config) => cache.set(config.getMintId().toString(), config));
    const bySymbol = new Map<string, AssetConfig>();
    configs.forEach((config) => bySymbol.set(config.getSymbol(), config));
    const byReserveId = new Map<string, AssetConfig>();
    for (const config of configs) {
      const reserveId = config.getReserveId();
      if (reserveId) {
        byReserveId.set(reserveId.toBase58(), config);
      }
    }
    return new AssetContext(cache, bySymbol, byReserveId);
  }

  public getAllConfigs(): AssetConfig[] {
    return Array.from(this.cache.values());
  }

  public findConfig(mintId: MintId): AssetConfig | undefined {
    const key = mintId.toString();
    return this.cache.get(key);
  }

  public findConfigBySymbol(symbol: string): AssetConfig | undefined {
    return this.bySymbol.get(symbol);
  }

  public findConfigByReserveId(reserveId: ReserveId): AssetConfig | undefined {
    return this.byReserveId.get(reserveId.toBase58());
  }
}
