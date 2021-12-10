import {PublicKey} from '@solana/web3.js';
import {MintId} from './MintId';
import {MintType} from './MintType';

export class ShareId extends MintId {
  constructor(key: PublicKey) {
    super(key, MintType.SHARE);
  }

  static fromBase58(base58: string): ShareId {
    return new ShareId(new PublicKey(base58));
  }

  public isNative(): boolean {
    return false;
  }
}
