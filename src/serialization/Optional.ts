import * as BufferLayout from "@solana/buffer-layout";
import { Field } from "./Field";

export class Optional<T> extends Field<T | undefined> {
  private readonly delegate: Field<T>;

  private constructor(field: Field<T>) {
    super(field.span + 1, field.property);
    this.delegate = field;
  }

  public static of<T>(field: Field<T>): Optional<T> {
    return new Optional(field);
  }

  public decode(b: Uint8Array, offset?: number): T | undefined {
    const flag = BufferLayout.u8().decode(b, offset);
    if (!flag) {
      return undefined;
    }

    return this.delegate.decode(b, (offset || 0) + 1);
  }
}
