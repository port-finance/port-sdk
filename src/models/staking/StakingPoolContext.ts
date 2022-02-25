import { StakingPool } from "./StakingPool";
import { StakingPoolId } from "./StakingPoolId";

export class StakingPoolContext {
  private static readonly STAKING_POOL_CONTEXT_EMPTY = new StakingPoolContext(
    [],
    new Map()
  );

  private readonly pools: StakingPool[];
  private readonly byStakingPoolId: Map<string, StakingPool>;

  private constructor(
    pools: StakingPool[],
    byStakingPoolId: Map<string, StakingPool>
  ) {
    this.pools = pools;
    this.byStakingPoolId = byStakingPoolId;
  }

  public static empty(): StakingPoolContext {
    return StakingPoolContext.STAKING_POOL_CONTEXT_EMPTY;
  }

  public static index(accounts: StakingPool[]): StakingPoolContext {
    if (!accounts.length) {
      return StakingPoolContext.empty();
    }

    const byStakingPoolId = new Map<string, StakingPool>();
    accounts.forEach((a) =>
      byStakingPoolId.set(a.getStakingPoolId().toString(), a)
    );
    return new StakingPoolContext(accounts, byStakingPoolId);
  }

  public getAllStakingPools(): StakingPool[] {
    return this.pools;
  }

  public getStakingPool(stakingPoolId: StakingPoolId): StakingPool {
    const result = this.findStakingPool(stakingPoolId);
    if (!result) {
      throw new Error(`No staking pool for ${stakingPoolId}`);
    }

    return result;
  }

  public findStakingPool(
    stakingPoolId: StakingPoolId
  ): StakingPool | undefined {
    const key = stakingPoolId.toString();
    return this.byStakingPoolId.get(key);
  }
}
