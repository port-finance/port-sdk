import { StakeAccount } from "./StakeAccount";
import { StakeAccountId } from "./StakeAccountId";
import { StakingPoolId } from "./StakingPoolId";

export class StakeAccountContext {
  private static readonly STAKE_ACCOUNT_CONTEXT_EMPTY = new StakeAccountContext(
    [],
    new Map(),
    new Map()
  );

  private readonly accounts: StakeAccount[];
  private readonly byStakeAccountId: Map<string, StakeAccount>;
  private readonly byStakingPoolId: Map<string, StakeAccount>;

  private constructor(
    accounts: StakeAccount[],
    byStakeAccountId: Map<string, StakeAccount>,
    byStakingPoolId: Map<string, StakeAccount>
  ) {
    this.accounts = accounts;
    this.byStakeAccountId = byStakeAccountId;
    this.byStakingPoolId = byStakingPoolId;
  }

  public static empty(): StakeAccountContext {
    return StakeAccountContext.STAKE_ACCOUNT_CONTEXT_EMPTY;
  }

  public static index(accounts: StakeAccount[]): StakeAccountContext {
    if (!accounts.length) {
      return StakeAccountContext.empty();
    }

    const byStakeAccountId = new Map<string, StakeAccount>();
    accounts.forEach((a) =>
      byStakeAccountId.set(a.getStakeAccountId().toString(), a)
    );
    const byStakingPoolId = new Map<string, StakeAccount>();
    accounts.forEach((a) =>
      byStakingPoolId.set(a.getStakingPoolId().toString(), a)
    );
    return new StakeAccountContext(accounts, byStakeAccountId, byStakingPoolId);
  }

  public getAllStakeAccounts(): StakeAccount[] {
    return this.accounts;
  }

  public getStakeAccount(stakeAccountId: StakeAccountId): StakeAccount {
    const result = this.findStakeAccount(stakeAccountId);
    if (!result) {
      throw new Error(`No account for ${stakeAccountId}`);
    }

    return result;
  }

  public getStakeAccountByStakingPoolId(
    stakingPoolId: StakingPoolId
  ): StakeAccount {
    const result = this.findStakeAccountByStakingPoolId(stakingPoolId);
    if (!result) {
      throw new Error(`No account for staking pool ${stakingPoolId}`);
    }

    return result;
  }

  public findStakeAccount(
    stakeAccountId: StakeAccountId
  ): StakeAccount | undefined {
    const key = stakeAccountId.toString();
    return this.byStakeAccountId.get(key);
  }

  public findStakeAccountByStakingPoolId(
    stakingPoolId: StakingPoolId
  ): StakeAccount | undefined {
    const key = stakingPoolId.toString();
    return this.byStakingPoolId.get(key);
  }
}
