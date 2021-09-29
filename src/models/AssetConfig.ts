import { AssetId } from "./AssetId";
import { ReserveId } from "./ReserveId";
import { AssetDisplayConfig } from "./AssetDisplayConfig";
import { AssetPriceConfig } from "./AssetPriceConfig";
import { AssetDepositConfig } from "./AssetDepositConfig";
import { Asset } from "./Asset";

export class AssetConfig {
  readonly assetId: AssetId;
  readonly reserveId: ReserveId;
  readonly display: AssetDisplayConfig;
  readonly price: AssetPriceConfig;
  readonly deposit: AssetDepositConfig;

  constructor(
    assetId: AssetId,
    reserveId: ReserveId,
    display: AssetDisplayConfig,
    price: AssetPriceConfig,
    deposit: AssetDepositConfig
  ) {
    this.assetId = assetId;
    this.reserveId = reserveId;
    this.display = display;
    this.price = price;
    this.deposit = deposit;
  }

  public getAssetId(): AssetId {
    return this.assetId;
  }

  public getReserveId(): ReserveId {
    return this.reserveId;
  }

  public getDisplayConfig(): AssetDisplayConfig {
    return this.display;
  }

  public getPriceConfig(): AssetPriceConfig {
    return this.price;
  }

  public getDepositConfig(): AssetDepositConfig {
    return this.deposit;
  }

  public getMaxDeposit(): Asset | undefined {
    const raw = this.deposit.getMax();
    return raw ? new Asset(this.assetId, raw) : undefined;
  }

  public getMinDeposit(): Asset | undefined {
    const raw = this.deposit.getMin();
    return raw ? new Asset(this.assetId, raw) : undefined;
  }

  public getRemainAsset(): Asset | undefined {
    const raw = this.deposit.getRemain();
    return raw ? new Asset(this.assetId, raw) : undefined;
  }
}
