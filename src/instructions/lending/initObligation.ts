import {
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import * as BufferLayout from "@solana/buffer-layout";

import { LendingInstruction } from "./instruction";
import { AccessType, getAccess } from "../../utils/Instructions";
import { PORT_LENDING } from "../../constants";

// Initializes a new lending market obligation.
//
// Accounts expected by this instruction:
//
//   0. `[writable]` Obligation account - uninitialized.
//   1. `[]` Lending market account.
//   2. `[signer]` Obligation owner.
//   3. `[]` Clock sysvar.
//   4. `[]` Rent sysvar.
//   5. `[]` Token program id.
export function initObligationInstruction(
  obligationPubkey: PublicKey, // 0
  lendingMarketPubkey: PublicKey, // 1
  obligationOwnerPubkey: PublicKey, // 2
  lendingProgramId: PublicKey = PORT_LENDING
): TransactionInstruction {
  const dataLayout = BufferLayout.struct([BufferLayout.u8("instruction")]);
  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode({ instruction: LendingInstruction.InitObligation }, data);

  const keys = [
    getAccess(obligationPubkey, AccessType.WRITE),
    getAccess(lendingMarketPubkey, AccessType.READ),
    getAccess(obligationOwnerPubkey, AccessType.SIGNER),
    getAccess(SYSVAR_CLOCK_PUBKEY, AccessType.READ),
    getAccess(SYSVAR_RENT_PUBKEY, AccessType.READ),
    getAccess(TOKEN_PROGRAM_ID, AccessType.READ),
  ];

  return new TransactionInstruction({
    keys,
    programId: lendingProgramId,
    data,
  });
}
