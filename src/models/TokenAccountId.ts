import { PublicKey } from "@solana/web3.js";

import { Id } from "./basic";
import { WalletId } from "./WalletId";
import { PublicKeyField } from "../serialization/PublicKeyField";
import { Field } from "../serialization/Field";

export class TokenAccountId extends Id {
  private constructor(key: PublicKey) {
    super(key);
  }

  public static native(walletId: WalletId): TokenAccountId {
    return TokenAccountId.of(walletId);
  }

  public static of(pubKey: PublicKey): TokenAccountId {
    return new TokenAccountId(pubKey);
  }

  public static field(property: string): Field<TokenAccountId> {
    return new SplAccountIdField(property);
  }
}

class SplAccountIdField extends PublicKeyField<TokenAccountId> {
  public constructor(property: string) {
    super(property);
  }

  protected fromPublicKey(pubKey: PublicKey): TokenAccountId {
    return TokenAccountId.of(pubKey);
  }
}
