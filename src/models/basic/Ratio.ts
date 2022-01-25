import { Percentage } from "./Percentage";
import Big, { Comparison } from "big.js";
import { Comparable } from "./Comparable";

export abstract class Ratio<R extends Ratio<R>> extends Comparable<R> {
  private readonly pct?: Percentage;

  protected constructor(pct?: Percentage) {
    super();
    this.pct = pct;
  }

  public isTrivial(): boolean {
    const pct = this.getPct();
    return !pct || pct.isTrivial();
  }

  public isPresent(): boolean {
    return !!this.pct;
  }

  public isPositive(): boolean {
    return !!this.getPct()?.isPositive();
  }

  public isNegative(): boolean {
    return !!this.getPct()?.isNegative();
  }

  public getUnchecked(): Big {
    if (!this.pct) {
      throw new Error("No value available");
    }

    return this.pct.getRaw();
  }

  public getPct(): Percentage | undefined {
    return this.pct;
  }

  public print(): string {
    return !this.pct ? "--" : this.pct.print();
  }

  public compare(that: R): Comparison {
    const thisPct = this.getPct();
    const thatPct = that.getPct();
    if (!thisPct || !thatPct) {
      return 0;
    }

    return thisPct.compare(thatPct);
  }

  public toString(): string {
    return this.print();
  }
}
