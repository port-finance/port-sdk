import { Buffer } from "buffer";
import { AccountInfo, PublicKey } from "@solana/web3.js";

export type RawData = {
  pubkey: PublicKey;
  account: AccountInfo<Buffer>;
};
