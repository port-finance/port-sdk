// be careful with circular references.
import { AssetConfig } from "../models/AssetConfig";
import { AssetDisplayConfig } from "../models/AssetDisplayConfig";
import { AssetPriceConfig } from "../models/AssetPriceConfig";
import { MintId } from "../models/MintId";

export const DEFAULT_ASSET_CONFIG = new AssetConfig(
  MintId.fromBase58("So11111111111111111111111111111111111111112"),
  new AssetDisplayConfig("Default Token", "Default"),
  AssetPriceConfig.fromDecimals(3)
);
