import Big, { BigSource } from "big.js";

import { AssetId } from "./AssetId";
import { Lamport } from "./Lamport";
import { Connection } from "@solana/web3.js";
import { SupplyApy } from "./SupplyApy";
import { QuoteValue } from "./QuoteValue";
import { AssetPrice } from "./AssetPrice";
import { AssetQuantityContext } from "./AssetQuantityContext";
import { AssetConfig } from "./AssetConfig";

export class Asset extends Lamport<AssetId, Asset> {
  public static MIN_NATIVE_LAMPORT = Asset.native(new Big(5_000_000));

  private static readonly SIGNIFICANT_DIGITS = 6;
  private static readonly LARGE_THRESHOLD = new Big(10).pow(6).toNumber();
  private static readonly FORMATTER_NORMAL = new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumSignificantDigits: Asset.SIGNIFICANT_DIGITS,
  });
  private static readonly FORMATTER_LARGE = new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: 0,
  });

  constructor(assetId: AssetId, value: BigSource) {
    super(assetId, value);
  }

  public static fromString(
    str: string,
    assetId: AssetId,
    context: AssetQuantityContext
  ): Asset {
    const increment = context.multiplier;
    const value = new Big(str).mul(increment).round(0, 0);
    return new Asset(assetId, value);
  }

  public static zero(assetId: AssetId) {
    return new Asset(assetId, 0);
  }

  public static max(assetId: AssetId): Asset {
    return new Asset(assetId, this.U64_MAX);
  }

  public static native(value: BigSource): Asset {
    return new Asset(AssetId.native(), value);
  }

  static async fetchMinRentExempt(
    connection: Connection,
    dataLength: number
  ): Promise<Asset> {
    const raw = await connection.getMinimumBalanceForRentExemption(dataLength);
    const value = new Big(raw);
    return Asset.native(value);
  }

  public isNative(): boolean {
    return this.getAssetId().isNative();
  }

  public getAssetId(): AssetId {
    return this.mintId;
  }

  public toValue(
    price: AssetPrice,
    quantityContext: AssetQuantityContext
  ): QuoteValue {
    console.assert(this.mintId.equals(price.assetId));
    if (!price) {
      return QuoteValue.zero();
    }
    const increment = quantityContext.multiplier;
    const value = this.raw.div(increment).mul(price.getRaw());
    return QuoteValue.of(value);
  }

  public toYield(supplyApy: SupplyApy): Asset {
    console.assert(this.mintId.equals(supplyApy.getAssetId()));
    if (!supplyApy.isPresent()) {
      return Asset.zero(this.mintId);
    }

    return new Asset(this.mintId, this.raw.mul(supplyApy.getUnchecked()));
  }

  public toNumber(context: AssetQuantityContext): number {
    const multiplier = context.multiplier;
    const decimals = context.decimals;
    return this.raw.div(multiplier).round(decimals, 0).toNumber();
  }

  public plain(context: AssetQuantityContext): string {
    return this.toNumber(context).toString();
  }

  public print(context: AssetQuantityContext, config?: AssetConfig): string {
    const num = this.toNumber(context);
    const formatted =
      num > Asset.LARGE_THRESHOLD
        ? Asset.FORMATTER_LARGE.format(num)
        : Asset.FORMATTER_NORMAL.format(num);
    if (!config) {
      return formatted;
    }
    return formatted + " " + config.display.getSymbol();
  }

  protected withValue(value: BigSource): Asset {
    return new Asset(this.mintId, value);
  }
}
