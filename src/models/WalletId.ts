import {PublicKey} from '@solana/web3.js';

import {Id} from './Id';

export class WalletId extends Id {
  private constructor(key: PublicKey) {
    super(key);
  }

  public static fromBase58(base58: string): WalletId {
    return WalletId.of(new PublicKey(base58));
  }

  public static of(key: PublicKey): WalletId {
    return new WalletId(key);
  }
}
