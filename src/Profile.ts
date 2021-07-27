import {ENV} from "@solana/spl-token-registry";
import {PublicKey} from "@solana/web3.js";

export class Profile {

  private readonly env: ENV;
  private readonly lendingProgramPk: PublicKey;
  private readonly tokenProgramPk: PublicKey;

  private constructor(env: ENV, lendingProgramPk: PublicKey, tokenProgramPk: PublicKey) {
    this.env = env;
    this.lendingProgramPk = lendingProgramPk;
    this.tokenProgramPk = tokenProgramPk;
  }

  public static forMainNet() {
    return new Profile(
      ENV.MainnetBeta,
      new PublicKey('Port7uDYB3wk6GJAw4KT1WpTeMtSu9bTcChBHkX2LfR'),
      new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
    );
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
}