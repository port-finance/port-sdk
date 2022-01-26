import { Apy } from "./Apy";
import { ReserveId } from "./ReserveId";
import { MintId } from "./MintId";

export class AdditionalReward {
  private readonly reserveId: ReserveId;
  private readonly apy: Apy;
  private readonly accurate: boolean;
  private readonly mintId?: MintId;

  constructor(
    reserveId: ReserveId,
    apy: Apy,
    accurate?: boolean,
    mintId?: MintId
  ) {
    this.reserveId = reserveId;
    this.apy = apy;
    this.accurate = !!accurate;
    this.mintId = mintId;
  }

  public getReserveId(): ReserveId {
    return this.reserveId;
  }

  public getApy(): Apy {
    return this.apy;
  }

  public getAccurate(): boolean {
    return this.accurate;
  }

  public getMintId(): MintId | undefined {
    return this.mintId;
  }
}
