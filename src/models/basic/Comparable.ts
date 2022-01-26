import { Comparison } from "big.js";

export abstract class Comparable<C extends Comparable<C>> {
  public eq(that?: C): boolean {
    if (!that) {
      return false;
    }
    return this.checkAndCompare(that) === 0;
  }

  public lt(that?: C): boolean {
    if (!that) {
      return false;
    }
    return this.checkAndCompare(that) < 0;
  }

  public lte(that?: C): boolean {
    if (!that) {
      return false;
    }
    return this.checkAndCompare(that) <= 0;
  }

  public gt(that?: C): boolean {
    if (!that) {
      return false;
    }
    return this.checkAndCompare(that) > 0;
  }

  public gte(that?: C): boolean {
    if (!that) {
      return false;
    }
    return this.checkAndCompare(that) >= 0;
  }

  protected abstract compare(that: C): Comparison;

  protected abstract isCompatibleWith(that: C): boolean;

  protected checkCompatible(that: C): void {
    console.assert(this.isCompatibleWith(that));
  }

  private checkAndCompare(that: C): Comparison {
    this.checkCompatible(that);
    return this.compare(that);
  }
}
