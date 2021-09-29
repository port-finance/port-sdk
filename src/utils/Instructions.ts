import { AccountMeta, PublicKey } from "@solana/web3.js";

export enum AccessType {
  UNKNOWN = 0,
  READ = 1,
  WRITE = 2,
  SIGNER = 3,
}

export function getAccess(key: PublicKey, type: AccessType): AccountMeta {
  switch (type) {
    case AccessType.READ:
      return { pubkey: key, isSigner: false, isWritable: false };
    case AccessType.WRITE:
      return { pubkey: key, isSigner: false, isWritable: true };
    case AccessType.SIGNER:
      return { pubkey: key, isSigner: true, isWritable: false };
    default:
      throw new Error(`Unknown access type ${type}`);
  }
}
