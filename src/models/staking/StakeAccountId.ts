import { PublicKey } from "@solana/web3.js";

import { Id } from "../basic";
import { PublicKeyField } from "../../serialization/PublicKeyField";
import { Field } from "../../serialization/Field";

export class StakeAccountId extends Id {
  private constructor(key: PublicKey) {
    super(key);
  }

  public static fromBase58(base58: string): StakeAccountId {
    return StakeAccountId.of(new PublicKey(base58));
  }

  public static of(key: PublicKey): StakeAccountId {
    return new StakeAccountId(key);
  }

  public static field(property: string): Field<StakeAccountId> {
    return new StakeAccountIdField(property);
  }
}

class StakeAccountIdField extends PublicKeyField<StakeAccountId> {
  public constructor(property: string) {
    super(property);
  }

  protected fromPublicKey(pubKey: PublicKey): StakeAccountId {
    return StakeAccountId.of(pubKey);
  }
}
