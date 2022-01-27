import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from "@solana/web3.js";
import { Buffer } from "buffer";
import * as BufferLayout from "@solana/buffer-layout";
import { PORT_LENDING } from "../../constants";
import { AccessType, getAccess } from "../../utils/Instructions";
import * as Layout from "../../serialization/layout";
import { LendingInstruction } from "./instruction";

// interface Data {
//   instruction: number;
//   owner: PublicKey;
//   quoteCurrency: Buffer;
// }

const DataLayout = BufferLayout.struct([
  BufferLayout.u8("instruction"),
  Layout.publicKey("owner"),
  BufferLayout.blob(32, "quoteCurrency"),
]);

// Initializes a new lending market.
//
// Accounts expected by this instruction:
//
//   0. `[writable]` Lending market account - uninitialized.
//   1. `[]` Rent sysvar.
//   2. `[]` Token program id.
export const initLendingMarketInstruction = (
  owner: PublicKey,
  quoteCurrency: Buffer,
  lendingMarket: PublicKey,
  lendingProgramId: PublicKey = PORT_LENDING
): TransactionInstruction => {
  const data = Buffer.alloc(DataLayout.span);
  DataLayout.encode(
    {
      instruction: LendingInstruction.InitLendingMarket,
      owner,
      quoteCurrency,
    },
    data
  );

  const keys = [
    getAccess(lendingMarket, AccessType.WRITE),
    getAccess(SYSVAR_RENT_PUBKEY, AccessType.READ),
    getAccess(TOKEN_PROGRAM_ID, AccessType.READ),
  ];

  return new TransactionInstruction({
    keys,
    programId: lendingProgramId,
    data,
  });
};
