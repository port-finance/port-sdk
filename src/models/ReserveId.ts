import { PublicKey } from "@solana/web3.js";

import { Id } from "./basic";
import { PublicKeyField } from "../serialization/PublicKeyField";
import { Field } from "../serialization/Field";

export class ReserveId extends Id {
  private constructor(key: PublicKey) {
    super(key);
  }

  public static fromBase58(base58: string): ReserveId {
    return ReserveId.of(new PublicKey(base58));
  }

  public static of(pubKey: PublicKey): ReserveId {
    return new ReserveId(pubKey);
  }

  public static field(property: string): Field<ReserveId> {
    return new ReserveIdField(property);
  }
}

class ReserveIdField extends PublicKeyField<ReserveId> {
  public constructor(property: string) {
    super(property);
  }

  protected fromPublicKey(pubKey: PublicKey): ReserveId {
    return ReserveId.of(pubKey);
  }
}
