import { MintId } from "./MintId";
import { ReserveId } from "./ReserveId";
import { AssetDisplayConfig } from "./AssetDisplayConfig";
import { AssetPriceConfig } from "./AssetPriceConfig";
import { AssetDepositConfig } from "./AssetDepositConfig";
import { Asset } from "./Asset";
import { Lamport } from "./basic";

export class AssetConfig {
  private readonly mintId: MintId;
  private readonly display: AssetDisplayConfig;
  private readonly price: AssetPriceConfig;
  private readonly deposit: AssetDepositConfig | undefined;
  private readonly isDefault: boolean;

  constructor(
    mintId: MintId,
    display: AssetDisplayConfig,
    price: AssetPriceConfig,
    deposit?: AssetDepositConfig,
    isDefault?: boolean
  ) {
    this.mintId = mintId;
    this.display = display;
    this.price = price;
    this.deposit = deposit;
    this.isDefault = isDefault ?? false;
  }

  public checkIsDefault(): boolean {
    return this.isDefault;
  }

  public getMintId(): MintId {
    return this.mintId;
  }

  public getName(): string {
    return this.getDisplayConfig().getName();
  }

  public getSymbol(): string {
    return this.getDisplayConfig().getSymbol();
  }

  public getColor(): string | undefined {
    return this.getDisplayConfig().getColor();
  }

  public getDisplayConfig(): AssetDisplayConfig {
    return this.display;
  }

  public getPriceDecimals(): number {
    return this.getPriceConfig().getDecimals();
  }

  public getPriceConfig(): AssetPriceConfig {
    return this.price;
  }

  public getReserveId(): ReserveId | undefined {
    return this.getDepositConfig()?.getReserveId();
  }

  public getMaxDeposit(): Asset | undefined {
    const raw = this.getDepositConfig()?.getMax();
    return raw ? Asset.of(this.mintId, Lamport.of(raw)) : undefined;
  }

  public getMinDeposit(): Asset | undefined {
    const raw = this.getDepositConfig()?.getMin();
    return raw ? Asset.of(this.mintId, Lamport.of(raw)) : undefined;
  }

  public getRemainAsset(): Asset | undefined {
    const raw = this.getDepositConfig()?.getRemain();
    return raw ? Asset.of(this.mintId, Lamport.of(raw)) : undefined;
  }

  public getDepositConfig(): AssetDepositConfig | undefined {
    return this.deposit;
  }
}
