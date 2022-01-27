import Big from "big.js";

import { Token, Lamport, Percentage } from "./basic";
import { Apy } from "./Apy";
import { QuoteValue } from "./QuoteValue";
import { AssetPrice } from "./AssetPrice";
import { QuantityContext } from "./QuantityContext";
import { Share } from "./Share";
import { AssetExchangeRate } from "./AssetExchangeRate";
import { MintId } from "./MintId";
import { TokenAccount } from "./TokenAccount";

export class Asset extends Token<Asset> {
  public static readonly MIN_NATIVE_LAMPORT = Asset.native(
    Lamport.of(5_000_000)
  );

  private static SIGNIFICANT_DIGITS = 6;
  private static LARGE_THRESHOLD = new Big(10).pow(6).toNumber();
  private static FORMATTER_NORMAL = new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumSignificantDigits: Asset.SIGNIFICANT_DIGITS,
  });
  private static FORMATTER_LARGE = new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: 0,
  });

  private constructor(mintId: MintId, lamport: Lamport) {
    super(mintId, lamport);
  }

  public static fromString(
    str: string,
    mintId: MintId,
    context: QuantityContext
  ): Asset {
    const increment = context.multiplier;
    const lamport = Lamport.of(new Big(str).mul(increment).round(0, 0));
    return new Asset(mintId, lamport);
  }

  public static zero(mintId: MintId): Asset {
    return Asset.of(mintId);
  }

  public static max(mintId: MintId): Asset {
    return Asset.of(mintId, Lamport.max());
  }

  public static native(lamport: Lamport): Asset {
    return Asset.of(MintId.native(), lamport);
  }

  public static fromTokenAccount(account: TokenAccount): Asset {
    return Asset.of(account.getMintId(), account.getAmount());
  }

  public static of(mintId: MintId, lamport?: Lamport): Asset {
    return new Asset(mintId, lamport || Lamport.zero());
  }

  public isNative(): boolean {
    return this.getMintId().isNative();
  }

  public toValue(
    price: AssetPrice,
    quantityContext: QuantityContext
  ): QuoteValue {
    console.assert(
      this.getMintId().equals(price.getMintId()),
      `asset id: ${this.getMintId()} price id: ${price.getMintId()}`
    );
    if (!price) {
      return QuoteValue.zero();
    }

    const increment = quantityContext.multiplier;
    const value = this.getRaw().div(increment).mul(price.getRaw());
    return QuoteValue.of(value);
  }

  public toInterest(supplyApy: Apy): Asset {
    if (!supplyApy.isPresent()) {
      return Asset.zero(this.getMintId());
    }

    const lamport = Lamport.of(this.getRaw().mul(supplyApy.getUnchecked()));
    return Asset.of(this.getMintId(), lamport);
  }

  public toShare(exchangeRatio: AssetExchangeRate): Share {
    console.assert(this.getMintId().equals(exchangeRatio.getAssetMintId()));

    if (!exchangeRatio.isPresent()) {
      return Share.zero(exchangeRatio.getShareMintId());
    }

    const lamport = Lamport.of(
      this.getRaw().mul(exchangeRatio.getUnchecked()).round(0)
    );
    return Share.of(exchangeRatio.getShareMintId(), lamport);
  }

  public addFee(pct: Percentage): Asset {
    return this.multiply(new Big(1).add(pct.getRaw()));
  }

  public toNumber(context: QuantityContext): number {
    const multiplier = context.multiplier;
    const decimals = context.decimals;
    return this.getRaw().div(multiplier).round(decimals, 0).toNumber();
  }

  public plain(context: QuantityContext): string {
    return this.toLimitRoundNumber(context).toString();
  }

  public toLimitRoundNumber(context: QuantityContext): number {
    const multiplier = context.multiplier;
    const decimals = context.decimals;
    return this.getRaw()
      .div(multiplier)
      .round(Math.min(decimals, 6), 0)
      .toNumber();
  }

  public print(context: QuantityContext | undefined, symbol?: string): string {
    if (!context) {
      return "--";
    }

    const num = this.toLimitRoundNumber(context);
    const formatted =
      num > Asset.LARGE_THRESHOLD
        ? Asset.FORMATTER_LARGE.format(num)
        : Asset.FORMATTER_NORMAL.format(num);
    if (!symbol) {
      return formatted;
    }
    return formatted + " " + symbol;
  }

  protected wrap(value: Lamport): Asset {
    return Asset.of(this.getMintId(), value);
  }
}
