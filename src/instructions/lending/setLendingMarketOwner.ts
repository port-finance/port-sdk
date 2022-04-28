import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { Buffer } from "buffer";
import * as BufferLayout from "@solana/buffer-layout";
import { PORT_LENDING } from "../../constants";
import { AccessType, getAccess } from "../../utils/Instructions";
import * as Layout from "../../serialization/layout";
import { LendingInstruction } from "./instruction";

const DataLayout = BufferLayout.struct([
  BufferLayout.u8("instruction"),
  Layout.publicKey("newOwner"),
]);

// Update the owner of the lending Market.
//
// Accounts expected by this instruction:
//
//   0. `[writable]` Lending market account.
//   1. `[signer]` Previous owner.
export const setLendingMarketOwnerInstruction = (
  lendingMarket: PublicKey,
  lendingMarketOwner: PublicKey,
  newOwner: PublicKey,
  lendingProgramId: PublicKey = PORT_LENDING
): TransactionInstruction => {
  const data = Buffer.alloc(DataLayout.span);
  DataLayout.encode(
    {
      instruction: LendingInstruction.SetLendingMarketOwner,
      newOwner,
    },
    data
  );

  const keys = [
    getAccess(lendingMarket, AccessType.WRITE),
    getAccess(lendingMarketOwner, AccessType.READ),
  ];

  return new TransactionInstruction({
    keys,
    programId: lendingProgramId,
    data,
  });
};
