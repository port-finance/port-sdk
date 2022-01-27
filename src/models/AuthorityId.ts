import { PublicKey } from "@solana/web3.js";
import { Id } from "./basic";
import { PublicKeyField } from "../serialization/PublicKeyField";
import { Field } from "../serialization/Field";

export class AuthorityId extends Id {
  private constructor(pubKey: PublicKey) {
    super(pubKey);
  }

  public static fromBase58(base58: string): AuthorityId {
    return AuthorityId.of(new PublicKey(base58));
  }

  public static of(pubKey: PublicKey): AuthorityId {
    return new AuthorityId(pubKey);
  }

  public static field(property: string): Field<AuthorityId> {
    return new AuthorityIdField(property);
  }
}

class AuthorityIdField extends PublicKeyField<AuthorityId> {
  public constructor(property: string) {
    super(property);
  }

  protected fromPublicKey(pubKey: PublicKey): AuthorityId {
    return AuthorityId.of(pubKey);
  }
}
