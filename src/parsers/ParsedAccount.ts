import { PublicKey } from "@solana/web3.js";

export type ParsedAccount<T> = {
  pubkey: PublicKey;
  data: T;
};
