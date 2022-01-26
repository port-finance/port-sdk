import {
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import * as BufferLayout from "@solana/buffer-layout";
import { LendingInstruction } from "./instruction";
import { AccessType, getAccess } from "../../utils/Instructions";
import { ReserveConfig, ReserveConfigLayout } from "../../structs/ReserveData";
import { PORT_LENDING } from "../../constants";

// Update configuration for an existing market reserve.
//
// Accounts expected by this instruction:
//
//   0. `[writable]` Reserve account
//   1. `[]` Lending market account.
//   2. `[]` Derived lending market authority.
//   3. `[signer]` Lending market owner.
//   4. `[]` Rent sysvar.
//   5. `[]` Token program id.
export const updateReserveInstruction = (
  config: ReserveConfig,
  reservePubkey: PublicKey, // 0
  lendingMarketPubkey: PublicKey, // 1
  lendingMarketAuthorityPubkey: PublicKey, // 2
  lendingMarketOwnerPubkey: PublicKey, // 3
  lendingProgramId: PublicKey = PORT_LENDING
): TransactionInstruction => {
  const dataLayout = BufferLayout.struct([
    BufferLayout.u8("instruction"),
    // eslint-disable-next-line new-cap
    ReserveConfigLayout("config"),
  ]);
  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: LendingInstruction.UpdateReserve,
      config,
    },
    data
  );
  const keys = [
    getAccess(reservePubkey, AccessType.WRITE),
    getAccess(lendingMarketPubkey, AccessType.READ),
    getAccess(lendingMarketAuthorityPubkey, AccessType.READ),
    getAccess(lendingMarketOwnerPubkey, AccessType.SIGNER),
    getAccess(SYSVAR_RENT_PUBKEY, AccessType.READ),
    getAccess(TOKEN_PROGRAM_ID, AccessType.READ),
  ];

  return new TransactionInstruction({
    keys,
    programId: lendingProgramId,
    data,
  });
};
