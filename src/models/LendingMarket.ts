import {ReserveInfo} from "./ReserveInfo";

export class LendingMarket {
  reserves: ReserveInfo[];

  constructor(reserves?: ReserveInfo[]) {
    this.reserves = reserves || [];
  }
}
