import {
  AssetDisplayConfig,
  AssetPriceConfig,
  AssetDepositConfig,
  AssetConfig,
  MintId,
  ReserveId,
} from "../models";
import { ENV } from "./env";

export const DEVNET_BTC = new AssetConfig(
  MintId.fromBase58("EbwEYuUQHxcSHszxPBhA2nT2JxhiNwJedwjsctJnLmsC"),
  new AssetDisplayConfig("Bitcoin", "BTC", "#FCAC44"),
  AssetPriceConfig.fromDecimals(1),
  new AssetDepositConfig(
    ReserveId.fromBase58("A8krqNC1WpWYhqUe2Y5WbLd1Zy4y2rRN5wJC8o9Scbyk"),
    { max: 1_000_000 }
  ) // max 1 BTC
);

export const DEVNET_PORT = new AssetConfig(
  MintId.fromBase58("fp42UaS3fXwees97JuHnqpr4SY5QfAQYyqELhr1TxuY"),
  new AssetDisplayConfig("Port", "PORT", "#796CFC"),
  AssetPriceConfig.fromDecimals(4)
);

export const DEVNET_SOL = new AssetConfig(
  MintId.fromBase58("So11111111111111111111111111111111111111112"),
  new AssetDisplayConfig("Solana", "SOL", "#BC57C4"),
  AssetPriceConfig.fromDecimals(4),
  new AssetDepositConfig(
    ReserveId.fromBase58("6FeVStQAGPWvfWijDHF7cTWRCi7He6vTT3ubfNhe9SPt"),
    {
      min: 100_000_000, // min 0.1 SOL
      remain: 20_000_000, // remain 0.02 SOL
    }
  )
);

export const DEVNET_USDC = new AssetConfig(
  MintId.fromBase58("G6YKv19AeGZ6pUYUwY9D7n4Ry9ESNFa376YqwEkUkhbi"),
  new AssetDisplayConfig("USD Coin", "USDC", "#3C84D4"),
  AssetPriceConfig.fromDecimals(5),
  new AssetDepositConfig(
    ReserveId.fromBase58("G1CcAWGhfxhHQaivC1Sh5CWVta6P4dc7a5BDSg9ERjV1")
  )
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

export const DEVNET_USDT: AssetConfig = new AssetConfig(
  MintId.fromBase58("9NGDi2tZtNmCCp8SVLKNuGjuWAVwNF3Vap5tT8km5er9"),
  new AssetDisplayConfig("Tether", "USDT", "#19664E"),
  AssetPriceConfig.fromDecimals(5),
  new AssetDepositConfig(
    ReserveId.fromBase58("B4dnCXcWXSXy1g3fGAmF6P2XgsLTFYaQxYpsU3VCB33Q")
  )
);

export const DEVNET_MER: AssetConfig = new AssetConfig(
  MintId.fromBase58("Tm9LcR74uJHPw3zY3j3nSh5xfcyaLbvXgAtTJwbqnnp"),
  new AssetDisplayConfig("Mercurial", "MER", "#34C5A7"),
  AssetPriceConfig.fromDecimals(5),
  new AssetDepositConfig(
    ReserveId.fromBase58("FdPnmYS7Ma8jfSy7UHAN5QM6teoqwd3vLQtoU6r2Umwy")
  )
);

export const DEVNET_SLP: AssetConfig = new AssetConfig(
  MintId.fromBase58("YakofBo4X3zMxa823THQJwZ8QeoU8pxPdFdxJs7JW57"),
  new AssetDisplayConfig("Saber USDC - USDT LP", "SLP", "#34C5A7"),
  AssetPriceConfig.fromDecimals(5),
  new AssetDepositConfig(
    ReserveId.fromBase58("4rR4MM9JRNSTwHiZ5kn831rUC9rHRnKvutm9kN87bPZA")
  )
);

export const MAINNET_SOL: AssetConfig = new AssetConfig(
  MintId.fromBase58("So11111111111111111111111111111111111111112"),
  new AssetDisplayConfig("Solana", "SOL", "#BC57C4"),
  AssetPriceConfig.fromDecimals(4),
  new AssetDepositConfig(
    ReserveId.fromBase58("X9ByyhmtQH3Wjku9N5obPy54DbVjZV7Z99TPJZ2rwcs"),
    {
      min: 100_000_000, // min 0.1 SOL
      remain: 20_000_000, // remain 0.02 SOL
    }
  )
);

export const MAINNET_USDC: AssetConfig = new AssetConfig(
  MintId.fromBase58("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
  new AssetDisplayConfig("USD Coin", "USDC", "#3C84D4"),
  AssetPriceConfig.fromDecimals(5),
  new AssetDepositConfig(
    ReserveId.fromBase58("DcENuKuYd6BWGhKfGr7eARxodqG12Bz1sN5WA8NwvLRx"),
    {
      min: 10_000, // min 0.01 USDC
    }
  )
);

export const MAINNET_USDT: AssetConfig = new AssetConfig(
  MintId.fromBase58("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"),
  new AssetDisplayConfig("Tether", "USDT", "#19664E"),
  AssetPriceConfig.fromDecimals(5),
  new AssetDepositConfig(
    ReserveId.fromBase58("4tqY9Hv7e8YhNQXuH75WKrZ7tTckbv2GfFVxmVcScW5s"),
    {
      min: 10_000, // min 0.01 USDT
    }
  )
);

export const MAINNET_PAI: AssetConfig = new AssetConfig(
  MintId.fromBase58("Ea5SjE2Y6yvCeW5dYTn7PYMuW5ikXkvbGdcmSnXeaLjS"),
  new AssetDisplayConfig("Parrot PAI", "PAI", "#C9D7FB"),
  AssetPriceConfig.fromDecimals(5),
  new AssetDepositConfig(
    ReserveId.fromBase58("DSw99gXoGzvc4N7cNGU7TJ9bCWFq96NU2Cczi1TabDx2"),
    {
      min: 10_000, // min 0.01 PAI
    }
  )
);

export const MAINNET_SRM: AssetConfig = new AssetConfig(
  MintId.fromBase58("SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt"),
  new AssetDisplayConfig("Serum", "SRM", "#30C0D5"),
  AssetPriceConfig.fromDecimals(5),
  new AssetDepositConfig(
    ReserveId.fromBase58("ZgS3sv1tJAor2rbGMFLeJwxsEGDiHkcrR2ZaNHZUpyF"),
    {
      min: 10_000, // min 0.01 PAI
    }
  )
);

export const MAINNET_BTC: AssetConfig = new AssetConfig(
  MintId.fromBase58("9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E"),
  new AssetDisplayConfig("Bitcoin", "BTC", "#FCAC44"),
  AssetPriceConfig.fromDecimals(1),
  new AssetDepositConfig(
    ReserveId.fromBase58("DSST29PMCVkxo8cf5ht9LxrPoMc8jAZt98t6nuJywz8p"),
    {
      min: 1, // min 1 * 10 ^ (-6) BTC
    }
  )
);

export const MAINNET_MER: AssetConfig = new AssetConfig(
  MintId.fromBase58("MERt85fc5boKw3BW1eYdxonEuJNvXbiMbs6hvheau5K"),
  new AssetDisplayConfig("Mercurial", "MER", "#34C5A7"),
  AssetPriceConfig.fromDecimals(4),
  new AssetDepositConfig(
    ReserveId.fromBase58("BnhsmYVvNjXK3TGDHLj1Yr1jBGCmD1gZMkAyCwoXsHwt"),
    {
      min: 10_000, // min 0.01 MER
    }
  )
);

export const MAINNET_MSOL: AssetConfig = new AssetConfig(
  MintId.fromBase58("mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So"),
  new AssetDisplayConfig("Marinade Staked SOL", "mSOL", "#4B4592"),
  AssetPriceConfig.fromDecimals(4),
  new AssetDepositConfig(
    ReserveId.fromBase58("9gDF5W94RowoDugxT8cM29cX8pKKQitTp2uYVrarBSQ7"),
    {
      min: 1_000, // min 0.001 mSOL
    }
  )
);

export const MAINNET_PORT: AssetConfig = new AssetConfig(
  MintId.fromBase58("PoRTjZMPXb9T7dyU7tpLEZRQj7e6ssfAE62j2oQuc6y"),
  new AssetDisplayConfig("Port", "PORT", "#796CFC"),
  AssetPriceConfig.fromDecimals(4),
  new AssetDepositConfig(
    ReserveId.fromBase58("4GXmyhMB9uUGjv4pfGfTRY1zJxoUY1CFXYvuFp7Maj1L")
  )
);

export const MAINNET_PSOL: AssetConfig = new AssetConfig(
  MintId.fromBase58("9EaLkQrbjmbbuZG9Wdpo8qfNUEjHATJFSycEmw6f1rGX"),
  new AssetDisplayConfig("Parrot Staked SOL", "pSOL", "#7E4592"),
  AssetPriceConfig.fromDecimals(4),
  new AssetDepositConfig(
    ReserveId.fromBase58("GRJyCEezbZQibAEfBKCRAg5YoTPP2UcRSTC7RfzoMypy"),
    {
      min: 1_000, // min 0.001 pSOL
    }
  )
);

export const MAINNET_SBR: AssetConfig = new AssetConfig(
  MintId.fromBase58("Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1"),
  new AssetDisplayConfig("Saber Protocol Token", "SBR", "#7E4591"),
  AssetPriceConfig.fromDecimals(6),
  new AssetDepositConfig(
    ReserveId.fromBase58("7dXHPrJtwBjQqU1pLKfkHbq9TjQAK9jTms3rnj1i3G77"),
    {
      min: 1_000_000, // min 1 SBR
    }
  )
);

export const MAINNET_MNDE: AssetConfig = new AssetConfig(
  MintId.fromBase58("MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey"),
  new AssetDisplayConfig("Marinade Governace Token", "MNDE", "#7E4591"),
  AssetPriceConfig.fromDecimals(6)
);

export const MAINNET_SLP: AssetConfig = new AssetConfig(
  MintId.fromBase58("2poo1w1DL6yd2WNTCnNTzDqkC6MBXq7axo77P16yrBuf"),
  new AssetDisplayConfig("Saber USDC - USDT LP", "SLP", "#34C5A7"),
  AssetPriceConfig.fromDecimals(5),
  new AssetDepositConfig(
    ReserveId.fromBase58("BXt3EhK5Tj81aKaVSBD27rLFd5w8A6wmGKDh47JWohEu")
  )
);

export const MAINNET_UST: AssetConfig = new AssetConfig(
  MintId.fromBase58("9vMJfxuKxXBoEa7rM12mYLMwTacLMLDJqHozw96WQL8i"),
  new AssetDisplayConfig("UST", "UST", "#34C5A7"),
  AssetPriceConfig.fromDecimals(5),
  new AssetDepositConfig(
    ReserveId.fromBase58("4HVSvzUfQ3aP5wEDkCQRqgYMhNatenVRKPdbXUv8VvBa")
  )
);

export const MAINNET_WHETH: AssetConfig = new AssetConfig(
  MintId.fromBase58("7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs"),
  new AssetDisplayConfig("Wormhole Ethereum", "whETH", "#34C5A7"),
  AssetPriceConfig.fromDecimals(5),
  new AssetDepositConfig(
    ReserveId.fromBase58("AtooWNBQRrg94ZeNdx9nk5HMSzHyXVbVvsdPXtbcMG1J")
  )
);

export const MAINNET_FIDA: AssetConfig = new AssetConfig(
  MintId.fromBase58("EchesyfXePKdLtoiZSL8pBe8Myagyy8ZRqsACNCFGnvp"),
  new AssetDisplayConfig("Bonfida", "FIDA", "#34C5A7"),
  AssetPriceConfig.fromDecimals(5),
  new AssetDepositConfig(
    ReserveId.fromBase58("Bten75q82AMWmrRp77DgsphtSbUjHYhL7Mx5bx6SR4iA")
  )
);

export const MAINNET_STSOL: AssetConfig = new AssetConfig(
  MintId.fromBase58("7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj"),
  new AssetDisplayConfig("Lido Staked SOL", "stSOL", "#34C5A7"),
  AssetPriceConfig.fromDecimals(5),
  new AssetDepositConfig(
    ReserveId.fromBase58("AH4PS75H3LAGDd48HQBgGo78gv3nk2LVZjNrUgiueUrh")
  )
);

export const MAINNET_2022_MAR_PPUSDC: AssetConfig = new AssetConfig(
  MintId.fromBase58("6cKnRJskSTonD6kZiWt2Fy3NB6ZND6CbgA3vHiZ1kHEU"),
  new AssetDisplayConfig(
    "Port Finance 2022 March Principle USDC",
    "ppUSDC",
    "#34C5A7"
  ),
  AssetPriceConfig.fromDecimals(5)
);

export const MAINNET_2022_MAR_PYUSDC: AssetConfig = new AssetConfig(
  MintId.fromBase58("B64haiHLQoWdrvcJqufRG5dEMms96rDpwuaTjYTihQEo"),
  new AssetDisplayConfig(
    "Port Finance 2022 March Yield USDC",
    "pyUSDC",
    "#34C5A7"
  ),
  AssetPriceConfig.fromDecimals(5)
);

export const DEVNET_ASSETS: AssetConfig[] = [
  DEVNET_BTC,
  DEVNET_PORT,
  DEVNET_SOL,
  DEVNET_USDC,
  DEVNET_USDT,
  DEVNET_MER,
  DEVNET_SLP,
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
  MAINNET_PORT,
  MAINNET_PSOL,
  MAINNET_SBR,
  MAINNET_MNDE,
  MAINNET_SLP,
  MAINNET_UST,
  MAINNET_WHETH,
  MAINNET_FIDA,
  MAINNET_2022_MAR_PPUSDC,
  MAINNET_2022_MAR_PYUSDC,
  MAINNET_STSOL,
];

export function getAssetConfigs(env: ENV): AssetConfig[] {
  if (env === ENV.Devnet) {
    return DEVNET_ASSETS;
  } else if (env === ENV.MainnetBeta) {
    return MAINNET_ASSETS;
  }
  throw Error("Invalid environment " + env);
}
