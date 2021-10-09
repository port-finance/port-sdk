import BN from "bn.js";
import { PublicKey } from "@solana/web3.js";
import { StakingPoolProto } from "../structs/StakingPoolData";
import { ParsedAccount } from "../parsers/ParsedAccount";

export class StakingPoolInfo {
  private readonly stakingPoolId: PublicKey;
  private readonly rewardTokenPool: PublicKey;
  private readonly lastUpdate: BN;
  private readonly endTime: BN;
  private readonly duration: BN;
  private readonly earliestRewardClaimTime: BN;
  private readonly ratePerSlot: BN;
  private readonly cumulativeRate: BN;
  private readonly poolSize: BN;

  private constructor(
    stakingPoolId: PublicKey,
    rewardTokenPool: PublicKey,
    lastUpdate: BN,
    endTime: BN,
    duration: BN,
    earliestRewardClaimTime: BN,
    ratePerSlot: BN,
    cumulativeRate: BN,
    poolSize: BN,
  ) {
    this.stakingPoolId = stakingPoolId;
    this.rewardTokenPool = rewardTokenPool;
    this.lastUpdate = lastUpdate;
    this.endTime = endTime;
    this.earliestRewardClaimTime = earliestRewardClaimTime;
    this.duration = duration;
    this.ratePerSlot = ratePerSlot;
    this.cumulativeRate = cumulativeRate;
    this.poolSize = poolSize;
  }

  public static fromRaw(raw: ParsedAccount<StakingPoolProto>): StakingPoolInfo {
    const info = raw.data;

    return new StakingPoolInfo(
      raw.pubkey,
      info.rewardTokenPool,
      info.lastUpdate,
      info.endTime,
      info.duration,
      info.earliestRewardClaimTime,
      info.ratePerSlot,
      info.cumulativeRate,
      info.poolSize,
    );
  }

  public getId(): PublicKey {
    return this.getStakingPoolId();
  }

  public getStakingPoolId(): PublicKey {
    return this.stakingPoolId;
  }

  public getRewardTokenPool(): PublicKey {
    return this.rewardTokenPool;
  }

  public getLastUpdate(): BN {
    return this.lastUpdate;
  }

  public getEndTime(): BN {
    return this.endTime;
  }

  public getEarliestRewardClaimTime(): BN {
    return this.earliestRewardClaimTime;
  }

  public getDuration(): BN {
    return this.duration;
  }

  public getRatePerSlot(): BN {
    return this.ratePerSlot;
  }

  public getCumulativeRate(): BN {
    return this.cumulativeRate;
  }

  public getPoolSize(): BN {
    return this.poolSize;
  }

  public getEstimatedRate(currentSlot: BN): BN {
    const poolSize = this.getPoolSize();
    if (poolSize.isZero()) {
      return new BN(0);
    }

    currentSlot = BN.min(currentSlot, this.getEndTime())
    const slotDiff = currentSlot.sub(this.getLastUpdate());
    if (slotDiff.isNeg()) {
      throw new Error('Slot older than last update');
    }

    const rateDiff = this.getRatePerSlot()
      .mul(slotDiff)
      .div(poolSize);
    return this.getCumulativeRate().add(rateDiff);
  }
}
