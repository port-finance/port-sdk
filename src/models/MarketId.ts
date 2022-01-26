import { PublicKey } from "@solana/web3.js";

import { Id } from "./basic";
import { PublicKeyField } from "../serialization/PublicKeyField";
import { Field } from "../serialization/Field";
import { MARKET_MAP } from "../constants";

export class MarketId extends Id {
  private constructor(key: PublicKey) {
    super(key);
  }

  public static fromBase58(base58: string): MarketId {
    return MarketId.of(new PublicKey(base58));
  }

  public static of(key: PublicKey): MarketId {
    return new MarketId(key);
  }

  public static field(property: string): Field<MarketId> {
    return new MarketIdField(property);
  }

  public getName(): string {
    return MARKET_MAP[this.toBase58()] ?? "unknown";
  }
}

class MarketIdField extends PublicKeyField<MarketId> {
  public constructor(property: string) {
    super(property);
  }

  protected fromPublicKey(pubKey: PublicKey): MarketId {
    return MarketId.of(pubKey);
  }
}
