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