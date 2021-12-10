import Big, {BigSource} from 'big.js';
import {u64} from '@solana/spl-token';

import {MintId} from './MintId';
import {Decimal} from './Decimal';

export abstract class Lamport<
  I extends MintId,
  L extends Lamport<I, L>
> extends Decimal<L> {
  protected static U64_MAX = new Big('18446744073709551615');

  mintId: I;

  protected constructor(mintId: I, value: BigSource) {
    super(value);
    this.mintId = mintId;
  }

  public isNative(): boolean {
    return this.getMintId().isNative();
  }

  public getMintId(): MintId {
    return this.mintId;
  }

  public isMax(): boolean {
    return this.raw.eq(Lamport.U64_MAX);
  }

  public toU64(): u64 {
    return new u64(this.raw.toFixed(0, 0)); // RoundDown
  }

  protected isCompatibleWith(that: L): boolean {
    return this.mintId.equals(that.mintId);
  }
}
