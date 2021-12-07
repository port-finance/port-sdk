import {TOKEN_PROGRAM_ID} from '@solana/spl-token';
import {
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import {PORT_LENDING} from 'src/constants';
import {ReserveConfig, ReserveConfigLayout} from 'src/structs/ReserveData';
import {LendingInstruction} from './instruction';
import * as BufferLayout from 'buffer-layout';
import * as Layout from 'src/utils/layout';
import BN from 'bn.js';

interface Data {
  instruction: number;
  liquidityAmount: bigint;
  option: number;
  marketPrice: BigNumber;
  config: ReserveConfig;
}

const DataLayout = BufferLayout.struct<Data>([
  BufferLayout.u8('instruction'),
  Layout.uint64('liquidityAmount'),
  BufferLayout.u32('option'),
  Layout.uint128('marketPrice'),
  ReserveConfigLayout,
]);

export const initReserveInstruction = (
    liquidityAmount: number | BN,
    option: number,
    price: BN,
    config: ReserveConfig,
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
): TransactionInstruction => {
  const data = Buffer.alloc(DataLayout.span);
  DataLayout.encode(
      {
        instruction: LendingInstruction.InitReserve,
        option,
        marketPrice: new BN(price),
        liquidityAmount: new BN(liquidityAmount),
        config,
      },
      data,
  );

  const keys = [
    {pubkey: sourceLiquidity, isSigner: false, isWritable: true},
    {pubkey: destinationCollateral, isSigner: false, isWritable: true},
    {pubkey: reserve, isSigner: false, isWritable: true},
    {pubkey: liquidityMint, isSigner: false, isWritable: false},
    {pubkey: liquiditySupply, isSigner: false, isWritable: true},
    {pubkey: liquidityFeeReceiver, isSigner: false, isWritable: true},
    {pubkey: collateralMint, isSigner: false, isWritable: true},
    {pubkey: collateralSupply, isSigner: false, isWritable: true},
    {pubkey: lendingMarket, isSigner: false, isWritable: true},
    {pubkey: lendingMarketAuthority, isSigner: false, isWritable: false},
    {pubkey: lendingMarketOwner, isSigner: true, isWritable: false},
    {pubkey: transferAuthority, isSigner: true, isWritable: false},
    {pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false},
    {pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false},
    {pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false},
  ];

  return new TransactionInstruction({
    keys,
    programId: PORT_LENDING,
    data,
  });
};
