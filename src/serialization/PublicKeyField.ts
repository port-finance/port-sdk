import { MAX_SEED_LENGTH, PublicKey } from "@solana/web3.js";
import { BlobField } from "./BlobField";

export abstract class PublicKeyField<T extends PublicKey> extends BlobField<T> {
  protected constructor(property?: string) {
    super(MAX_SEED_LENGTH, property);
  }

  protected fromBuffer(buffer: Buffer): T {
    return this.fromPublicKey(new PublicKey(buffer));
  }

  protected abstract fromPublicKey(pubKey: PublicKey): T;
}
