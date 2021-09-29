import { PublicKey } from "@solana/web3.js";
import { Id } from "./Id";

export class PortId extends Id {
  constructor(key: PublicKey) {
    super(key);
  }

  static fromBase58(base58: string): PortId {
    return new PortId(new PublicKey(base58));
  }
}
