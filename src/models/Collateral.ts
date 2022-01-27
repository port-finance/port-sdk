import { ReserveId } from "./ReserveId";
import { Lamport } from "./basic";
import { ProfileEntry } from "./ProfileEntry";

export class Collateral extends ProfileEntry<Collateral> {
  public constructor(reserveId: ReserveId, amount: Lamport) {
    super(reserveId, amount);
  }

  public static zero(reserveId: ReserveId): Collateral {
    return new Collateral(reserveId, Lamport.zero());
  }

  protected wrap(value: Lamport): Collateral {
    return new Collateral(this.getReserveId(), value);
  }
}
