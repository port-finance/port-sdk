import { MintId } from "./MintId";
import { AssetExchangeRate } from "./AssetExchangeRate";
import { Asset } from "./Asset";
import { Token, Lamport } from "./basic";
import { TokenAccount } from "./TokenAccount";

export class Share extends Token<Share> {
  private constructor(mintId: MintId, lamport: Lamport) {
    super(mintId, lamport);
  }

  public static zero(mintId: MintId): Share {
    return Share.of(mintId, Lamport.zero());
  }

  public static max(mintId: MintId): Share {
    return Share.of(mintId, Lamport.max());
  }

  public static fromTokenAccount(account: TokenAccount): Share {
    return Share.of(account.getMintId(), account.getAmount());
  }

  public static of(mintId: MintId, lamport: Lamport): Share {
    return new Share(mintId, lamport);
  }

  public toAsset(exchangeRatio: AssetExchangeRate): Asset {
    console.assert(this.getMintId().equals(exchangeRatio.getShareMintId()));

    if (!exchangeRatio.isPresent()) {
      return Asset.zero(exchangeRatio.getAssetMintId());
    }

    const pct = exchangeRatio.getUnchecked();
    const lamport = Lamport.of(this.getRaw().div(pct).round(0));
    return Asset.of(exchangeRatio.getAssetMintId(), lamport);
  }

  protected wrap(value: Lamport): Share {
    return Share.of(this.getMintId(), value);
  }
}
