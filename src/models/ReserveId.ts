import {PublicKey} from "@solana/web3.js";

import {Id} from "./Id";

export class ReserveId extends Id {

  constructor(key: PublicKey) {
    super(key);
  }

  static fromBase58(base58: string): ReserveId {
    return new ReserveId(new PublicKey(base58));
  }
}
