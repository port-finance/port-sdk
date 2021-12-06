import {TOKEN_PROGRAM_ID} from '@solana/spl-token';
import {
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from '@solana/web3.js';
import * as BufferLayout from 'buffer-layout';
import {PORT_LENDING} from '../constants';
import * as Layout from '../utils/layout';
import {LendingInstruction} from './instruction';

interface Data {
  instruction: number;
  owner: PublicKey;
  quoteCurrency: Buffer;
}

const DataLayout = BufferLayout.struct<Data>([
  BufferLayout.u8('instruction'),
  Layout.publicKey('owner'),
  BufferLayout.blob(32, 'quoteCurrency'),
]);

export const initLendingMarketInstruction = (
    owner: PublicKey,
    quoteCurrency: Buffer,
    lendingMarket: PublicKey,
): TransactionInstruction => {
  const data = Buffer.alloc(DataLayout.span);
  DataLayout.encode(
      {
        instruction: LendingInstruction.InitLendingMarket,
        owner,
        quoteCurrency,
      },
      data,
  );

  const keys = [
    {pubkey: lendingMarket, isSigner: false, isWritable: true},
    {pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false},
    {pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false},
  ];

  return new TransactionInstruction({
    keys,
    programId: PORT_LENDING,
    data,
  });
};
