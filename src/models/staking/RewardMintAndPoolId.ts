import { StakingPoolId } from "./StakingPoolId";
import { MintId } from "../MintId";

export interface RewardMintIdAndPoolId {
  primaryMintId: MintId;
  secondaryMintId?: MintId;
  poolId: StakingPoolId;
}
