export class AssetDisplayConfig {

  readonly name: string;
  readonly symbol: string;
  private readonly icon?: string;
  private readonly color?: string;

  constructor(
    name: string,
    symbol: string,
    icon?: string,
    color?: string,
  ) {
    this.name = name;
    this.symbol = symbol;
    this.icon = icon;
    this.color = color;
  }

  public getName(): string {
    return this.name;
  }

  public getSymbol(): string {
    return this.symbol;
  }

  public getIcon(): string | undefined {
    return this.icon;
  }

  public getColor(): string | undefined {
    return this.color;
  }
}
