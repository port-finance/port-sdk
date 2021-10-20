import BN from "bn.js";
import { PublicKey } from "@solana/web3.js";
import { StakingPoolProto } from "../structs/StakingPoolData";
import { ParsedAccount } from "../parsers/ParsedAccount";
import Big from "big.js";
import { Wads } from "./Wads";

export class StakingPoolInfo {
  private readonly stakingPoolId: PublicKey;
  private readonly rewardTokenPool: PublicKey;
  private readonly ownerAuthority: PublicKey;
  private readonly adminAuthority: PublicKey;
  private readonly lastUpdate: BN;
  private readonly endTime: BN;
  private readonly duration: BN;
  private readonly earliestRewardClaimTime: BN;
  private readonly ratePerSlot: Big;
  private readonly cumulativeRate: Big;
  private readonly poolSize: BN;

  private constructor(
    stakingPoolId: PublicKey,
    rewardTokenPool: PublicKey,
    ownerAuthority: PublicKey,
    adminAuthority: PublicKey,
    lastUpdate: BN,
    endTime: BN,
    duration: BN,
    earliestRewardClaimTime: BN,
    ratePerSlot: Big,
    cumulativeRate: Big,
    poolSize: BN,
  ) {
    this.stakingPoolId = stakingPoolId;
    this.rewardTokenPool = rewardTokenPool;
    this.ownerAuthority = ownerAuthority;
    this.adminAuthority = adminAuthority;
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
      info.ownerAuthority,
      info.adminAuthority,
      info.lastUpdate,
      info.endTime,
      info.duration,
      info.earliestRewardClaimTime,
      new Wads(info.ratePerSlot).toBig(),
      new Wads(info.cumulativeRate).toBig(),
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

  public getOwnerPubkey(): PublicKey {
    return this.ownerAuthority;
  }

  public getAdminPubkey(): PublicKey {
    return this.adminAuthority;
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

  public getRatePerSlot(): Big {
    return this.ratePerSlot;
  }

  public getCumulativeRate(): Big {
    return this.cumulativeRate;
  }

  public getPoolSize(): BN {
    return this.poolSize;
  }

  public getEstimatedRate(currentSlot: BN): Big {
    const poolSize = this.getPoolSize();
    if (poolSize.isZero()) {
      return new Big(0);
    }

    currentSlot = BN.min(currentSlot, this.getEndTime())
    const slotDiff = currentSlot.sub(this.getLastUpdate());
    if (slotDiff.isNeg()) {
      throw new Error('Slot older than last update');
    }

    const rateDiff = this.getRatePerSlot()
      .mul(new Big(slotDiff.toString()))
      .div(new Big(poolSize.toString()));
    return this.getCumulativeRate().plus(rateDiff);
  }
}
