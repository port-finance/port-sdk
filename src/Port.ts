import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import {
  RESERVE_DATA_SIZE,
  ReserveLayout,
  STAKING_POOL_DATA_SIZE,
  PORT_PROFILE_DATA_SIZE,
  ObligationLayout,
  ReserveConfigProto,
} from "./structs";
import {
  ReserveInfo,
  ReserveContext,
  QuoteValue,
  WalletId,
  TokenAccount,
  PortProfile,
  StakingPool,
  StakingPoolContext,
} from "./models";
import { Environment } from "./Environment";
import { DEFAULT_PORT_LENDING_MARKET } from "./constants";
import { AccessType } from "./utils/Instructions";
import { BN } from "@project-serum/anchor";
import {
  initLendingMarketInstruction,
  initReserveInstruction,
  PORT_LENDING,
} from ".";
import { AccountLayout, MintLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { TransactionEnvelope, Provider } from "@saberhq/solana-contrib";
import { getTokenAccount } from "@saberhq/token-utils";
import invariant from "tiny-invariant";

export const LENDING_MARKET_LEN = 258;

export class Port {
  public readonly environment: Environment;
  public lendingMarket: PublicKey;
  public connection: Connection;
  public reserveContext?: ReserveContext;

  constructor(
    connection: Connection,
    environment: Environment,
    lendingMarket: PublicKey
  ) {
    this.connection = connection;
    this.environment = environment;
    this.lendingMarket = lendingMarket;
  }

  public setConnection(connection: Connection): void {
    this.connection = connection;
  }

  public setLendingMarket(lendingMarket: PublicKey): void {
    this.lendingMarket = lendingMarket;
  }

  public static forMainNet({
    connection = new Connection("https://api.mainnet-beta.solana.com"),
    profile = Environment.forMainNet(),
    lendingMarket = DEFAULT_PORT_LENDING_MARKET,
  }: {
    connection?: Connection;
    profile?: Environment;
    lendingMarket?: PublicKey;
  }): Port {
    return new Port(connection, profile, lendingMarket);
  }

  public getEnvironment(): Environment {
    return this.environment;
  }

  public async load(): Promise<void> {
    this.reserveContext = await this.getReserveContext();
  }

  public async getTotalMarketCap(): Promise<QuoteValue> {
    const context = await this.getReserveContext();
    return context
      .getAllReserves()
      .map((r) => r.getMarketCap())
      .map((c) => c.getValue())
      .reduce(QuoteValue.sum, QuoteValue.zero());
  }

  public async getShareAccount(
    walletId: WalletId,
    context: ReserveContext
  ): Promise<TokenAccount[]> {
    const shareMintPks = context
      .getAllReserves()
      .map((r) => r.getShareMintId())
      .map((s) => s.getAccess(AccessType.READ).pubkey);
    const programId = this.environment.getTokenProgramPk();
    const result = await this.connection.getTokenAccountsByOwner(
      walletId.getAccess(AccessType.READ).pubkey,
      {
        programId,
      }
    );
    const raw = result.value;
    return raw
      .map((a) => TokenAccount.fromRaw(a))
      .filter(
        (p) =>
          p &&
          shareMintPks.find((k) =>
            k.equals(p.getMintId().getAccess(AccessType.READ).pubkey)
          )
      );
  }

  public async getPortProfile(
    walletId: WalletId
  ): Promise<PortProfile | undefined> {
    const raw = await this.connection.getProgramAccounts(
      this.environment.getLendingProgramPk(),
      {
        filters: [
          {
            memcmp: {
              // eslint-disable-next-line
              offset: ObligationLayout.offsetOf("owner")!,
              bytes: walletId.toBase58(),
            },
          },
          {
            memcmp: {
              // eslint-disable-next-line
              offset: ObligationLayout.offsetOf("lendingMarket")!,
              bytes: this.lendingMarket.toBase58(),
            },
          },
          {
            dataSize: PORT_PROFILE_DATA_SIZE,
          },
        ],
      }
    );
    const parsed = raw.map((a) => PortProfile.fromRaw(a)).filter((p) => !!p);
    return parsed.length > 0 ? parsed[0] : undefined;
  }

  public async getReserveContext(): Promise<ReserveContext> {
    const raw = await this.connection.getProgramAccounts(
      this.environment.getLendingProgramPk(),
      {
        filters: [
          {
            dataSize: RESERVE_DATA_SIZE,
          },
          {
            memcmp: {
              // eslint-disable-next-line
              offset: ReserveLayout.offsetOf("lendingMarket")!,
              bytes: this.lendingMarket.toBase58(),
            },
          },
        ],
      }
    );
    const parsed = raw.map((a) => ReserveInfo.fromRaw(a)).filter((p) => !!p);
    return ReserveContext.index(parsed);
  }

  public async getStakingPoolContext(): Promise<StakingPoolContext> {
    if (this.environment.getStakingProgramPk() === undefined) {
      Promise.resolve();
    }

    const raw = await this.connection.getProgramAccounts(
      // eslint-disable-next-line
      this.environment.getStakingProgramPk()!,
      {
        filters: [
          {
            dataSize: STAKING_POOL_DATA_SIZE,
          },
        ],
      }
    );
    const parsed = raw.map((a) => StakingPool.fromRaw(a)).filter((p) => !!p);
    return StakingPoolContext.index(parsed);
  }

  public async getAllPortProfiles(): Promise<PortProfile[]> {
    const raw = await this.connection.getProgramAccounts(
      this.environment.getLendingProgramPk(),
      {
        filters: [
          {
            dataSize: PORT_PROFILE_DATA_SIZE,
          },
          {
            memcmp: {
              // eslint-disable-next-line
              offset: ObligationLayout.offsetOf("lendingMarket")!,
              bytes: this.lendingMarket.toBase58(),
            },
          },
        ],
      }
    );
    const parsed = raw.map((p) => PortProfile.fromRaw(p)).filter((p) => !!p);
    return parsed;
  }

  public async getStakingPool(stakingPoolKey: PublicKey): Promise<StakingPool> {
    const raw = await this.connection.getAccountInfo(stakingPoolKey);
    if (!raw) {
      return Promise.reject(new Error("no reserve found"));
    }
    return StakingPool.fromRaw({
      pubkey: stakingPoolKey,
      account: raw,
    });
  }

  public async getReserve(reserveKey: PublicKey): Promise<ReserveInfo> {
    const raw = await this.connection.getAccountInfo(reserveKey);
    if (!raw) {
      return Promise.reject(new Error("no reserve found"));
    }
    return ReserveInfo.fromRaw({
      pubkey: reserveKey,
      account: raw,
    });
  }

  public async createLendingMarket({
    provider,
    owner = provider.wallet.publicKey,
  }: {
    provider: Provider;
    owner?: PublicKey;
  }): Promise<[TransactionEnvelope, PublicKey]> {
    let tx = new TransactionEnvelope(provider, []);
    const [createTx, lendingMarketPubkey] = await this.createAccount({
      provider,
      space: LENDING_MARKET_LEN,
      owner: PORT_LENDING,
    });
    const createLendingMarketIx = initLendingMarketInstruction(
      owner,
      Buffer.from(
        "USD\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0",
        "ascii"
      ),
      lendingMarketPubkey
    );
    tx = tx.combine(createTx);
    tx.addInstructions(createLendingMarketIx);
    return [tx, lendingMarketPubkey];
  }

  public async createReserve({
    provider,
    reserveConfig,
    transferAuthority,
    sourceTokenWallet,
    initialLiquidity,
    oracle,
    price,
  }: {
    provider: Provider;
    reserveConfig: ReserveConfigProto;
    transferAuthority: PublicKey;
    sourceTokenWallet: PublicKey;
    initialLiquidity: number | BN;
    oracle?: PublicKey;
    price?: BN;
  }): Promise<[TransactionEnvelope[], PublicKey]> {
    invariant(!!oracle !== !!price, "Oracle and price can't both be present");

    const [createReserveAccountIx, reservePubKey] = await this.createAccount({
      provider,
      space: ReserveLayout.span,
      owner: PORT_LENDING,
    });
    const [collateralMintIx, collateralMintPubKey] = await this.createAccount({
      provider,
      space: MintLayout.span,
      owner: TOKEN_PROGRAM_ID,
    });
    const [liquiditySupplyIx, liquiditySupplyPubKey] = await this.createAccount(
      {
        provider,
        space: AccountLayout.span,
        owner: TOKEN_PROGRAM_ID,
      }
    );
    const [collateralSupplyIx, collateralSupplyPubKey] =
      await this.createAccount({
        provider,
        space: AccountLayout.span,
        owner: TOKEN_PROGRAM_ID,
      });
    const [userCollateralIx, userCollateralPubKey] = await this.createAccount({
      provider,
      space: AccountLayout.span,
      owner: TOKEN_PROGRAM_ID,
    });
    const [feeReceiverIx, feeReceiverPubkey] = await this.createAccount({
      provider,
      space: AccountLayout.span,
      owner: TOKEN_PROGRAM_ID,
    });

    const tokenAccount = await getTokenAccount(provider, sourceTokenWallet);

    const initReserveIx = initReserveInstruction(
      initialLiquidity,
      oracle ? 0 : 1, // price Option
      price ?? new BN(1),
      reserveConfig,
      sourceTokenWallet,
      collateralSupplyPubKey,
      reservePubKey,
      tokenAccount.mint,
      liquiditySupplyPubKey,
      feeReceiverPubkey,
      oracle ?? Keypair.generate().publicKey,
      collateralMintPubKey,
      userCollateralPubKey,
      this.lendingMarket,
      (await this.getLendingMarketAuthority())[0],
      provider.wallet.publicKey,
      transferAuthority
    );

    let tx1 = new TransactionEnvelope(provider, []);
    tx1 = tx1.combine(createReserveAccountIx);
    tx1 = tx1.combine(collateralMintIx);
    tx1 = tx1.combine(liquiditySupplyIx);
    tx1 = tx1.combine(collateralSupplyIx);
    tx1 = tx1.combine(userCollateralIx);

    let tx2 = new TransactionEnvelope(provider, []);
    tx2 = tx2.combine(feeReceiverIx);
    tx2 = tx2.addInstructions(initReserveIx);

    return [[tx1, tx2], reservePubKey];
  }

  public async getLendingMarketAuthority(): Promise<[PublicKey, number]> {
    return await PublicKey.findProgramAddress(
      [this.lendingMarket.toBuffer()],
      PORT_LENDING
    );
  }

  private async createAccount({
    provider,
    space,
    owner,
  }: {
    provider: Provider;
    space: number;
    owner: PublicKey;
  }): Promise<[TransactionEnvelope, PublicKey]> {
    const newAccount = Keypair.generate();
    const tx = new TransactionEnvelope(
      provider,
      [
        SystemProgram.createAccount({
          fromPubkey: provider.wallet.publicKey,
          newAccountPubkey: newAccount.publicKey,
          programId: owner,
          lamports: await provider.connection.getMinimumBalanceForRentExemption(
            space
          ),
          space,
        }),
      ],
      [newAccount]
    );
    return [tx, newAccount.publicKey];
  }
}
