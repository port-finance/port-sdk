import {
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import * as BufferLayout from "@solana/buffer-layout";
import { LendingInstruction } from "./instruction";
import { AccessType, getAccess } from "../../utils/Instructions";
import { PORT_LENDING } from "../../constants";

// Withdraw fee from a reserve.
// Accounts expected by this instruction:
//
//   0. `[]` Reserve account
//   1. `[]` Lending market account.
//   2. `[]` Derived lending market authority.
//   3. `[signer]` Lending market owner.
//   4. `[writable]` Reserve fee account
//   5. `[writable]` Destination fee account
//   6. `[]` Rent sysvar.
//   7. `[]` Token program id.
export const withdrawFeeInstruction = (
  reservePubkey: PublicKey, // 0
  lendingMarketPubkey: PublicKey, // 1
  lendingMarketAuthorityPubkey: PublicKey, // 2
  lendingMarketOwnerPubkey: PublicKey, // 3
  reserveFeePubkey: PublicKey, // 4
  dstFeePubkey: PublicKey, // 5
  lendingProgramId: PublicKey = PORT_LENDING
): TransactionInstruction => {
  const dataLayout = BufferLayout.struct([BufferLayout.u8("instruction")]);
  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: LendingInstruction.WithdrawFee,
    },
    data
  );
  const keys = [
    getAccess(reservePubkey, AccessType.WRITE),
    getAccess(lendingMarketPubkey, AccessType.READ),
    getAccess(lendingMarketAuthorityPubkey, AccessType.READ),
    getAccess(lendingMarketOwnerPubkey, AccessType.SIGNER),
    getAccess(reserveFeePubkey, AccessType.WRITE),
    getAccess(dstFeePubkey, AccessType.WRITE),
    getAccess(SYSVAR_RENT_PUBKEY, AccessType.READ),
    getAccess(TOKEN_PROGRAM_ID, AccessType.READ),
  ];

  return new TransactionInstruction({
    keys,
    programId: lendingProgramId,
    data,
  });
};
