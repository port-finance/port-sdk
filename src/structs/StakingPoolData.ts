import {PublicKey} from '@solana/web3.js';
import BN from 'bn.js';
import * as BufferLayout from 'buffer-layout';
import * as Layout from '../utils/layout';

export const StakingPoolLayout = BufferLayout.struct([
  BufferLayout.u8('version'),
  Layout.publicKey('ownerAuthority'),
  Layout.publicKey('adminAuthority'),
  Layout.publicKey('rewardTokenPool'),
  Layout.uint64('lastUpdate'),
  Layout.uint64('endTime'),
  Layout.uint64('duration'),
  Layout.uint64('earliestRewardClaimTime'),
  Layout.uint128('ratePerSlot'),
  Layout.uint128('cumulativeRate'),
  Layout.uint64('poolSize'),
  BufferLayout.u8('bumpSeedStakingProgram'),
  BufferLayout.blob(32, 'reserveField1'),
  BufferLayout.blob(32, 'reserveField2'),
  BufferLayout.blob(32, 'reserveField3'),
  BufferLayout.blob(32, 'reserveField4'),
]);

export interface StakingPoolProto {
  version: number;
  ownerAuthority: PublicKey;
  adminAuthority: PublicKey;
  rewardTokenPool: PublicKey;
  lastUpdate: BN;
  endTime: BN;
  duration: BN;
  earliestRewardClaimTime: BN;
  ratePerSlot: BN;
  cumulativeRate: BN;
  poolSize: BN;
  bumpSeedStakingProgram: number;
}

export const STAKING_POOL_DATA_SIZE = StakingPoolLayout.span;
