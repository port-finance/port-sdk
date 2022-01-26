import * as BufferLayout from "@solana/buffer-layout";

export abstract class Field<T> extends BufferLayout.Layout {
  public abstract decode(b: Uint8Array, offset?: number): T;
}
