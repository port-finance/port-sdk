import {StakingPoolId} from './StakingPoolId';
import {Parsed} from '../../serialization/Parsed';
import {TokenAccountId} from '../TokenAccountId';
import {Slot} from '../Slot';
import {ExchangeRate} from '../ExchangeRate';
import {Lamport} from '../basic';
import {RawData} from '../../serialization/RawData';
import {ReserveInfo} from '../ReserveInfo';
import {Apy} from '../Apy';
import {Share} from '../Share';
import {AssetPrice} from '../AssetPrice';
import {PORT_QUANTITY_CONTEXT} from '../../constants';
import {StakingPoolLayout, StakingPoolProto} from '../../structs';
import {AuthorityId} from '../AuthorityId';

const SLOT_PER_SECOND = 2;
const SLOT_PER_YEAR = SLOT_PER_SECOND * 3600 * 24 * 365;

export class StakingPool implements Parsed<StakingPoolId> {
  private readonly stakingPoolId: StakingPoolId;
  private readonly rewardTokenPool: TokenAccountId;
  private readonly lastUpdate: Slot;
  private readonly endTime: Slot;
  private readonly earliestRewardClaimTime: Slot;
  private readonly duration: Slot;
  private readonly ratePerSlot: ExchangeRate;
  private readonly cumulativeRate: ExchangeRate;
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

  public getCumulativeRate(): ExchangeRate {
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
      throw new Error('Slot older than last update');
    }

    const rateDiff = this.getRatePerSlot()
        .multiply(slotDiff.getRaw())
        .divide(poolSize.getRaw());
    return this.getCumulativeRate().add(rateDiff);
  }

  public getRewardApy(reserve: ReserveInfo, price: AssetPrice): Apy {
    const poolSize = this.getPoolSize();
    if (!poolSize.isPositive()) {
      return Apy.na();
    }

    const share = Share.of(reserve.getShareMintId(), poolSize);
    const asset = share.toAsset(reserve.getExchangeRatio());
    const tvl = asset.toValue(
        reserve.getMarkPrice(),
        reserve.getQuantityContext(),
    );

    const raw = this.getRatePerSlot()
        .getRaw()
        .mul(SLOT_PER_YEAR)
        .mul(price.getRaw())
        .div(PORT_QUANTITY_CONTEXT.multiplier) // dangerous!
        .div(tvl.getRaw());
    return Apy.of(raw);
  }
}


