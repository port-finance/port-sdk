import {ENV} from "@solana/spl-token-registry";
import {PublicKey} from "@solana/web3.js";
import {AssetConfig} from "./models/AssetConfig";
import {AssetId} from "./models/AssetId";
import {ReserveId} from "./models/ReserveId";
import {AssetDisplayConfig} from "./models/AssetDisplayConfig";
import {AssetPriceConfig} from "./models/AssetPriceConfig";
import {AssetDepositConfig} from "./models/AssetDepositConfig";
import {AssetContext} from "./models/AssetContext";

export class Profile {

  private readonly env: ENV;
  private readonly lendingProgramPk: PublicKey;
  private readonly tokenProgramPk: PublicKey;
  private readonly assetContext: AssetContext;

  private constructor(
    env: ENV,
    lendingProgramPk: PublicKey,
    tokenProgramPk: PublicKey,
    assetConfigs: AssetConfig[],
  ) {
    this.env = env;
    this.lendingProgramPk = lendingProgramPk;
    this.tokenProgramPk = tokenProgramPk;
    this.assetContext = AssetContext.index(assetConfigs);
  }

  public static forMainNet() {
    return new Profile(
      ENV.MainnetBeta,
      new PublicKey('Port7uDYB3wk6GJAw4KT1WpTeMtSu9bTcChBHkX2LfR'),
      new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
      [
        new AssetConfig(
          AssetId.fromBase58('So11111111111111111111111111111111111111112'),
          ReserveId.fromBase58('X9ByyhmtQH3Wjku9N5obPy54DbVjZV7Z99TPJZ2rwcs'),
          new AssetDisplayConfig('Solana', 'SOL'),
          AssetPriceConfig.fromDecimals(4),
          new AssetDepositConfig({
            min: 100_000_000, // min 0.1 SOL
            remain: 20_000_000, // remain 0.02 SOL
          }),
        ),
        new AssetConfig(
          AssetId.fromBase58('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
          ReserveId.fromBase58('DcENuKuYd6BWGhKfGr7eARxodqG12Bz1sN5WA8NwvLRx'),
          new AssetDisplayConfig('USD Coin', 'USDC'),
          AssetPriceConfig.fromDecimals(5),
          new AssetDepositConfig({
            min: 10_000, // min 0.01 USDC
            max: 100_000_000, // max 100 USDC
          }),
        ),
        new AssetConfig(
          AssetId.fromBase58('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'),
          ReserveId.fromBase58('4tqY9Hv7e8YhNQXuH75WKrZ7tTckbv2GfFVxmVcScW5s'),
          new AssetDisplayConfig('Tether', 'USDT'),
          AssetPriceConfig.fromDecimals(5),
          new AssetDepositConfig({
            min: 10_000, // min 0.01 USDT
            max: 100_000_000, // max 100 USDT
          }),
        ),
        new AssetConfig(
          AssetId.fromBase58('Ea5SjE2Y6yvCeW5dYTn7PYMuW5ikXkvbGdcmSnXeaLjS'),
          ReserveId.fromBase58('DSw99gXoGzvc4N7cNGU7TJ9bCWFq96NU2Cczi1TabDx2'),
          new AssetDisplayConfig('Parrot PAI', 'PAI'),
          AssetPriceConfig.fromDecimals(5),
          new AssetDepositConfig({
            min: 10_000, // min 0.01 PAI
            max: 100_000_000, // max 100 PAI
          }),
        ),
        new AssetConfig(
          AssetId.fromBase58('9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E'),
          ReserveId.fromBase58('DSST29PMCVkxo8cf5ht9LxrPoMc8jAZt98t6nuJywz8p'),
          new AssetDisplayConfig(
            'Bitcoin',
            'BTC',
          ),
          AssetPriceConfig.fromDecimals(1),
          new AssetDepositConfig({
            min: 1, // min 1 * 10 ^ (-6) BTC
          }),
        ),
        new AssetConfig(
          AssetId.fromBase58('SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt'),
          ReserveId.fromBase58('ZgS3sv1tJAor2rbGMFLeJwxsEGDiHkcrR2ZaNHZUpyF'),
          new AssetDisplayConfig(
            'Serum',
            'SRM',
          ),
          AssetPriceConfig.fromDecimals(4),
          new AssetDepositConfig({
            min: 1_000, // min 0.001 SRM
          }),
        ),
        new AssetConfig(
          AssetId.fromBase58('MERt85fc5boKw3BW1eYdxonEuJNvXbiMbs6hvheau5K'),
          ReserveId.fromBase58('BnhsmYVvNjXK3TGDHLj1Yr1jBGCmD1gZMkAyCwoXsHwt'),
          new AssetDisplayConfig(
            'Mercurial',
            'MER',
          ),
          AssetPriceConfig.fromDecimals(4),
          new AssetDepositConfig({
            min: 10_000, // min 0.01 MER
          }),
        ),
        new AssetConfig(
          AssetId.fromBase58('mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So'),
          ReserveId.fromBase58('9gDF5W94RowoDugxT8cM29cX8pKKQitTp2uYVrarBSQ7'),
          new AssetDisplayConfig(
            'Marinade staked SOL',
            'mSOL',
          ),
          AssetPriceConfig.fromDecimals(4),
          new AssetDepositConfig({
            min: 1_000, // min 0.001 mSOL
          }),
        ),
        new AssetConfig(
          AssetId.fromBase58('9EaLkQrbjmbbuZG9Wdpo8qfNUEjHATJFSycEmw6f1rGX'),
          ReserveId.fromBase58('GRJyCEezbZQibAEfBKCRAg5YoTPP2UcRSTC7RfzoMypy'),
          new AssetDisplayConfig(
            'Parrot Staked SOL',
            'pSOL',
          ),
          AssetPriceConfig.fromDecimals(4),
          new AssetDepositConfig({
            min: 1_000, // min 0.001 pSOL
          }),
        ),
      ]);
  }

  public getEnv(): ENV {
    return this.env;
  }

  public getLendingProgramPk(): PublicKey {
    return this.lendingProgramPk;
  }

  public getTokenProgramPk(): PublicKey {
    return this.tokenProgramPk;
  }

  public getAssetContext(): AssetContext {
    return this.assetContext;
  }
}