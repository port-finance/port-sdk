import { PublicKey } from "@solana/web3.js";

import { Id } from "./basic";
import { NATIVE_MINT } from "@solana/spl-token";
import { PublicKeyField } from "../serialization/PublicKeyField";
import { Field } from "../serialization/Field";

export class MintId extends Id {
  private constructor(key: PublicKey) {
    super(key);
  }

  public static native(): MintId {
    return MintId.of(NATIVE_MINT);
  }

  public static fromBase58(base58: string): MintId {
    return MintId.of(new PublicKey(base58));
  }

  public static of(key: PublicKey): MintId {
    return new MintId(key);
  }

  public static field(property: string): Field<MintId> {
    return new MintIdField(property);
  }

  public isNative(): boolean {
    return this.equals(NATIVE_MINT);
  }
}

class MintIdField extends PublicKeyField<MintId> {
  public constructor(property: string) {
    super(property);
  }

  protected fromPublicKey(pubKey: PublicKey): MintId {
    return MintId.of(pubKey);
  }
}
