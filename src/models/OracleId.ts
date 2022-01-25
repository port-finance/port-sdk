import { PublicKey } from "@solana/web3.js";

import { Id } from "./basic";

export class OracleId extends Id {
  static fromBase58(base58: string): OracleId {
    return new OracleId(new PublicKey(base58));
  }
}
