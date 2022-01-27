import { Field } from "./Field";
import Big from "big.js";
import { BigType } from "./BigType";

export class BigField extends Field<Big> {
  private readonly type: BigType;

  private constructor(type: BigType, property: string) {
    super(type.getBytes(), property);
    this.type = type;
  }

  public static forType(type: BigType, property: string): BigField {
    return new BigField(type, property);
  }

  public decode(b: Uint8Array, offset?: number): Big {
    const bn = this.type.getLayout().decode(b, offset);
    const big = new Big(bn.toString());
    const multiplier = this.type.getMultiplier();
    if (!multiplier) {
      return big;
    }
    return big.div(multiplier);
  }
}
