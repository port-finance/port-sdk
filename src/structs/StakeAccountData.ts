import {PublicKey} from '@solana/web3.js';
import BN from 'bn.js';
import * as BufferLayout from 'buffer-layout';
import * as Layout from '../utils/layout';

export const StakeAccountLayout = BufferLayout.struct([
  BufferLayout.u8('version'),
  Layout.uint128('startRate'),
  Layout.publicKey('owner'),
  Layout.publicKey('poolPubkey'),
  Layout.uint64('depositedAmount'),
  Layout.uint128('unclaimedRewardWads'),
  BufferLayout.blob(32, 'reserveField1'),
  BufferLayout.blob(32, 'reserveField2'),
  BufferLayout.blob(32, 'reserveField3'),
  BufferLayout.blob(32, 'reserveField4'),
]);

export interface StakeAccountProto {
  version: number;
  startRate: BN;
  owner: PublicKey;
  poolPubkey: PublicKey;
  depositedAmount: BN;
  unclaimedRewardWads: BN;
}

export const STAKE_ACCOUNT_DATA_SIZE = StakeAccountLayout.span;
