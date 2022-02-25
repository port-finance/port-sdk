import Big, { BigSource } from "big.js";
import { Decimal, DecimalField } from "./basic";
import { Field } from "../serialization/Field";
import { BigType } from "../serialization/BigType";

export class Slot extends Decimal<Slot> {
  private static SLOT_ZERO = Slot.of(0);

  private constructor(value: BigSource) {
    super(value);
  }

  public static zero(): Slot {
    return Slot.SLOT_ZERO;
  }

  public static of(raw: BigSource): Slot {
    return new Slot(raw);
  }

  public static field(property: string): Field<Slot> {
    return new SlotField(property);
  }

  public replaceWithValue(value: BigSource): Slot {
    return Slot.of(value);
  }
}

class SlotField extends DecimalField<Slot> {
  public constructor(property: string) {
    super(BigType.U64, property);
  }

  protected fromBig(big: Big): Slot {
    return Slot.of(big);
  }
}
