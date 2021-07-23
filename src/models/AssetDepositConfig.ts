import Big, {BigSource} from "big.js";

export class AssetDepositConfig {

  private readonly min?: Big;
  private readonly max?: Big;
  private readonly remain?: Big;

  constructor(args?: {
    min?: BigSource,
    max?: BigSource,
    remain?: BigSource,
  }) {
    this.min = args?.min ? new Big(args.min) : undefined;
    this.max = args?.max ? new Big(args.max) : undefined;
    this.remain = args?.remain ? new Big(args.remain) : undefined;
  }

  public getMin(): Big | undefined {
    return this.min;
  }

  public getMax(): Big | undefined {
    return this.max;
  }

  public getRemain(): Big | undefined {
    return this.remain;
  }
}
