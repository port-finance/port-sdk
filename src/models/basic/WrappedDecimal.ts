import { Numerical } from "./Numerical";
import { Decimal } from "./Decimal";
import Big, { BigSource } from "big.js";

export abstract class WrappedDecimal<
  D extends Decimal<D>,
  W extends WrappedDecimal<D, W>
> extends Numerical<W> {
  private readonly wrapped: D;

  protected constructor(wrapped: D) {
    super();
    this.wrapped = wrapped;
  }

  public getRaw(): Big {
    return this.getWrapped().getRaw();
  }

  public getWrapped(): D {
    return this.wrapped;
  }

  public replaceWithValue(value: BigSource): W {
    return this.wrap(this.getWrapped().replaceWithValue(value));
  }

  protected abstract wrap(value: D): W;
}
