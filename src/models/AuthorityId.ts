import { PublicKey } from "@solana/web3.js";
import { Id } from "./Id";

export class AuthorityId extends Id {
  constructor(key: PublicKey) {
    super(key);
  }

  static fromBase58(base58: string): AuthorityId {
    return new AuthorityId(new PublicKey(base58));
  }
}
