import { Parsed } from "../../serialization/Parsed";
import { StakeAccountId } from "./StakeAccountId";
import { ExchangeRate } from "../ExchangeRate";
import { StakingPoolId } from "./StakingPoolId";
import { Lamport } from "../basic";
import { RawData } from "../../serialization/RawData";
import { StakeAccountLayout, StakeAccountProto } from "../../structs";

export class StakeAccount implements Parsed<StakeAccountId> {
  private readonly stakeAccountId: StakeAccountId;
  private readonly stakingPoolId: StakingPoolId;
  private readonly startRate: ExchangeRate;
  private readonly depositedAmount: Lamport;
  private readonly unclaimedReward: Lamport;

  private constructor(
    stakeAccountId: StakeAccountId,
    stakingPoolId: StakingPoolId,
    startRate: ExchangeRate,
    depositedAmount: Lamport,
    unclaimedReward: Lamport
  ) {
    this.stakeAccountId = stakeAccountId;
    this.stakingPoolId = stakingPoolId;
    this.startRate = startRate;
    this.depositedAmount = depositedAmount;
    this.unclaimedReward = unclaimedReward;
  }

  public static newAccount(
    stakeAccountId: StakeAccountId,
    stakingPoolId: StakingPoolId
  ): StakeAccount {
    return new StakeAccount(
      stakeAccountId,
      stakingPoolId,
      ExchangeRate.zero(),
      Lamport.zero(),
      Lamport.zero()
    );
  }

  public static fromRaw(raw: RawData): StakeAccount {
    const buffer = Buffer.from(raw.account.data);
    const proto = StakeAccountLayout.decode(buffer) as StakeAccountProto;

    const stakeAccountId = StakeAccountId.of(raw.pubkey);
    return new StakeAccount(
      stakeAccountId,
      proto.poolPubkey,
      proto.startRate,
      proto.depositedAmount,
      proto.unclaimedRewardWads
    );
  }

  public getId(): StakeAccountId {
    return this.getStakeAccountId();
  }

  public getStakeAccountId(): StakeAccountId {
    return this.stakeAccountId;
  }

  public getStakingPoolId(): StakingPoolId {
    return this.stakingPoolId;
  }

  public getStartRate(): ExchangeRate {
    return this.startRate;
  }

  public getDepositAmount(): Lamport {
    return this.depositedAmount;
  }

  public getUnclaimedReward(): Lamport {
    return this.unclaimedReward;
  }

  public getTotalClaimableReward(rate: ExchangeRate): Lamport {
    const rateDiff = rate.subtract(this.getStartRate());
    if (rateDiff.isNegative()) {
      throw new Error("Rate lower than start rate");
    }

    const extraClaimable = this.getDepositAmount().multiply(rateDiff.getRaw());
    return extraClaimable.add(this.getUnclaimedReward());
  }
}
