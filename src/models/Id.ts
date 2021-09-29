import { AccountMeta, PublicKey } from "@solana/web3.js";
import { AccessType, getAccess } from "../utils/Instructions";

export abstract class Id {
  readonly key: PublicKey;

  protected constructor(key: PublicKey) {
    this.key = key;
  }

  public getAccess(type: AccessType): AccountMeta {
    return getAccess(this.key, type);
  }

  public equals(that?: Id): boolean {
    return !!that && this.key.equals(that.key);
  }

  public toString(): string {
    return this.key.toBase58();
  }
}
