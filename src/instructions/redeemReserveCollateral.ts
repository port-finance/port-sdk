import {
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  TransactionInstruction,
} from '@solana/web3.js';
import BN from 'bn.js';
import * as BufferLayout from 'buffer-layout';
import * as Layout from '../utils/layout';
import {TOKEN_PROGRAM_ID} from '@solana/spl-token';
import {LendingInstruction} from './instruction';
import {PORT_LENDING} from '../constants';

// / Redeem collateral from a reserve in exchange for liquidity.
// /
// / Accounts expected by this instruction:
// /
// /   0. `[writable]` Source collateral token account.
// /                     $authority can transfer $collateral_amount.
// /   1. `[writable]` Destination liquidity token account.
// /   2. `[writable]` Reserve account.
// /   3. `[writable]` Reserve collateral SPL Token mint.
// /   4. `[writable]` Reserve liquidity supply SPL Token account.
// /   5. `[]` Lending market account.
// /   6. `[]` Derived lending market authority.
// /   7. `[signer]` User transfer authority ($authority).
// /   8. `[]` Clock sysvar.
// /   9. `[]` Token program id.
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
): TransactionInstruction => {
  const dataLayout = BufferLayout.struct([
    BufferLayout.u8('instruction'),
    Layout.uint64('collateralAmount'),
  ]);

  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
      {
        instruction: LendingInstruction.RedeemReserveCollateral,
        collateralAmount: new BN(collateralAmount),
      },
      data,
  );

  const keys = [
    {pubkey: sourceCollateral, isSigner: false, isWritable: true},
    {pubkey: destinationLiquidity, isSigner: false, isWritable: true},
    {pubkey: reserve, isSigner: false, isWritable: true},
    {pubkey: reserveCollateralMint, isSigner: false, isWritable: true},
    {pubkey: reserveLiquiditySupply, isSigner: false, isWritable: true},
    {pubkey: lendingMarket, isSigner: false, isWritable: false},
    {pubkey: lendingMarketAuthority, isSigner: false, isWritable: false},
    {pubkey: transferAuthority, isSigner: true, isWritable: false},
    {pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false},
    {pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false},
  ];

  return new TransactionInstruction({
    keys,
    programId: PORT_LENDING,
    data,
  });
};
