import { AssetId } from "./AssetId";
import { ReserveInfo } from "./ReserveInfo";
import { ReserveId } from "./ReserveId";
import { ShareId } from "./ShareId";

export class ReserveContext {
  private readonly reserves: ReserveInfo[];
  private readonly byReserveId: Map<string, ReserveInfo>;
  private readonly byAssetId: Map<string, ReserveInfo>;
  private readonly byShareId: Map<string, ReserveInfo>;

  private constructor(
    reserves: ReserveInfo[],
    byReserveId: Map<string, ReserveInfo>,
    byAssetId: Map<string, ReserveInfo>,
    byShareId: Map<string, ReserveInfo>
  ) {
    this.reserves = reserves;
    this.byReserveId = byReserveId;
    this.byAssetId = byAssetId;
    this.byShareId = byShareId;
  }

  public static index(reserves: ReserveInfo[]): ReserveContext {
    const byReserveId = new Map<string, ReserveInfo>();
    const byAssetId = new Map<string, ReserveInfo>();
    const byShareId = new Map<string, ReserveInfo>();
    reserves.forEach((reserve) =>
      byReserveId.set(reserve.getReserveId().toString(), reserve)
    );
    reserves.forEach((reserve) =>
      byAssetId.set(reserve.getAssetId().toString(), reserve)
    );
    reserves.forEach((reserve) =>
      byShareId.set(reserve.getShareId().toString(), reserve)
    );
    return new ReserveContext(reserves, byReserveId, byAssetId, byShareId);
  }

  public isReady() {
    return this.reserves.length > 0;
  }

  public getAllReserves(): ReserveInfo[] {
    return this.reserves;
  }

  public getReserveByReserveId(reserveId: ReserveId): ReserveInfo {
    const key = reserveId.toString();
    const result = this.byReserveId.get(key);
    if (!result) {
      throw new Error(`No ReserveInfo for reserve ${key}`);
    }

    return result;
  }

  public getReserveByAssetId(assetId: AssetId): ReserveInfo {
    const key = assetId.toString();
    const result = this.byAssetId.get(key);
    if (!result) {
      throw new Error(`No ReserveInfo for asset ${key}`);
    }

    return result;
  }

  public getReserveByShareId(shareId: ShareId): ReserveInfo {
    const key = shareId.toString();
    const result = this.byShareId.get(key);
    if (!result) {
      throw new Error(`No ReserveInfo for token ${key}`);
    }

    return result;
  }
}
