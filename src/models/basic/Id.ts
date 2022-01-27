import { AccountMeta, PublicKey } from "@solana/web3.js";
import { AccessType, getAccess } from "../../utils/Instructions";

export abstract class Id extends PublicKey {
  public getAccess(type: AccessType): AccountMeta {
    return getAccess(this, type);
  }
}
