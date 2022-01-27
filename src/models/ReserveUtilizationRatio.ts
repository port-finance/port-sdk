import { MintId } from "./MintId";
import { Ratio, Percentage } from "./basic";

export class ReserveUtilizationRatio extends Ratio<ReserveUtilizationRatio> {
  private readonly mintId: MintId;

  constructor(mintId: MintId, pct?: Percentage) {
    super(pct);
    this.mintId = mintId;
  }

  public static na(mintId: MintId): ReserveUtilizationRatio {
    return new ReserveUtilizationRatio(mintId);
  }

  public getMintId(): MintId {
    return this.mintId;
  }

  protected isCompatibleWith(that: ReserveUtilizationRatio): boolean {
    return this.mintId.equals(that.mintId);
  }
}
