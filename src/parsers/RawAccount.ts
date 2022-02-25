import { Buffer } from "buffer";
import { AccountInfo, PublicKey } from "@solana/web3.js";

export type RawAccount = {
  pubkey: PublicKey;
  account: AccountInfo<Buffer>;
};
