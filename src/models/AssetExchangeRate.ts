import { MintId } from "./MintId";
import { Ratio, Percentage } from "./basic";

export class AssetExchangeRate extends Ratio<AssetExchangeRate> {
  private readonly shareMintId: MintId;
  private readonly assetMintId: MintId;

  constructor(shareMintId: MintId, assetMintId: MintId, pct?: Percentage) {
    super(pct);
    this.shareMintId = shareMintId;
    this.assetMintId = assetMintId;
  }

  public getShareMintId(): MintId {
    return this.shareMintId;
  }

  public getAssetMintId(): MintId {
    return this.assetMintId;
  }

  protected isCompatibleWith(that: AssetExchangeRate): boolean {
    return (
      this.shareMintId.equals(that.shareMintId) &&
      this.assetMintId.equals(that.assetMintId)
    );
  }
}
