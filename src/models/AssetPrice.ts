import Big, { BigSource } from "big.js";
import { Decimal, Percentage } from "./basic";
import { AssetConfig } from "./AssetConfig";
import { MintId } from "./MintId";

export class AssetPrice extends Decimal<AssetPrice> {
  private readonly mintId: MintId;

  private constructor(mintId: MintId, value: BigSource) {
    super(value);
    this.mintId = mintId;
  }

  public static of(mintId: MintId, value: BigSource): AssetPrice {
    return new AssetPrice(mintId, value);
  }

  public getMintId(): MintId {
    return this.mintId;
  }

  public addFee(pct: Percentage): AssetPrice {
    return this.multiply(new Big(1).add(pct.getRaw()));
  }

  public print(config: AssetConfig): string {
    const decimals = config.getPriceDecimals();
    return "$" + this.raw.round(decimals, 1).toFixed(decimals); // RoundHalfUp
  }

  public replaceWithValue(value: BigSource): AssetPrice {
    return new AssetPrice(this.getMintId(), value);
  }

  protected isCompatibleWith(that: AssetPrice): boolean {
    return this.getMintId().equals(that.getMintId());
  }
}
