import { BalanceId } from "./BalanceId";
import { Lamport } from "./Lamport";
import { MintId } from "./MintId";

export class Balance<L extends Lamport<any, any>> {
  private readonly balanceId: BalanceId;
  private readonly amount: L;

  constructor(balanceId: BalanceId, lamport: L) {
    this.balanceId = balanceId;
    this.amount = lamport;
  }

  public isNative(): boolean {
    return this.getBalanceId().isNative();
  }

  public getBalanceId(): BalanceId {
    return this.balanceId;
  }

  public getMintId(): MintId {
    return this.getAmount().getMintId();
  }

  public isPositive(): boolean {
    return this.amount.isPositive();
  }

  public getAmount(): L {
    return this.amount;
  }
}
