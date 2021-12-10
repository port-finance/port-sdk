import BN from 'bn.js';
import Big from 'big.js';

const WAD_MULTIPLIER = new Big(10).pow(18);

export class Wads {
  private readonly value: BN;

  constructor(value: BN) {
    this.value = value;
  }

  public toBig(): Big {
    return new Big(this.value.toString()).div(WAD_MULTIPLIER);
  }
}
