import Big, { BigSource } from "big.js";
import { u64 } from "@solana/spl-token";

import { Decimal, DecimalField } from "./Decimal";
import { BigType } from "../../serialization/BigType";
import { Field } from "../../serialization/Field";

export class Lamport extends Decimal<Lamport> {
  protected static readonly ZERO = new Lamport(0);
  protected static readonly ONE = new Lamport(1);
  protected static readonly MAX = new Lamport("18446744073709551615");

  private constructor(raw: BigSource) {
    super(raw);
  }

  public static zero(): Lamport {
    return Lamport.ZERO;
  }

  public static max(): Lamport {
    return Lamport.MAX;
  }

  public static of(raw: BigSource): Lamport {
    return new Lamport(raw);
  }

  public static field(type: BigType, property: string): Field<Lamport> {
    return new LamportField(type, property);
  }

  public isTrivial(): boolean {
    return this.lt(Lamport.ONE);
  }

  public isMax(): boolean {
    return this.eq(Lamport.MAX);
  }

  public toU64(): u64 {
    // eslint-disable-next-line new-cap
    return new u64(this.raw.toFixed(0, 0)); // RoundDown
  }

  public replaceWithValue(value: BigSource): Lamport {
    return Lamport.of(value);
  }
}

class LamportField extends DecimalField<Lamport> {
  public constructor(type: BigType, property: string) {
    super(type, property);
  }

  protected fromBig(big: Big): Lamport {
    return Lamport.of(big);
  }
}
