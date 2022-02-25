import {
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  TransactionInstruction,
} from "@solana/web3.js";
import BN from "bn.js";
import * as BufferLayout from "@solana/buffer-layout";
import * as Layout from "../../serialization/layout";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { LendingInstruction } from "./instruction";
import { PORT_LENDING } from "../../constants";
import { AccessType, getAccess } from "../../utils/Instructions";

// Redeem collateral from a reserve in exchange for liquidity.
//
// Accounts expected by this instruction:
//
//   0. `[writable]` Source collateral token account.
//                     $authority can transfer $collateral_amount.
//   1. `[writable]` Destination liquidity token account.
//   2. `[writable]` Reserve account.
//   3. `[writable]` Reserve collateral SPL Token mint.
//   4. `[writable]` Reserve liquidity supply SPL Token account.
//   5. `[]` Lending market account.
//   6. `[]` Derived lending market authority.
//   7. `[signer]` User transfer authority ($authority).
//   8. `[]` Clock sysvar.
//   9. `[]` Token program id.
export const redeemReserveCollateralInstruction = (
  collateralAmount: number | BN,
  sourceCollateral: PublicKey,
  destinationLiquidity: PublicKey,
  reserve: PublicKey,
  reserveCollateralMint: PublicKey,
  reserveLiquiditySupply: PublicKey,
  lendingMarket: PublicKey,
  lendingMarketAuthority: PublicKey,
  transferAuthority: PublicKey,
  lendingProgramId: PublicKey = PORT_LENDING
): TransactionInstruction => {
  const dataLayout = BufferLayout.struct([
    BufferLayout.u8("instruction"),
    Layout.uint64("collateralAmount"),
  ]);

  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: LendingInstruction.RedeemReserveCollateral,
      collateralAmount: new BN(collateralAmount),
    },
    data
  );

  const keys = [
    getAccess(sourceCollateral, AccessType.WRITE),
    getAccess(destinationLiquidity, AccessType.WRITE),
    getAccess(reserve, AccessType.WRITE),
    getAccess(reserveCollateralMint, AccessType.WRITE),
    getAccess(reserveLiquiditySupply, AccessType.WRITE),
    getAccess(lendingMarket, AccessType.READ),
    getAccess(lendingMarketAuthority, AccessType.READ),
    getAccess(transferAuthority, AccessType.SIGNER),
    getAccess(SYSVAR_CLOCK_PUBKEY, AccessType.READ),
    getAccess(TOKEN_PROGRAM_ID, AccessType.READ),
  ];

  return new TransactionInstruction({
    keys,
    programId: lendingProgramId,
    data,
  });
};
