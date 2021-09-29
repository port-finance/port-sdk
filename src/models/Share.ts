import { BigSource } from "big.js";

import { ShareId } from "./ShareId";
import { ExchangeRatio } from "./ExchangeRatio";
import { Asset } from "./Asset";
import { Lamport } from "./Lamport";

export class Share extends Lamport<ShareId, Share> {
  constructor(shareId: ShareId, value: BigSource) {
    super(shareId, value);
  }

  public static zero(shareId: ShareId): Share {
    return new Share(shareId, 0);
  }

  public static max(shareId: ShareId): Share {
    return new Share(shareId, this.U64_MAX);
  }

  public getShareId(): ShareId {
    return this.mintId;
  }

  public toAsset(exchangeRatio: ExchangeRatio): Asset {
    console.assert(this.mintId.equals(exchangeRatio.getShareId()));

    if (!exchangeRatio.isPresent()) {
      return Asset.zero(exchangeRatio.getAssetId());
    }

    const pct = exchangeRatio.getUnchecked();
    return new Asset(exchangeRatio.getAssetId(), this.raw.div(pct).round(0));
  }

  protected withValue(value: BigSource): Share {
    return new Share(this.mintId, value);
  }
}
