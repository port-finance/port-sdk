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

// Deposit collateral to an obligation. Requires a refreshed reserve.
//
// Accounts expected by this instruction:
//
//   0. `[writable]` Source collateral token account.
//                     Minted by deposit reserve collateral mint.
//                     $authority can transfer $collateral_amount.
//   1. `[writable]` Destination deposit reserve collateral supply SPL Token account.
//   2. `[]` Deposit reserve account - refreshed.
//   3. `[writable]` Obligation account.
//   4. `[]` Lending market account.
//   5. `[]` Derived lending market authority.
//   6. `[signer]` Obligation owner.
//   7. `[signer]` User transfer authority ($authority).
//   8. `[]` Clock sysvar.
//   9. `[]` Token program id.
export const depositObligationCollateralInstruction = (
  collateralAmount: number | BN,
  srcCollateralPubkey: PublicKey, // 0
  dstCollateralPubkey: PublicKey, // 1
  depositReservePubkey: PublicKey, // 2
  obligationPubkey: PublicKey, // 3
  lendingMarketPubkey: PublicKey, // 4
  marketAuthorityPubkey: PublicKey, // 5
  obligationOwnerPubkey: PublicKey, // 6
  transferAuthorityPubkey: PublicKey, // 7
  lendingProgramId: PublicKey = PORT_LENDING,
  stakeAccountPubkey?: PublicKey, // 8
  stakingPoolPubkey?: PublicKey // 9
): TransactionInstruction => {
  const dataLayout = BufferLayout.struct([
    BufferLayout.u8("instruction"),
    Layout.uint64("collateralAmount"),
  ]);
  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: LendingInstruction.DepositObligationCollateral,
      collateralAmount: new BN(collateralAmount),
    },
    data
  );

  const keys = [
    getAccess(srcCollateralPubkey, AccessType.WRITE),
    getAccess(dstCollateralPubkey, AccessType.WRITE),
    getAccess(depositReservePubkey, AccessType.READ),
    getAccess(obligationPubkey, AccessType.WRITE),
    getAccess(lendingMarketPubkey, AccessType.READ),
    getAccess(marketAuthorityPubkey, AccessType.READ),
    getAccess(obligationOwnerPubkey, AccessType.SIGNER),
    getAccess(transferAuthorityPubkey, AccessType.SIGNER),
    getAccess(SYSVAR_CLOCK_PUBKEY, AccessType.READ),
    getAccess(TOKEN_PROGRAM_ID, AccessType.READ),
  ];

  if (stakeAccountPubkey && stakingPoolPubkey) {
    keys.push(
      getAccess(stakeAccountPubkey, AccessType.WRITE),
      getAccess(stakingPoolPubkey, AccessType.WRITE),
      getAccess(PORT_STAKING, AccessType.READ)
    );
  }

  return new TransactionInstruction({
    keys,
    programId: lendingProgramId,
    data,
  });
};
