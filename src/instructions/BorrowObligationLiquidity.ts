import { PublicKey, SYSVAR_CLOCK_PUBKEY, TransactionInstruction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import * as BufferLayout from 'buffer-layout';
import * as Layout from '../utils/layout'
import { AccessType } from '../utils/Instructions';
import { Lamport } from '../models/Lamport';
import { getAccess } from '../utils/Instructions';
import { LendingInstruction } from './instruction';

/// Borrow liquidity from a reserve by depositing collateral tokens. Requires a refreshed
/// obligation and reserve.
///
/// Accounts expected by this instruction:
///
///   0. `[writable]` Source borrow reserve liquidity supply SPL Token account.
///   1. `[writable]` Destination liquidity token account.
///                     Minted by borrow reserve liquidity mint.
///   2. `[writable]` Borrow reserve account - refreshed.
///   3. `[writable]` Borrow reserve liquidity fee receiver account.
///                     Must be the fee account specified at InitReserve.
///   4. `[writable]` Obligation account - refreshed.
///   5. `[]` Lending market account.
///   6. `[]` Derived lending market authority.
///   7. `[signer]` Obligation owner.
///   8. `[]` Clock sysvar.
///   9. `[]` Token program id.
export const BorrowObligationLiquidity = (
  transaction: Transaction,
  liquidityAmount: Lamport,
  srcLiquidityPubkey: PublicKey, // 0
  dstLiquidityPubkey: PublicKey, // 1
  borrowReservePubkey: PublicKey, // 2
  borrowReserveFeeReceiverPubkey: PublicKey, // 3
  obligationPubkey, // 4, TODO: need some abstraction?
  lendingMarketPubkey, // 5
  marketAuthorityPubkey: PublicKey, // 6
): TransactionInstruction => {
  const dataLayout = BufferLayout.struct([
    BufferLayout.u8('instruction'),
    Layout.uint64('liquidityAmount'),
  ]);
  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: LendingInstruction.BorrowObligationLiquidity,
      liquidityAmount: liquidityAmount.toU64(),
    },
    data,
  );

  const keys = [
    getAccess(srcLiquidityPubkey, AccessType.WRITE),
    getAccess(dstLiquidityPubkey, AccessType.WRITE),
    getAccess(borrowReservePubkey, AccessType.WRITE),
    getAccess(borrowReserveFeeReceiverPubkey, AccessType.WRITE),
    getAccess(obligationPubkey, AccessType.WRITE),
    getAccess(lendingMarketPubkey, AccessType.READ),
    getAccess(marketAuthorityPubkey, AccessType.READ),
    transaction.getWalletId().getAccess(AccessType.SIGNER),
    getAccess(SYSVAR_CLOCK_PUBKEY, AccessType.READ),
    getAccess(TOKEN_PROGRAM_ID, AccessType.READ)
  ];

  return new TransactionInstruction({
    keys,
    programId: transaction.getLendingProgramId(),
    data,
  });
};
