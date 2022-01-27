import { WrappedDecimal } from "../basic";
import { ExchangeRate } from "../ExchangeRate";

export class StakingRewardRate extends WrappedDecimal<
  ExchangeRate,
  StakingRewardRate
> {
  private constructor(wrapped: ExchangeRate) {
    super(wrapped);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected isCompatibleWith(that: StakingRewardRate): boolean {
    return false;
  }

  protected wrap(value: ExchangeRate): StakingRewardRate {
    return new StakingRewardRate(value);
  }
}
