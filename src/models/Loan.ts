import { ReserveId } from "./ReserveId";
import { Lamport } from "./basic";
import { ProfileEntry } from "./ProfileEntry";
import { ExchangeRate } from "./ExchangeRate";
import { ReserveInfo } from "./ReserveInfo";

export class Loan extends ProfileEntry<Loan> {
  private readonly cumulativeBorrowRate: ExchangeRate;

  public constructor(
    reserveId: ReserveId,
    amount: Lamport,
    cumulativeBorrowRate: ExchangeRate
  ) {
    super(reserveId, amount);
    this.cumulativeBorrowRate = cumulativeBorrowRate;
  }

  public static zero(reserve: ReserveInfo): Loan {
    return new Loan(
      reserve.getReserveId(),
      Lamport.zero(),
      reserve.asset.getCumulativeBorrowRate()
    );
  }

  public accrueInterest(newCumulativeBorrowRate: ExchangeRate): Loan {
    const compoundedInterestRate = newCumulativeBorrowRate.divide(
      this.cumulativeBorrowRate.getRaw()
    );
    const newAmount = this.getAmount().multiply(
      compoundedInterestRate.getRaw()
    );
    return new Loan(this.getReserveId(), newAmount, newCumulativeBorrowRate);
  }

  public getCumulativeBorrowRate(): ExchangeRate {
    return this.cumulativeBorrowRate;
  }

  protected wrap(value: Lamport): Loan {
    return new Loan(this.getReserveId(), value, this.cumulativeBorrowRate);
  }
}
