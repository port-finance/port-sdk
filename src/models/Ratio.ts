import {Percentage} from './Percentage';
import Big, {BigSource} from 'big.js';

export abstract class Ratio {
  private readonly pct?: Percentage;

  protected constructor(pct?: BigSource) {
    this.pct = pct ? new Percentage(pct) : undefined;
  }

  public isPresent(): boolean {
    return !!this.pct;
  }

  public getUnchecked(): Big {
    if (!this.pct) {
      throw Error('No value available');
    }

    return this.pct.getRaw();
  }

  public getPct(): Percentage | undefined {
    return this.pct;
  }

  public print(): string {
    return !this.pct ? '--' : this.pct.print();
  }

  public toString(): string {
    return this.print();
  }
}
