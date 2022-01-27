import { BlobField } from "./BlobField";
import BN from "bn.js";

export class UintField extends BlobField<BN> {
  public constructor(bytes: number, property?: string) {
    super(bytes, property);
  }

  protected fromBuffer(buffer: Buffer): BN {
    return new BN(
      [...buffer]
        .reverse()
        .map((i) => `00${i.toString(16)}`.slice(-2))
        .join(""),
      16
    );
  }
}
