import {PublicKey} from '@solana/web3.js';

import {Id} from './Id';
import {MintType} from './MintType';

export abstract class MintId extends Id {
  private readonly type: MintType;

  protected constructor(key: PublicKey, type: MintType) {
    super(key);
    this.type = type;
  }

  public abstract isNative(): boolean;

  public isAsset() {
    return this.getMintType() === MintType.ASSET;
  }

  public isShare() {
    return this.getMintType() === MintType.SHARE;
  }

  public getMintType(): MintType {
    return this.type;
  }
}
