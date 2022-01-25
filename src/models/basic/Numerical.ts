import Big, { BigSource, Comparison } from "big.js";
import { Comparable } from "./Comparable";

export abstract class Numerical<N extends Numerical<N>> extends Comparable<N> {
  private static readonly BIG_ZERO = new Big(0);

  protected constructor() {
    super();
  }

  public static sum<D extends Numerical<D>>(a: D, b: D): D {
    return a.add(b);
  }

  public min(that: N): N {
    this.checkCompatible(that);
    if (this.getRaw().lte(that.getRaw())) {
      return this.replaceWithValue(this.getRaw());
    }
    return this.replaceWithValue(that.getRaw());
  }

  public max(that: N): N {
    this.checkCompatible(that);
    if (this.getRaw().gte(that.getRaw())) {
      return this.replaceWithValue(this.getRaw());
    }
    return this.replaceWithValue(that.getRaw());
  }

  public add(that: N): N {
    this.checkCompatible(that);
    return this.replaceWithValue(this.getRaw().add(that.getRaw()));
  }

  public subtract(that: N): N {
    this.checkCompatible(that);
    return this.replaceWithValue(this.getRaw().sub(that.getRaw()));
  }

  public multiply(pct: BigSource): N {
    return this.replaceWithValue(this.getRaw().mul(pct));
  }

  public divide(pct: BigSource): N {
    return this.replaceWithValue(this.getRaw().div(pct));
  }

  public compare(that: N): Comparison {
    return this.compareRaw(that.getRaw());
  }

  public isZero(): boolean {
    return this.getSignum() === 0;
  }

  public isPositive(): boolean {
    return this.getSignum() > 0;
  }

  public isNegative(): boolean {
    return this.getSignum() < 0;
  }

  public getSignum(): number {
    return this.compareRaw(Numerical.BIG_ZERO);
  }

  public abstract getRaw(): Big;

  public abstract replaceWithValue(value: BigSource): N;

  private compareRaw(raw: BigSource): Comparison {
    return this.getRaw().cmp(raw);
  }
}
