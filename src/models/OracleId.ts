import {PublicKey} from "@solana/web3.js";

import {Id} from "./Id";

export class OracleId extends Id {

  constructor(key: PublicKey) {
    super(key);
  }

  static fromBase58(base58: string): OracleId {
    return new OracleId(new PublicKey(base58));
  }
}
