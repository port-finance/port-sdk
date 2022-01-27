import { PublicKey } from "@solana/web3.js";

import { Id } from "../basic";
import { PublicKeyField } from "../../serialization/PublicKeyField";
import { Field } from "../../serialization/Field";

export class StakingPoolId extends Id {
  private constructor(key: PublicKey) {
    super(key);
  }

  public static fromBase58(base58: string): StakingPoolId {
    return StakingPoolId.of(new PublicKey(base58));
  }

  public static of(key: PublicKey): StakingPoolId {
    return new StakingPoolId(key);
  }

  public static field(property: string): Field<StakingPoolId> {
    return new StakingPoolIdField(property);
  }
}

class StakingPoolIdField extends PublicKeyField<StakingPoolId> {
  public constructor(property: string) {
    super(property);
  }

  protected fromPublicKey(pubKey: PublicKey): StakingPoolId {
    return StakingPoolId.of(pubKey);
  }
}
