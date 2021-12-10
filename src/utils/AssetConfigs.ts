import {AssetId} from '../models/AssetId';
import {AssetDisplayConfig} from '../models/AssetDisplayConfig';
import {AssetPriceConfig} from '../models/AssetPriceConfig';
import {AssetConfig} from '../models/AssetConfig';
import {ENV} from '@solana/spl-token-registry';
import {ReserveId} from '../models/ReserveId';
import {AssetDepositConfig} from '../models/AssetDepositConfig';

export const DEVNET_BTC = new AssetConfig(
    AssetId.fromBase58('EbwEYuUQHxcSHszxPBhA2nT2JxhiNwJedwjsctJnLmsC'),
    ReserveId.fromBase58('EkSW3xVGmBb14Hzkp7kx2Sx5ujFsDshX9gS8oiECdDgq'),
    new AssetDisplayConfig('Bitcoin', 'BTC'),
    AssetPriceConfig.fromDecimals(1),
    new AssetDepositConfig({max: 1_000_000}), // max 1 BTC
);

export const DEVNET_PORT = new AssetConfig(
    AssetId.fromBase58('8zCwBKPPVhRhG5gCkS7wYXyk5q9Kvjsm22Dqq1a1eM6q'),
    ReserveId.fromBase58('Coftc9CBXiPQkunk9Co8XEjRXcbefBCWwY3Xi3VSwBKN'),
    new AssetDisplayConfig('Port', 'PORT'),
    AssetPriceConfig.fromDecimals(6),
    new AssetDepositConfig(),
);

export const DEVNET_SOL = new AssetConfig(
    AssetId.fromBase58('So11111111111111111111111111111111111111112'),
    ReserveId.fromBase58('CeUARRj1N95C2cHvUL4Fv5fJMTuYhFDfypcwysRWR3Jy'),
    new AssetDisplayConfig('Solana', 'SOL'),
    AssetPriceConfig.fromDecimals(4),
    new AssetDepositConfig({
      min: 100_000_000, // min 0.1 SOL
      remain: 20_000_000, // remain 0.02 SOL
    }),
);

export const DEVNET_USDC = new AssetConfig(
    AssetId.fromBase58('G6YKv19AeGZ6pUYUwY9D7n4Ry9ESNFa376YqwEkUkhbi'),
    ReserveId.fromBase58('uMdEuwzwzHSaZhUTPckULNNWwGU4qPLLB1oVQKbJS8W'),
    new AssetDisplayConfig('USD Coin', 'USDC'),
    AssetPriceConfig.fromDecimals(5),
    new AssetDepositConfig(),
);
//
// export const DEVNET_ETH: AssetConfig = {
//   assetId: AssetId.fromBase58(''),
//   display: new AssetDisplayConfig(
//     'Ethereum',
//     'ETH',
//   ),
//   price: AssetPriceConfig.fromDecimals(2),
// };
//
// export const DEVNET_SRM: AssetConfig = {
//   assetId: AssetId.fromBase58(''),
//   display: new AssetDisplayConfig(
//     'Serum',
//     'SRM',
//   ),
//   price: AssetPriceConfig.fromDecimals(4),
// };
//
// export const DEVNET_USDT: AssetConfig = {
//   assetId: AssetId.fromBase58(''),
//   display: new AssetDisplayConfig(
//     'Tether',
//     'USDT',
//   ),
//   price: AssetPriceConfig.fromDecimals(5),
// };

export const MAINNET_SOL: AssetConfig = new AssetConfig(
    AssetId.fromBase58('So11111111111111111111111111111111111111112'),
    ReserveId.fromBase58('X9ByyhmtQH3Wjku9N5obPy54DbVjZV7Z99TPJZ2rwcs'),
    new AssetDisplayConfig('Solana', 'SOL'),
    AssetPriceConfig.fromDecimals(4),
    new AssetDepositConfig({
      min: 100_000_000, // min 0.1 SOL
      remain: 20_000_000, // remain 0.02 SOL
    }),
);

export const MAINNET_USDC: AssetConfig = new AssetConfig(
    AssetId.fromBase58('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
    ReserveId.fromBase58('DcENuKuYd6BWGhKfGr7eARxodqG12Bz1sN5WA8NwvLRx'),
    new AssetDisplayConfig('USD Coin', 'USDC'),
    AssetPriceConfig.fromDecimals(5),
    new AssetDepositConfig({
      min: 10_000, // min 0.01 USDC
      max: 100_000_000, // max 100 USDC
    }),
);

export const MAINNET_USDT: AssetConfig = new AssetConfig(
    AssetId.fromBase58('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'),
    ReserveId.fromBase58('4tqY9Hv7e8YhNQXuH75WKrZ7tTckbv2GfFVxmVcScW5s'),
    new AssetDisplayConfig('Tether', 'USDT'),
    AssetPriceConfig.fromDecimals(5),
    new AssetDepositConfig({
      min: 10_000, // min 0.01 USDT
      max: 100_000_000, // max 100 USDT
    }),
);

export const MAINNET_PAI: AssetConfig = new AssetConfig(
    AssetId.fromBase58('Ea5SjE2Y6yvCeW5dYTn7PYMuW5ikXkvbGdcmSnXeaLjS'),
    ReserveId.fromBase58('DSw99gXoGzvc4N7cNGU7TJ9bCWFq96NU2Cczi1TabDx2'),
    new AssetDisplayConfig('Parrot PAI', 'PAI'),
    AssetPriceConfig.fromDecimals(5),
    new AssetDepositConfig({
      min: 10_000, // min 0.01 PAI
      max: 100_000_000, // max 100 PAI
    }),
);

export const MAINNET_SRM: AssetConfig = new AssetConfig(
    AssetId.fromBase58('SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt'),
    ReserveId.fromBase58('ZgS3sv1tJAor2rbGMFLeJwxsEGDiHkcrR2ZaNHZUpyF'),
    new AssetDisplayConfig('Serum', 'SRM'),
    AssetPriceConfig.fromDecimals(5),
    new AssetDepositConfig({
      min: 10_000, // min 0.01 PAI
      max: 100_000_000, // max 100 PAI
    }),
);

export const MAINNET_BTC: AssetConfig = new AssetConfig(
    AssetId.fromBase58('9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E'),
    ReserveId.fromBase58('DSST29PMCVkxo8cf5ht9LxrPoMc8jAZt98t6nuJywz8p'),
    new AssetDisplayConfig('Bitcoin', 'BTC'),
    AssetPriceConfig.fromDecimals(5),
    new AssetDepositConfig({
      min: 1, // min 1 * 10 ^(-6) BTC
    }),
);

export const MAINNET_MER: AssetConfig = new AssetConfig(
    AssetId.fromBase58('MERt85fc5boKw3BW1eYdxonEuJNvXbiMbs6hvheau5K'),
    ReserveId.fromBase58('BnhsmYVvNjXK3TGDHLj1Yr1jBGCmD1gZMkAyCwoXsHwt'),
    new AssetDisplayConfig('Mercurial', 'MER'),
    AssetPriceConfig.fromDecimals(5),
    new AssetDepositConfig({
      min: 10_000, // min 0.01 MER
    }),
);

export const MAINNET_MSOL: AssetConfig = new AssetConfig(
    AssetId.fromBase58('mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So'),
    ReserveId.fromBase58('9gDF5W94RowoDugxT8cM29cX8pKKQitTp2uYVrarBSQ7'),
    new AssetDisplayConfig('Marinade Staked SOL', 'mSOL'),
    AssetPriceConfig.fromDecimals(5),
    new AssetDepositConfig({
      min: 1_000, // min 0.01 mSOL
    }),
);

export const MAINNET_PSOL: AssetConfig = new AssetConfig(
    AssetId.fromBase58('9EaLkQrbjmbbuZG9Wdpo8qfNUEjHATJFSycEmw6f1rGX'),
    ReserveId.fromBase58('GRJyCEezbZQibAEfBKCRAg5YoTPP2UcRSTC7RfzoMypy'),
    new AssetDisplayConfig('Parrot Staking SOL', 'pSOL'),
    AssetPriceConfig.fromDecimals(5),
    new AssetDepositConfig({
      min: 1_000, // min 0.01 PAI
    }),
);

export const DEVNET_ASSETS: AssetConfig[] = [
  DEVNET_BTC,
  DEVNET_PORT,
  DEVNET_SOL,
  DEVNET_USDC,
];

export const MAINNET_ASSETS: AssetConfig[] = [
  MAINNET_SOL,
  MAINNET_USDC,
  MAINNET_USDT,
  MAINNET_PAI,
  MAINNET_SRM,
  MAINNET_BTC,
  MAINNET_MER,
  MAINNET_MSOL,
  MAINNET_PSOL,
];

export function getAssetConfigs(env: ENV): AssetConfig[] {
  if (env === ENV.Devnet) {
    return DEVNET_ASSETS;
  } else if (env === ENV.MainnetBeta) {
    return MAINNET_ASSETS;
  }
  throw Error('Invalid environment ' + env);
}
