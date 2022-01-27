import { MintId } from "./MintId";
import { Ratio, Percentage } from "./basic";
export class ReserveBorrowRate extends Ratio<ReserveBorrowRate> {
  private readonly mintId: MintId;

  constructor(mintId: MintId, pct?: Percentage) {
    super(pct);
    this.mintId = mintId;
  }

  static na(mintId: MintId): ReserveBorrowRate {
    return new ReserveBorrowRate(mintId);
  }

  public getMintId(): MintId {
    return this.mintId;
  }

  protected isCompatibleWith(that: ReserveBorrowRate): boolean {
    return this.mintId.equals(that.mintId);
  }
}
