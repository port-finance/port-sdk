import Big, { BigSource } from "big.js";
import { ReserveId } from "./ReserveId";

export class AssetDepositConfig {
  private readonly reserveId: ReserveId;
  private readonly min?: Big;
  private readonly max?: Big;
  private readonly remain?: Big;

  constructor(
    reserveId: ReserveId,
    args?: { min?: BigSource; max?: BigSource; remain?: BigSource }
  ) {
    this.reserveId = reserveId;
    this.min = args?.min ? new Big(args.min) : undefined;
    this.max = args?.max ? new Big(args.max) : undefined;
    this.remain = args?.remain ? new Big(args.remain) : undefined;
  }

  public getReserveId(): ReserveId {
    return this.reserveId;
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
