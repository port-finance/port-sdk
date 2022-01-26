import * as BufferLayout from "@solana/buffer-layout";
import { Field } from "./Field";

export abstract class BlobField<T> extends Field<T> {
  private readonly delegate: BufferLayout.Blob;

  protected constructor(span: number, property?: string) {
    super(span, property);
    this.delegate = new BufferLayout.Blob(span, property);
  }

  public decode(b: Uint8Array, offset?: number): T {
    const blob = this.delegate.decode(b, offset);
    return this.fromBuffer(blob);
  }

  protected abstract fromBuffer(buffer: Buffer): T;
}
