import {PublicKey} from '@solana/web3.js';

import {NATIVE_MINT} from '@solana/spl-token';
import {MintId} from './MintId';
import {MintType} from './MintType';

export class AssetId extends MintId {
  private constructor(key: PublicKey) {
    super(key, MintType.ASSET);
  }

  public static native(): AssetId {
    return AssetId.fromKey(NATIVE_MINT);
  }

  public static fromBase58(base58: string): AssetId {
    return AssetId.fromKey(new PublicKey(base58));
  }

  public static fromKey(key: PublicKey): AssetId {
    return new AssetId(key);
  }

  public isNative(): boolean {
    return this.key.equals(NATIVE_MINT);
  }
}
