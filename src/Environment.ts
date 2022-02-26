import { PublicKey } from "@solana/web3.js";
import { AssetConfig, AssetContext } from "./models";
import { PORT_LENDING, PORT_STAKING } from "./constants";
import { MAINNET_ASSETS } from "./utils/AssetConfigs";
import { ENV } from "./utils/env";

export class Environment {
  private readonly env: ENV;
  private readonly lendingProgramPk: PublicKey;
  private readonly stakingProgramPk: PublicKey | undefined;
  private readonly tokenProgramPk: PublicKey;
  private readonly assetContext: AssetContext;

  constructor(
    env: ENV,
    lendingProgramPk: PublicKey,
    stakingProgramPk: PublicKey | undefined,
    tokenProgramPk: PublicKey,
    assetConfigs: AssetConfig[]
  ) {
    this.env = env;
    this.lendingProgramPk = lendingProgramPk;
    this.stakingProgramPk = stakingProgramPk;
    this.tokenProgramPk = tokenProgramPk;
    this.assetContext = AssetContext.index(assetConfigs);
  }

  public static forMainNet(): Environment {
    return new Environment(
      ENV.MainnetBeta,
      PORT_LENDING,
      PORT_STAKING,
      new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      MAINNET_ASSETS
    );
  }

  public getEnv(): ENV {
    return this.env;
  }

  public getLendingProgramPk(): PublicKey {
    return this.lendingProgramPk;
  }

  public getStakingProgramPk(): PublicKey | undefined {
    return this.stakingProgramPk;
  }

  public getTokenProgramPk(): PublicKey {
    return this.tokenProgramPk;
  }

  public getAssetContext(): AssetContext {
    return this.assetContext;
  }
}
