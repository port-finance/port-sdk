import {
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  TransactionInstruction,
} from "@solana/web3.js";
import * as BufferLayout from "@solana/buffer-layout";
import { PORT_LENDING } from "../../constants";
import { AccessType, getAccess } from "../../utils/Instructions";
import { LendingInstruction } from "./instruction";

// interface Data {
//   instruction: number;
// }

const DataLayout = BufferLayout.struct([BufferLayout.u8("instruction")]);

// Refresh an obligation's accrued interest and collateral and liquidity prices. Requires
// refreshed reserves, as all obligation collateral deposit reserves in order, followed by all
// liquidity borrow reserves in order.
//
// Accounts expected by this instruction:
//
//   0. `[writable]` Obligation account.
//   1. `[]` Clock sysvar.
//   .. `[]` Collateral deposit reserve accounts - refreshed, all, in order.
//   .. `[]` Liquidity borrow reserve accounts - refreshed, all, in order.
export const refreshObligationInstruction = (
  obligation: PublicKey,
  depositReserves: PublicKey[],
  borrowReserves: PublicKey[],
  lendingProgramId: PublicKey = PORT_LENDING
): TransactionInstruction => {
  const data = Buffer.alloc(DataLayout.span);
  DataLayout.encode(
    { instruction: LendingInstruction.RefreshObligation },
    data
  );

  const keys = [
    getAccess(obligation, AccessType.WRITE),
    getAccess(SYSVAR_CLOCK_PUBKEY, AccessType.READ),
  ];

  for (const depositReserve of depositReserves) {
    keys.push(getAccess(depositReserve, AccessType.READ));
  }

  for (const borrowReserve of borrowReserves) {
    keys.push(getAccess(borrowReserve, AccessType.READ));
  }

  return new TransactionInstruction({
    keys,
    programId: lendingProgramId,
    data,
  });
};
