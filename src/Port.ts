import {Connection, PublicKey} from '@solana/web3.js';
import {
  RESERVE_DATA_SIZE,
  ReserveLayout,
  STAKING_POOL_DATA_SIZE,
  PORT_PROFILE_DATA_SIZE,
  ObligationLayout,
} from './structs';
import {ReserveInfo,
  ReserveContext,
  QuoteValue, WalletId,
  TokenAccount,
  PortProfile,
  StakingPool,
  StakingPoolContext,
} from './models';
import {Environment} from './Environment';
import {DEFAULT_PORT_LENDING_MARKET} from './constants';
import {AccessType} from './utils/Instructions';

export class Port {
  public readonly connection: Connection;
  public readonly environment: Environment;
  public readonly lendingMarket: PublicKey;
  public reserveContext?: ReserveContext;

  constructor(connection: Connection, environment: Environment, lendingMarket:PublicKey) {
    this.connection = connection;
    this.environment = environment;
    this.lendingMarket = lendingMarket;
  }

  public static forMainNet({
    connection = new Connection('https://api.mainnet-beta.solana.com'),
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
      context: ReserveContext,
  ):Promise<TokenAccount[]> {
    const shareMintPks = context
        .getAllReserves()
        .map((r) => r.getShareMintId())
        .map((s) => s.getAccess(AccessType.READ).pubkey);
    const programId = this.environment.getTokenProgramPk();
    const result = await this.connection.getTokenAccountsByOwner(walletId.getAccess(AccessType.READ).pubkey, {
      programId,
    });
    const raw = result.value;
    return raw
        .map((a) => TokenAccount.fromRaw(a))
        .filter((p) => p && shareMintPks.find((k) => k.equals(p.getMintId().getAccess(AccessType.READ).pubkey)));
  }

  public async getPortProfile(
      walletId: WalletId,
  ): Promise<PortProfile | undefined> {
    const raw = await this.connection.getProgramAccounts(
        this.environment.getLendingProgramPk(),
        {filters: [
          {
            memcmp: {
              // offset: 1 + 8 + 1 + 32,
              offset: ObligationLayout.offsetOf('owner')!,
              bytes: walletId.toBase58(),
            },
          },
          {
            dataSize: PORT_PROFILE_DATA_SIZE,
          },
        ],
        },
    );
    const parsed = raw
        .map((a) => PortProfile.fromRaw(a))
        .filter((p) => !!p);
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
                offset: ReserveLayout.offsetOf('lendingMarket')!,
                bytes: this.lendingMarket.toBase58(),
              },
            },
          ],
        },
    );
    const parsed = raw
        .map((a) => ReserveInfo.fromRaw(a))
        .filter((p) => !!p);
    return ReserveContext.index(parsed);
  }

  public async getStakingPoolContext(): Promise<StakingPoolContext> {
    if (this.environment.getStakingProgramPk() === undefined) {
      Promise.resolve();
    }

    const raw = await this.connection.getProgramAccounts(
      this.environment.getStakingProgramPk()!,
      {
        filters: [
          {
            dataSize: STAKING_POOL_DATA_SIZE,
          },
        ],
      },
    );
    const parsed = raw
        .map((a) => StakingPool.fromRaw(a))
        .filter((p) => !!p);
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
          ],
        },
    );
    const parsed = raw
        .map((p) => PortProfile.fromRaw(p))
        .filter((p) => !!p);
    return parsed;
  }

  public async getStakingPool(
      stakingPoolKey: PublicKey,
  ): Promise<StakingPool> {
    const raw = await this.connection.getAccountInfo(stakingPoolKey);
    if (!raw) {
      return Promise.reject(new Error('no reserve found'));
    }
    return StakingPool.fromRaw(
        {
          pubkey: stakingPoolKey,
          account: raw,
        },
    );
  }

  public async getReserve(reserveKey: PublicKey): Promise<ReserveInfo> {
    const raw = await this.connection.getAccountInfo(reserveKey);
    if (!raw) {
      return Promise.reject(new Error('no reserve found'));
    }
    return ReserveInfo.fromRaw(
        {
          pubkey: reserveKey,
          account: raw,
        },
    );
  }
}
