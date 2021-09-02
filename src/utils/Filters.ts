import {GetProgramAccountsConfig} from "@solana/web3.js";
import {WalletId} from "../models/WalletId";
import { OBLIGATION_DATA_SIZE } from "../structs/PortBalanceData";

export function PortBalanceForWallet(walletId: WalletId): GetProgramAccountsConfig {
  return {
    filters: [
      {
        memcmp: {
          offset: 1 + 8 + 1 + 32,
          bytes: walletId.key.toBase58(),
        }
      },
      {
        dataSize: OBLIGATION_DATA_SIZE,
      }
    ]
  };
}