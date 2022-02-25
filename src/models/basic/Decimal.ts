import Big, { BigSource } from "big.js";
import { BigField } from "../../serialization/BigField";
import { Field } from "../../serialization/Field";
import { Numerical } from "./Numerical";
import { BigType } from "../../serialization/BigType";

export abstract class Decimal<D extends Decimal<D>> extends Numerical<D> {
  protected readonly raw: Big;

  protected constructor(raw: BigSource) {
    super();
    this.raw = new Big(raw);
  }

  public getRaw(): Big {
    return this.raw;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected isCompatibleWith(that: D): boolean {
    return true;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class DecimalField<T extends Decimal<any>> extends Field<T> {
  private readonly delegate: BigField;

  protected constructor(type: BigType, property: string) {
    super(type.getBytes(), property);
    this.delegate = BigField.forType(type, property);
  }

  public decode(b: Uint8Array, offset?: number): T {
    return this.fromBig(this.delegate.decode(b, offset));
  }

  protected abstract fromBig(big: Big): T;
}
