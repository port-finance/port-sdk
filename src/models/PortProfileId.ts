import { PublicKey } from "@solana/web3.js";
import { Id } from "./basic";
import { PublicKeyField } from "../serialization/PublicKeyField";
import { Field } from "../serialization/Field";

export class PortProfileId extends Id {
  private constructor(key: PublicKey) {
    super(key);
  }

  public static of(pubKey: PublicKey): PortProfileId {
    return new PortProfileId(pubKey);
  }

  public static fromBase58(base58: string): PortProfileId {
    return PortProfileId.of(new PublicKey(base58));
  }

  public static field(property: string): Field<PortProfileId> {
    return new PortProfileIdField(property);
  }
}

class PortProfileIdField extends PublicKeyField<PortProfileId> {
  public constructor(property: string) {
    super(property);
  }

  protected fromPublicKey(pubKey: PublicKey): PortProfileId {
    return PortProfileId.of(pubKey);
  }
}
