import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from "@solana/web3.js";
import { PORT_LENDING } from "../../constants";
import {
  ReserveConfigProtoLayout,
  ReserveConfigProto,
} from "../../structs/ReserveData";
import { LendingInstruction } from "./instruction";
import * as BufferLayout from "@solana/buffer-layout";
import * as Layout from "../../serialization/layout";
import BN from "bn.js";
import { AccessType, getAccess } from "../../utils/Instructions";

// interface Data {
//   instruction: number;
//   liquidityAmount: bigint;
//   option: number;
//   marketPrice: BN;
//   config: ReserveConfigProto;
// }

// Initializes a new lending market reserve.
//
// Accounts expected by this instruction:
//
//   0. `[writable]` Source liquidity token account.
//                     $authority can transfer $liquidity_amount.
//   1. `[writable]` Destination collateral token account - uninitialized.
//   2. `[writable]` Reserve account - uninitialized.
//   3. `[]` Reserve liquidity SPL Token mint.
//   4. `[writable]` Reserve liquidity supply SPL Token account - uninitialized.
//   5. `[writable]` Reserve liquidity fee receiver - uninitialized.
//   6. `[writable]` Reserve collateral SPL Token mint - uninitialized.
//   7. `[writable]` Reserve collateral token supply - uninitialized.
//   8 `[]` Lending market account.
//   9 `[]` Derived lending market authority.
//   10 `[signer]` Lending market owner.
//   11 `[signer]` User transfer authority ($authority).
//   12 `[]` Clock sysvar.
//   13 `[]` Rent sysvar.
//   14 `[]` Token program id.
//   15 `[optional]` Oracle price account, pyth or switchboard.
//           This will be used as the reserve liquidity oracle account.
export const initReserveInstruction = (
  liquidityAmount: number | BN,
  option: number,
  price: BN,
  config: ReserveConfigProto,
  sourceLiquidity: PublicKey,
  destinationCollateral: PublicKey,
  reserve: PublicKey,
  liquidityMint: PublicKey,
  liquiditySupply: PublicKey,
  liquidityFeeReceiver: PublicKey,
  pythPrice: PublicKey,
  collateralMint: PublicKey,
  collateralSupply: PublicKey,
  lendingMarket: PublicKey,
  lendingMarketAuthority: PublicKey,
  lendingMarketOwner: PublicKey,
  transferAuthority: PublicKey,
  lendingProgramId: PublicKey = PORT_LENDING
): TransactionInstruction => {
  const dataLayout = BufferLayout.struct([
    BufferLayout.u8("instruction"),
    Layout.uint64("liquidityAmount"),
    BufferLayout.u32("option"),
    Layout.uint128("marketPrice"),
    // eslint-disable-next-line new-cap
    ReserveConfigProtoLayout("config"),
  ]);
  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: LendingInstruction.InitReserve,
      option,
      marketPrice: new BN(price),
      liquidityAmount: new BN(liquidityAmount),
      config: { ...config },
    },
    data
  );

  const keys = [
    getAccess(sourceLiquidity, AccessType.WRITE),
    getAccess(destinationCollateral, AccessType.WRITE),
    getAccess(reserve, AccessType.WRITE),
    getAccess(liquidityMint, AccessType.READ),
    getAccess(liquiditySupply, AccessType.WRITE),
    getAccess(liquidityFeeReceiver, AccessType.WRITE),
    getAccess(collateralMint, AccessType.WRITE),
    getAccess(collateralSupply, AccessType.WRITE),
    getAccess(lendingMarket, AccessType.READ),
    getAccess(lendingMarketAuthority, AccessType.READ),
    getAccess(lendingMarketOwner, AccessType.SIGNER),
    getAccess(transferAuthority, AccessType.SIGNER),
    getAccess(SYSVAR_CLOCK_PUBKEY, AccessType.READ),
    getAccess(SYSVAR_RENT_PUBKEY, AccessType.READ),
    getAccess(TOKEN_PROGRAM_ID, AccessType.READ),
  ];
  if (pythPrice && option === 0) {
    keys.push(getAccess(pythPrice, AccessType.READ));
  }

  return new TransactionInstruction({
    keys,
    programId: lendingProgramId,
    data,
  });
};
