import { StakingPoolInfo } from "./StakingPoolInfo";
import { PublicKey } from "@solana/web3.js";

export class StakingPoolContext {
  private readonly stakingPools: StakingPoolInfo[];
  private readonly byStakingPoolId: Map<string, StakingPoolInfo>;

  private constructor(
    reserves: StakingPoolInfo[],
    byReserveId: Map<string, StakingPoolInfo>,
  ) {
    this.stakingPools = reserves;
    this.byStakingPoolId = byReserveId;
  }

  public static index(stakingPools: StakingPoolInfo[]): StakingPoolContext {
    const byReserveId = new Map<string, StakingPoolInfo>();
    stakingPools.forEach((reserve) =>
      byReserveId.set(reserve.getStakingPoolId().toBase58(), reserve)
    );
    return new StakingPoolContext(stakingPools, byReserveId);
  }

  public isReady() {
    return this.stakingPools.length > 0;
  }

  public getAllReserves(): StakingPoolInfo[] {
    return this.stakingPools;
  }

  public getStakingPoolById(poolId: PublicKey): StakingPoolInfo {
    const key = poolId.toString();
    const result = this.byStakingPoolId.get(key);
    if (!result) {
      throw new Error(`No ReserveInfo for reserve ${key}`);
    }

    return result;
  }

}
