import {ReserveId} from "./ReserveId";
import {ReserveInfo} from "./ReserveInfo";

export class ReserveWhitelist {

  private readonly reserveIds: ReserveId[];

  constructor(reserveIds: ReserveId[]) {
    this.reserveIds = reserveIds;
  }

  public isWhitelisted(reserve: ReserveInfo): boolean {
    return !!this.reserveIds.find(r => r.equals(reserve.getReserveId()));
  }
}
