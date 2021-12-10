import {ShareId} from './ShareId';
import {AssetId} from './AssetId';
import {Ratio} from './Ratio';
import {BigSource} from 'big.js';

export class ExchangeRatio extends Ratio {
  private readonly shareId: ShareId;
  private readonly assetId: AssetId;

  constructor(base: ShareId, quote: AssetId, pct?: BigSource) {
    super(pct);
    this.shareId = base;
    this.assetId = quote;
  }

  public getShareId(): ShareId {
    return this.shareId;
  }

  public getAssetId(): AssetId {
    return this.assetId;
  }
}
