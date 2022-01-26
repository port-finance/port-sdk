import { PublicKey } from "@solana/web3.js";

import { Id } from "./basic";
import { PublicKeyField } from "../serialization/PublicKeyField";
import { Field } from "../serialization/Field";

export class WalletId extends Id {
  private constructor(key: PublicKey) {
    super(key);
  }

  public static fromBase58(base58: string): WalletId {
    return WalletId.of(new PublicKey(base58));
  }

  public static of(key: PublicKey): WalletId {
    return new WalletId(key);
  }

  public static field(property: string): Field<WalletId> {
    return new WalletIdField(property);
  }
}

class WalletIdField extends PublicKeyField<WalletId> {
  public constructor(property: string) {
    super(property);
  }

  protected fromPublicKey(pubKey: PublicKey): WalletId {
    return WalletId.of(pubKey);
  }
}
