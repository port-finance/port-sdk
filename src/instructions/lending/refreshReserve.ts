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

// Accrue interest and update market price of liquidity on a reserve.
//
// Accounts expected by this instruction:
//
//   0. `[writable]` Reserve account.
//   1. `[]` Clock sysvar.
//   2. `[]` Reserve liquidity oracle account.
//             Must be the Pyth price account specified at InitReserve.
export const refreshReserveInstruction = (
  reserve: PublicKey,
  oracle: PublicKey | null,
  lendingProgramId: PublicKey = PORT_LENDING
): TransactionInstruction => {
  const data = Buffer.alloc(DataLayout.span);
  DataLayout.encode({ instruction: LendingInstruction.RefreshReserve }, data);

  const keys = [
    getAccess(reserve, AccessType.WRITE),
    getAccess(SYSVAR_CLOCK_PUBKEY, AccessType.READ),
  ];

  if (oracle) {
    keys.push(getAccess(oracle, AccessType.READ));
  }

  return new TransactionInstruction({
    keys,
    programId: lendingProgramId,
    data,
  });
};
