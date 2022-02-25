import { PublicKey } from "@solana/web3.js";

import { Id } from "./basic";

export class ProgramId extends Id {
  private constructor(key: PublicKey) {
    super(key);
  }

  public static fromBase58(base58: string): ProgramId {
    return ProgramId.of(new PublicKey(base58));
  }

  public static of(key: PublicKey): ProgramId {
    return new ProgramId(key);
  }
}
