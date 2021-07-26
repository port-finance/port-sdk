export class AssetDisplayConfig {

  readonly name: string;
  readonly symbol: string;

  constructor(
    name: string,
    symbol: string,
  ) {
    this.name = name;
    this.symbol = symbol;
  }

  public getName(): string {
    return this.name;
  }

  public getSymbol(): string {
    return this.symbol;
  }
}
