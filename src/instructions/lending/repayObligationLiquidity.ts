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
import { PORT_LENDING } from "../../constants";

// Repay borrowed liquidity to a reserve. Requires a refreshed obligation and reserve.
//
// Accounts expected by this instruction:
//
//   0. `[writable]` Source liquidity token account.
//                     Minted by repay reserve liquidity mint.
//                     $authority can transfer $liquidity_amount.
//   1. `[writable]` Destination repay reserve liquidity supply SPL Token account.
//   2. `[writable]` Repay reserve account - refreshed.
//   3. `[writable]` Obligation account - refreshed.
//   4. `[]` Lending market account.
//   5. `[signer]` User transfer authority ($authority).
//   6. `[]` Clock sysvar.
//   7. `[]` Token program id.
export function repayObligationLiquidityInstruction(
  liquidityAmount: number | BN,
  srcLiquidityPubkey: PublicKey, // 0
  dstLiquiditySupplyPubkey: PublicKey, // 1
  repayReservePubkey: PublicKey, // 2
  obligationPubkey: PublicKey, // 3
  lendingMarketPubkey: PublicKey, // 4
  transferAuthorityPubkey: PublicKey, // 5
  lendingProgramId: PublicKey = PORT_LENDING
): TransactionInstruction {
  const dataLayout = BufferLayout.struct([
    BufferLayout.u8("instruction"),
    Layout.uint64("liquidityAmount"),
  ]);
  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: LendingInstruction.RepayObligationLiquidity,
      liquidityAmount: new BN(liquidityAmount),
    },
    data
  );

  const keys = [
    getAccess(srcLiquidityPubkey, AccessType.WRITE),
    getAccess(dstLiquiditySupplyPubkey, AccessType.WRITE),
    getAccess(repayReservePubkey, AccessType.WRITE),
    getAccess(obligationPubkey, AccessType.WRITE),
    getAccess(lendingMarketPubkey, AccessType.READ),
    getAccess(transferAuthorityPubkey, AccessType.SIGNER),
    getAccess(SYSVAR_CLOCK_PUBKEY, AccessType.READ),
    getAccess(TOKEN_PROGRAM_ID, AccessType.READ),
  ];

  return new TransactionInstruction({
    keys,
    programId: lendingProgramId,
    data,
  });
}
