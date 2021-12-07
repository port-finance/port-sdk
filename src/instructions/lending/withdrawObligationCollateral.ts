import { PublicKey, SYSVAR_CLOCK_PUBKEY, TransactionInstruction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import * as BufferLayout from 'buffer-layout';
import * as Layout from 'src/utils/layout'
import { LendingInstruction } from './instruction';
import { Lamport } from 'src/models/Lamport';
import { AccessType, getAccess } from 'src/utils/Instructions';

/// Withdraw collateral from an obligation. Requires a refreshed obligation and reserve.
///
/// Accounts expected by this instruction:
///
///   0. `[writable]` Source withdraw reserve collateral supply SPL Token account.
///   1. `[writable]` Destination collateral token account.
///                     Minted by withdraw reserve collateral mint.
///   2. `[]` Withdraw reserve account - refreshed.
///   3. `[writable]` Obligation account - refreshed.
///   4. `[]` Lending market account.
///   5. `[]` Derived lending market authority.
///   6. `[signer]` Obligation owner.
///   7. `[]` Clock sysvar.
///   8. `[]` Token program id.
///   9. `[writable, optional]` Stake account.
///   10 `[writable, optional]` Staking pool.
///   11 `[optional]` staking program id.

export const withdrawObligationCollateralInstruction = (
  transaction: Transaction,
  collateralAmount: Lamport,
  srcCollateralPubkey: PublicKey, // 0
  dstCollateralPubkey: PublicKey, // 1
  withdrawReservePubkey: PublicKey, // 2
  obligationPubkey: PublicKey, // 3
  lendingMarketPubkey: PublicKey, // 4
  lendingMarketAuthorityPubkey: PublicKey, // 5
  optStakeAccountPubkey?: PublicKey, // 9
  optStakingPoolPubkey?: PublicKey, // 10
): TransactionInstruction => {
  const dataLayout = BufferLayout.struct([
    BufferLayout.u8('instruction'),
    Layout.uint64('collateralAmount'),
  ]);
  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: LendingInstruction.WithdrawObligationCollateral,
      collateralAmount: collateralAmount.toU64(),
    },
    data,
  );

  const keys = [
    getAccess(srcCollateralPubkey, AccessType.WRITE),
    getAccess(dstCollateralPubkey, AccessType.WRITE),
    getAccess(withdrawReservePubkey, AccessType.READ),
    getAccess(obligationPubkey, AccessType.WRITE),
    getAccess(lendingMarketPubkey, AccessType.READ),
    getAccess(lendingMarketAuthorityPubkey, AccessType.READ),
    transaction.getWalletId().getAccess(AccessType.SIGNER),
    getAccess(SYSVAR_CLOCK_PUBKEY, AccessType.READ),
    getAccess(TOKEN_PROGRAM_ID, AccessType.READ)
  ];

  const stakingProgramId = transaction.getStakingProgramId();
  if (optStakeAccountPubkey && optStakingPoolPubkey && stakingProgramId) {
    keys.push(
      getAccess(optStakeAccountPubkey, AccessType.WRITE),
      getAccess(optStakingPoolPubkey, AccessType.WRITE),
      stakingProgramId.getAccess(AccessType.READ),
    );
  }

  return new TransactionInstruction({
    keys,
    programId: transaction.getLendingProgramId(),
    data,
  });
};
