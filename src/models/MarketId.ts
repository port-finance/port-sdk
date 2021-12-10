import {PublicKey} from '@solana/web3.js';

import {Id} from './Id';

export class MarketId extends Id {
  private constructor(key: PublicKey) {
    super(key);
  }

  public static of(key: PublicKey): MarketId {
    return new MarketId(key);
  }
}
