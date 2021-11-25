import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey, SYSVAR_RENT_PUBKEY, TransactionInstruction } from '@solana/web3.js';
import { nu64, struct, u8 } from 'buffer-layout';
import { PORT_STAKING } from '../constants';
import { publicKey } from '../utils/layout';

interface Data {
    instruction: number;
    supply: number;
    duration: number;
    earliestRewardTime: number;
    bumpSeed: number;
    poolOwnerAuthority: PublicKey;
    adminAuthority: PublicKey;
}

const DataLayout = struct<Data>([
  u8('instruction'), 
  nu64('supply'), 
  nu64('duration'), 
  nu64('earliestRewardTime'), 
  u8('bumpSeed'),
  publicKey('poolOwnerAuthority'),
  publicKey('adminAuthority'),
]);

export const initStakingPool = (
    supply: number,
    duration: number,
    earliestRewardTime: number,
    bumpSeed: number,
    transferRewardSupply: PublicKey,
    rewardTokenSupply: PublicKey,
    rewardTokenPool: PublicKey,
    stakingPool: PublicKey,
    rewardTokenMint: PublicKey,
    derivedStakingProgram: PublicKey,
    poolOwnerAuthority: PublicKey,
    adminAuthority: PublicKey
): TransactionInstruction => {
    const data = Buffer.alloc(DataLayout.span);
    DataLayout.encode(
        {
            instruction: 0,
            supply,
            duration,
            earliestRewardTime,
            bumpSeed,
            poolOwnerAuthority,
            adminAuthority
        },
        data
    );

    const keys = [
        // signer
        { pubkey: transferRewardSupply, isSigner: true, isWritable: false },
        // write accounts
        { pubkey: rewardTokenSupply, isSigner: false, isWritable: true },
        { pubkey: rewardTokenPool, isSigner: false, isWritable: true },
        { pubkey: stakingPool, isSigner: false, isWritable: true },
        // read accounts
        { pubkey: rewardTokenMint, isSigner: false, isWritable: false },
        { pubkey: derivedStakingProgram, isSigner: false, isWritable: false },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ];

    return new TransactionInstruction({
        keys,
        programId: PORT_STAKING,
        data,
    });
};