import {
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import * as BufferLayout from 'buffer-layout';

import { LendingInstruction } from './instruction';
import { AccessType, getAccess } from '../utils/Instructions';

/// Initializes a new lending market obligation.
///
/// Accounts expected by this instruction:
///
///   0. `[writable]` Obligation account - uninitialized.
///   1. `[]` Lending market account.
///   2. `[signer]` Obligation owner.
///   3. `[]` Clock sysvar.
///   4. `[]` Rent sysvar.
///   5. `[]` Token program id.
export function initObligationInstruction (
  transaction: Transaction,
  obligationPubkey: PublicKey, // 0
  lendingMarketPubkey: PublicKey, // 1
): TransactionInstruction {
  const dataLayout = BufferLayout.struct([BufferLayout.u8('instruction')]);
  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    { instruction: LendingInstruction.InitObligation },
    data,
  );

  const keys = [
    getAccess(obligationPubkey, AccessType.WRITE),
    getAccess(lendingMarketPubkey, AccessType.READ),
    transaction.getWalletId().getAccess(AccessType.SIGNER),
    getAccess(SYSVAR_CLOCK_PUBKEY, AccessType.READ),
    getAccess(SYSVAR_RENT_PUBKEY, AccessType.READ),
    getAccess(TOKEN_PROGRAM_ID, AccessType.READ)
  ];

  return new TransactionInstruction({
    keys,
    programId: transaction.getLendingProgramId(),
    data,
  });
}
