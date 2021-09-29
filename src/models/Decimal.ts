import Big, { BigSource, Comparison } from "big.js";

export abstract class Decimal<D extends Decimal<D>> {
  protected static BIG_ZERO = new Big(0);

  protected readonly raw: Big;

  protected constructor(raw: BigSource) {
    this.raw = new Big(raw);
  }

  public static sum<D extends Decimal<D>>(a: D, b: D): D {
    return a.add(b);
  }

  public getRaw(): Big {
    return this.raw;
  }

  public min(that: D): D {
    this.checkCompatible(that);
    if (this.raw.lte(that.raw)) {
      return this.withValue(this.raw);
    }
    return this.withValue(that.raw);
  }

  public max(that: D): D {
    this.checkCompatible(that);
    if (this.raw.gte(that.raw)) {
      return this.withValue(this.raw);
    }
    return this.withValue(that.raw);
  }

  public add(that: D): D {
    this.checkCompatible(that);
    return this.withValue(this.raw.add(that.raw));
  }

  public subtract(that: D): D {
    this.checkCompatible(that);
    return this.withValue(this.raw.sub(that.raw));
  }

  public multiply(pct: BigSource): D {
    return this.withValue(this.raw.mul(pct));
  }

  public eq(that?: D): boolean {
    if (!that) {
      return false;
    }
    this.checkCompatible(that);
    return this.raw.eq(that.raw);
  }

  public lt(that?: D): boolean {
    if (!that) {
      return false;
    }
    this.checkCompatible(that);
    return this.raw.lt(that.raw);
  }

  public lte(that?: D): boolean {
    if (!that) {
      return false;
    }
    this.checkCompatible(that);
    return this.raw.lte(that.raw);
  }

  public gt(that?: D): boolean {
    if (!that) {
      return false;
    }
    this.checkCompatible(that);
    return this.raw.gt(that.raw);
  }

  public gte(that?: D): boolean {
    if (!that) {
      return false;
    }
    this.checkCompatible(that);
    return this.raw.gte(that.raw);
  }

  public compare(that: D): Comparison {
    this.checkCompatible(that);
    return this.raw.cmp(that.raw);
  }

  public isZero(): boolean {
    return this.raw.eq(Decimal.BIG_ZERO);
  }

  public isPositive(): boolean {
    return this.raw.gt(Decimal.BIG_ZERO);
  }

  public isNegative(): boolean {
    return this.raw.lt(Decimal.BIG_ZERO);
  }

  protected abstract isCompatibleWith(that: D): boolean;

  protected abstract withValue(value: BigSource): D;

  private checkCompatible(that: D): void {
    console.assert(this.isCompatibleWith(that));
  }
}
