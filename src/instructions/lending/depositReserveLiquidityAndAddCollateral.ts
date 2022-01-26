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

// Combines DepositReserveLiquidity and DepositObligationCollateral
//
// Accounts expected by this instruction:
//
//   0. `[writable]` Source liquidity token account.
//                     $authority can transfer $liquidity_amount.
//   1. `[writable]` Destination collateral token account.
//   2. `[writable]` Reserve account.
//   3. `[writable]` Reserve liquidity supply SPL Token account.
//   4. `[writable]` Reserve collateral SPL Token mint.
//   5. `[]` Lending market account.
//   6. `[]` Derived lending market authority.
//   7. `[writable]` Destination deposit reserve collateral supply SPL Token account.
//   8. `[writable]` Obligation account.
//   9. `[signer]` Obligation owner.
//   10 `[signer]` User transfer authority ($authority).
//   11 `[]` Clock sysvar.
//   12 `[]` Token program id.
//   13 `[writable, optional]` Stake account.
//   14 `[writable, optional]` Staking pool.
//   15 `[optional]` staking program id.
export const depositReserveLiquidityAndAddCollateralInstruction = (
  liquidityAmount: number | BN,
  srcLiquidityPubkey: PublicKey, // 0
  dstCollateralPubkey: PublicKey, // 1
  reservePubkey: PublicKey, // 2
  reserveLiquiditySupplyPubkey: PublicKey, // 3
  reserveCollateralMintPubkey: PublicKey, // 4
  lendingMarketPubkey: PublicKey, // 5
  lendingMarketAuthorityPubkey: PublicKey, // 6
  dstDepositCollateralPubkey: PublicKey, // 7
  obligationPubkey: PublicKey, // 8
  obligationOwnerPubkey: PublicKey, // 9
  transferAuthorityPubkey: PublicKey, // 10
  lendingProgramId: PublicKey = PORT_LENDING,
  optStakeAccountPubkey?: PublicKey, // 13
  optStakingPoolPubkey?: PublicKey, // 14
  stakingProgramId: PublicKey = PORT_STAKING
): TransactionInstruction => {
  const dataLayout = BufferLayout.struct([
    BufferLayout.u8("instruction"),
    Layout.uint64("liquidityAmount"),
  ]);
  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: LendingInstruction.DepositReserveLiquidityAndAddCollateral,
      liquidityAmount: new BN(liquidityAmount),
    },
    data
  );

  const keys = [
    getAccess(srcLiquidityPubkey, AccessType.WRITE),
    getAccess(dstCollateralPubkey, AccessType.WRITE),
    getAccess(reservePubkey, AccessType.WRITE),
    getAccess(reserveLiquiditySupplyPubkey, AccessType.WRITE),
    getAccess(reserveCollateralMintPubkey, AccessType.WRITE),
    getAccess(lendingMarketPubkey, AccessType.READ),
    getAccess(lendingMarketAuthorityPubkey, AccessType.READ),
    getAccess(dstDepositCollateralPubkey, AccessType.WRITE),
    getAccess(obligationPubkey, AccessType.WRITE),
    getAccess(obligationOwnerPubkey, AccessType.SIGNER),
    getAccess(transferAuthorityPubkey, AccessType.SIGNER),
    getAccess(SYSVAR_CLOCK_PUBKEY, AccessType.READ),
    getAccess(TOKEN_PROGRAM_ID, AccessType.READ),
  ];

  if (optStakeAccountPubkey && optStakingPoolPubkey) {
    keys.push(
      getAccess(optStakeAccountPubkey, AccessType.WRITE),
      getAccess(optStakingPoolPubkey, AccessType.WRITE),
      getAccess(stakingProgramId, AccessType.READ)
    );
  }

  return new TransactionInstruction({
    keys,
    programId: lendingProgramId,
    data,
  });
};
