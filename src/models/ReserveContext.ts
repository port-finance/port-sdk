import { MintId } from "./MintId";
import { ReserveInfo } from "./ReserveInfo";
import { ReserveId } from "./ReserveId";
import { StakingPoolId } from "./staking/StakingPoolId";
import { OracleId } from "./OracleId";
import type { TokenInfo } from "@solana/spl-token-registry";

export class ReserveContext {
  private static readonly RESERVE_CONTEXT_EMPTY = new ReserveContext(
    [],
    new Map(),
    new Map(),
    new Map(),
    new Map()
  );

  private readonly reserves: ReserveInfo[];
  private readonly byReserveId: Map<string, ReserveInfo>;
  private readonly byAssetMintId: Map<string, ReserveInfo>;
  private readonly byShareMintId: Map<string, ReserveInfo>;
  private readonly byStakingPoolId: Map<string, ReserveInfo>;

  private constructor(
    reserves: ReserveInfo[],
    byReserveId: Map<string, ReserveInfo>,
    byAssetMintId: Map<string, ReserveInfo>,
    byShareMintId: Map<string, ReserveInfo>,
    byStakingPoolId: Map<string, ReserveInfo>
  ) {
    this.reserves = reserves;
    this.byReserveId = byReserveId;
    this.byAssetMintId = byAssetMintId;
    this.byShareMintId = byShareMintId;
    this.byStakingPoolId = byStakingPoolId;
  }

  public static empty(): ReserveContext {
    return ReserveContext.RESERVE_CONTEXT_EMPTY;
  }

  public static index(
    reserves: ReserveInfo[],
    tokenMap?: Map<string, TokenInfo>
  ): ReserveContext {
    if (!reserves.length) {
      return ReserveContext.empty();
    }

    const readyToSortReserves = tokenMap
      ? reserves.filter((r) => {
          return tokenMap.has(r.getAssetMintId().toString());
        })
      : reserves;

    const sorted = readyToSortReserves.sort(
      (a, b) =>
        -a.getMarketCap().getValue().compare(b.getMarketCap().getValue())
    );

    const byReserveId = new Map<string, ReserveInfo>();
    const byAssetMintId = new Map<string, ReserveInfo>();
    const byShareMintId = new Map<string, ReserveInfo>();
    const byStakingPoolId = new Map<string, ReserveInfo>();
    sorted.forEach((reserve) =>
      byReserveId.set(reserve.getReserveId().toString(), reserve)
    );
    sorted.forEach((reserve) =>
      byAssetMintId.set(reserve.getAssetMintId().toString(), reserve)
    );
    sorted.forEach((reserve) =>
      byShareMintId.set(reserve.getShareMintId().toString(), reserve)
    );
    sorted.forEach((reserve) => {
      const stakingPoolId = reserve.getStakingPoolId();
      if (stakingPoolId) {
        byStakingPoolId.set(stakingPoolId.toString(), reserve);
      }
    });
    return new ReserveContext(
      sorted,
      byReserveId,
      byAssetMintId,
      byShareMintId,
      byStakingPoolId
    );
  }

  public isReady(): boolean {
    return this.reserves.length > 0;
  }

  public getAllReserves(): ReserveInfo[] {
    return this.reserves;
  }

  public getAllReservesPricePubKey(): (OracleId | null)[] {
    return this.reserves.map((r) => r.getOracleId());
  }

  public getReserve(reserveId: ReserveId): ReserveInfo {
    const result = this.findReserve(reserveId);
    if (!result) {
      throw new Error(`No reserve for ${reserveId}`);
    }

    return result;
  }

  public getByAssetMintId(mintId: MintId): ReserveInfo {
    const result = this.findByAssetMintId(mintId);
    if (!result) {
      throw new Error(`No reserve for asset mint ${mintId}`);
    }

    return result;
  }

  public getByShareMintId(mintId: MintId): ReserveInfo {
    const result = this.findByShareMintId(mintId);
    if (!result) {
      throw new Error(`No reserve for share mint ${mintId}`);
    }

    return result;
  }

  public findReserve(reserveId: ReserveId): ReserveInfo | undefined {
    const key = reserveId.toString();
    return this.byReserveId.get(key);
  }

  public findByAssetMintId(mintId: MintId): ReserveInfo | undefined {
    const key = mintId.toString();
    return this.byAssetMintId.get(key);
  }

  public findByShareMintId(mintId: MintId): ReserveInfo | undefined {
    const key = mintId.toString();
    return this.byShareMintId.get(key);
  }

  public findByStakingPoolId(
    stakingPoolId: StakingPoolId
  ): ReserveInfo | undefined {
    if (!stakingPoolId) {
      return undefined;
    }

    const key = stakingPoolId.toString();
    return this.byStakingPoolId.get(key);
  }
}
