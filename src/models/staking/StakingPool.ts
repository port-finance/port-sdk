import { StakingPoolId } from "./StakingPoolId";
import { Parsed } from "../../serialization/Parsed";
import { TokenAccountId } from "../TokenAccountId";
import { Slot } from "../Slot";
import { ExchangeRate } from "../ExchangeRate";
import { Lamport } from "../basic";
import { RawData } from "../../serialization/RawData";
import { ReserveInfo } from "../ReserveInfo";
import { Apy } from "../Apy";
import { Share } from "../Share";
import { AssetPrice } from "../AssetPrice";
import { StakingPoolLayout, StakingPoolProto } from "../../structs";
import { AuthorityId } from "../AuthorityId";
import Big from "big.js";
import type { TokenInfo } from "@solana/spl-token-registry";
import { QuantityContext } from "..";

const SLOT_PER_SECOND = 2;
const SLOT_PER_YEAR = SLOT_PER_SECOND * 3600 * 24 * 365;

export class StakingPool implements Parsed<StakingPoolId> {
  private readonly stakingPoolId: StakingPoolId;
  private readonly rewardTokenPool: TokenAccountId;
  private readonly subRewardTokenPool?: TokenAccountId;
  private readonly lastUpdate: Slot;
  private readonly endTime: Slot;
  private readonly earliestRewardClaimTime: Slot;
  private readonly duration: Slot;
  private readonly ratePerSlot: ExchangeRate;
  private readonly subRatePerSlot?: ExchangeRate;
  private readonly cumulativeRate: ExchangeRate;
  private readonly subCumulativeRate?: ExchangeRate;
  private readonly poolSize: Lamport;

  // use in api-server
  private readonly ownerAuthority: AuthorityId;
  private readonly adminAuthority: AuthorityId;

  private constructor(
    stakingPoolId: StakingPoolId,
    rewardTokenPool: TokenAccountId,
    lastUpdate: Slot,
    endTime: Slot,
    earliestRewardClaimTime: Slot,
    duration: Slot,
    ratePerSlot: ExchangeRate,
    cumulativeRate: ExchangeRate,
    poolSize: Lamport,
    ownerAuthority: AuthorityId,
    adminAuthority: AuthorityId,
    subRewardTokenPool?: TokenAccountId,
    subRatePerSlot?: ExchangeRate,
    subCumulativeRate?: ExchangeRate
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
    this.ownerAuthority = ownerAuthority;
    this.adminAuthority = adminAuthority;
    this.subRewardTokenPool = subRewardTokenPool;
    this.subRatePerSlot = subRatePerSlot;
    this.subCumulativeRate = subCumulativeRate;
  }

  public static fromRaw(raw: RawData): StakingPool {
    const buffer = Buffer.from(raw.account.data);
    const info = StakingPoolLayout.decode(buffer) as StakingPoolProto;

    return new StakingPool(
      StakingPoolId.of(raw.pubkey),
      info.rewardTokenPool,
      info.lastUpdate,
      info.endTime,
      info.earliestRewardClaimTime,
      info.duration,
      info.ratePerSlot,
      info.cumulativeRate,
      info.poolSize,
      info.ownerAuthority,
      info.adminAuthority,
      info.subRewardTokenPoolOption === 1 ? info.subRewardTokenPool : undefined,
      info.subRatePerSlotOption === 1 ? info.subRatePerSlot : undefined,
      info.subCumulativeRateOption === 1 ? info.subCumulativeRate : undefined
    );
  }

  public getOwnerAuthorityId(): AuthorityId {
    return this.ownerAuthority;
  }

  public getAdminAuthorityId(): AuthorityId {
    return this.adminAuthority;
  }

  public getId(): StakingPoolId {
    return this.getStakingPoolId();
  }

  public getStakingPoolId(): StakingPoolId {
    return this.stakingPoolId;
  }

  public getRewardTokenPool(): TokenAccountId {
    return this.rewardTokenPool;
  }

  public getSubRewardTokenPool(): TokenAccountId | undefined {
    return this.subRewardTokenPool;
  }

  public getLastUpdate(): Slot {
    return this.lastUpdate;
  }

  public getEndTime(): Slot {
    return this.endTime;
  }

  public getEarliestRewardClaimTime(): Slot {
    return this.earliestRewardClaimTime;
  }

  public getDuration(): Slot {
    return this.duration;
  }

  public getRatePerSlot(): ExchangeRate {
    return this.ratePerSlot;
  }

  public getSubRatePerSlot(): ExchangeRate | undefined {
    return this.subRatePerSlot;
  }

  public getCumulativeRate(): ExchangeRate {
    return this.cumulativeRate;
  }

  public getSubCumulativeRate(): ExchangeRate | undefined {
    return this.cumulativeRate;
  }

  public getPoolSize(): Lamport {
    return this.poolSize;
  }

  public isPoolEnd(currentSlot: Slot): boolean {
    return this.getEndTime().lt(currentSlot);
  }

  public getEstimatedRate(currentSlot: Slot): ExchangeRate {
    const poolSize = this.getPoolSize();
    if (poolSize.isZero()) {
      return ExchangeRate.zero();
    }

    currentSlot = currentSlot.min(this.getEndTime());
    const slotDiff = currentSlot.subtract(this.getLastUpdate());
    if (slotDiff.isNegative()) {
      throw new Error("Slot older than last update");
    }

    const rateDiff = this.getRatePerSlot()
      .multiply(slotDiff.getRaw())
      .divide(poolSize.getRaw());
    return this.getCumulativeRate().add(rateDiff);
  }

  public getRewardApy(
    reserve: ReserveInfo,
    price: AssetPrice,
    tokenInfo: TokenInfo
  ): Apy {
    return this.getRewardApyInner(
      reserve,
      tokenInfo,
      price.getRaw(),
      this.getRatePerSlot()
    );
  }

  public getSubRewardApy(
    reserve: ReserveInfo,
    price: AssetPrice | Big,
    tokenInfo: TokenInfo
  ): Apy {
    const subRatePerSlot = this.getSubRatePerSlot();
    if (!subRatePerSlot) {
      return Apy.na();
    } else if (price instanceof AssetPrice) {
      return this.getRewardApyInner(
        reserve,
        tokenInfo,
        price.getRaw(),
        subRatePerSlot
      );
    } else {
      return this.getRewardApyInner(reserve, tokenInfo, price, subRatePerSlot);
    }
  }

  private getRewardApyInner(
    reserve: ReserveInfo,
    tokenInfo: TokenInfo,
    price: Big,
    ratePerSlot: ExchangeRate
  ): Apy {
    const poolSize = this.getPoolSize();
    if (!poolSize.isPositive()) {
      return Apy.na();
    }

    const share = Share.of(reserve.getShareMintId(), poolSize);
    const asset = share.toAsset(reserve.getExchangeRatio());
    const tvl = asset.toValue(
      reserve.getMarkPrice(),
      reserve.getQuantityContext()
    );

    const qtyContext = QuantityContext.fromDecimals(tokenInfo.decimals);

    const raw = ratePerSlot
      .getRaw()
      .mul(SLOT_PER_YEAR)
      .mul(price)
      .div(qtyContext.multiplier)
      .div(tvl.getRaw());
    return Apy.of(raw);
  }
}
