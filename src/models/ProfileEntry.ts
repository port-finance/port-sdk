import { ReserveId } from "./ReserveId";
import { Lamport, WrappedLamport } from "./basic";

export abstract class ProfileEntry<
  T extends ProfileEntry<T>
> extends WrappedLamport<T> {
  private readonly reserveId: ReserveId;

  protected constructor(reserveId: ReserveId, amount: Lamport) {
    super(amount);
    this.reserveId = reserveId;
  }

  public getReserveId(): ReserveId {
    return this.reserveId;
  }

  protected isCompatibleWith(that: T): boolean {
    return this.getReserveId().equals(that.getReserveId());
  }
}
