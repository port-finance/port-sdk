import {
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  TransactionInstruction,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import * as BufferLayout from "@solana/buffer-layout";
import * as Layout from "../../serialization/layout";
import { LendingInstruction } from "./instruction";
import { AccessType, getAccess } from "../../utils/Instructions";
import BN from "bn.js";
import { PORT_LENDING, PORT_STAKING } from "../../constants";

// Withdraw collateral from an obligation. Requires a refreshed obligation and reserve.
//
// Accounts expected by this instruction:
//
//   0. `[writable]` Source withdraw reserve collateral supply SPL Token account.
//   1. `[writable]` Destination collateral token account.
//                     Minted by withdraw reserve collateral mint.
//   2. `[]` Withdraw reserve account - refreshed.
//   3. `[writable]` Obligation account - refreshed.
//   4. `[]` Lending market account.
//   5. `[]` Derived lending market authority.
//   6. `[signer]` Obligation owner.
//   7. `[]` Clock sysvar.
//   8. `[]` Token program id.
//   9. `[writable, optional]` Stake account.
//   10 `[writable, optional]` Staking pool.
//   11 `[optional]` staking program id.

export const withdrawObligationCollateralInstruction = (
  collateralAmount: number | BN,
  srcCollateralPubkey: PublicKey, // 0
  dstCollateralPubkey: PublicKey, // 1
  withdrawReservePubkey: PublicKey, // 2
  obligationPubkey: PublicKey, // 3
  lendingMarketPubkey: PublicKey, // 4
  lendingMarketAuthorityPubkey: PublicKey, // 5
  obligationOwnerPubkey: PublicKey, // 6
  lendingProgramId: PublicKey = PORT_LENDING,
  optStakeAccountPubkey?: PublicKey, // 9
  optStakingPoolPubkey?: PublicKey // 10
): TransactionInstruction => {
  const dataLayout = BufferLayout.struct([
    BufferLayout.u8("instruction"),
    Layout.uint64("collateralAmount"),
  ]);
  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: LendingInstruction.WithdrawObligationCollateral,
      collateralAmount: new BN(collateralAmount),
    },
    data
  );

  const keys = [
    getAccess(srcCollateralPubkey, AccessType.WRITE),
    getAccess(dstCollateralPubkey, AccessType.WRITE),
    getAccess(withdrawReservePubkey, AccessType.READ),
    getAccess(obligationPubkey, AccessType.WRITE),
    getAccess(lendingMarketPubkey, AccessType.READ),
    getAccess(lendingMarketAuthorityPubkey, AccessType.READ),
    getAccess(obligationOwnerPubkey, AccessType.SIGNER),
    getAccess(SYSVAR_CLOCK_PUBKEY, AccessType.READ),
    getAccess(TOKEN_PROGRAM_ID, AccessType.READ),
  ];

  if (optStakeAccountPubkey && optStakingPoolPubkey) {
    keys.push(
      getAccess(optStakeAccountPubkey, AccessType.WRITE),
      getAccess(optStakingPoolPubkey, AccessType.WRITE),
      getAccess(PORT_STAKING, AccessType.READ)
    );
  }

  return new TransactionInstruction({
    keys,
    programId: lendingProgramId,
    data,
  });
};
