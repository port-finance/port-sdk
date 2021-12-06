import {Connection, PublicKey} from '@solana/web3.js';
import {
  RESERVE_DATA_SIZE,
  ReserveData,
  ReserveLayout,
} from './structs/ReserveData';
import {ReserveParser as reserveParser} from './parsers/ReserveParser';
import {ReserveInfo} from './models/ReserveInfo';
import {ParsedAccount} from './parsers/ParsedAccount';
import {ReserveContext} from './models/ReserveContext';
import {QuoteValue} from './models/QuoteValue';
import {PortBalance} from './models/PortBalance';
import {WalletId} from './models/WalletId';
import {PortBalanceForWallet as portBalanceForWallet} from './utils/Filters';
import {PortBalanceParser as portBalanceParser} from './parsers/PortBalanceParser';
import {Balance} from './models/Balance';
import {Share} from './models/Share';
import {BalanceData, balanceParser} from './parsers/BalanceParser';
import {BalanceId} from './models/BalanceId';
import {ShareId} from './models/ShareId';
import {
  OBLIGATION_DATA_SIZE,
  PortBalanceData,
} from './structs/PortBalanceData';
import {Profile} from './Profile';
import {
  StakingPoolProto,
  STAKING_POOL_DATA_SIZE,
} from './structs/StakingPoolData';
import {StakingPoolContext} from './models/StakingPoolContext';
import {stakingPoolParser} from './parsers/StakingPoolParser';
import {StakingPoolInfo} from './models/StakingPoolInfo';
import {DEFAULT_PORT_LENDING_MARKET} from './constants';
import {LendingMarket} from './models/LendingMarket';

export class Port {
  public readonly connection: Connection;
  public readonly profile: Profile;
  public readonly lendingMarket: PublicKey;
  public lendingMarketData?: LendingMarket;
  public reserveContext?: ReserveContext;

  constructor(connection: Connection, profile: Profile, lendingMarket) {
    this.connection = connection;
    this.profile = profile;
    this.lendingMarket = lendingMarket;
  }

  public static forMainNet({
    connection = new Connection('https://api.mainnet-beta.solana.com'),
    profile = Profile.forMainNet(),
    lendingMarket = DEFAULT_PORT_LENDING_MARKET,
  }: {
    connection: Connection;
    profile: Profile;
    lendingMarket: PublicKey;
  }): Port {
    return new Port(connection, profile, lendingMarket);
  }

  public getProfile(): Profile {
    return this.profile;
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

  public async getShareBalances(
      walletId: WalletId,
      context: ReserveContext,
  ): Promise<Balance<Share>[]> {
    const shareMintPks = context
        .getAllReserves()
        .map((r) => r.getShareId())
        .map((s) => s.key);
    const programId = this.profile.getTokenProgramPk();
    const result = await this.connection.getTokenAccountsByOwner(walletId.key, {
      programId,
    });
    const raw = result.value;
    return raw
        .map((a) => balanceParser(a))
        .filter((p) => p && shareMintPks.find((k) => k.equals(p.data.mint)))
        .map((p) => {
          const parsed = p as ParsedAccount<BalanceData>;
          const balanceId = new BalanceId(parsed.pubkey, false);
          const shareId = new ShareId(parsed.data.mint);
          const share = new Share(shareId, parsed.data.amount.toString());
          return new Balance(balanceId, share);
        });
  }

  public async getPortBalance(
      walletId: WalletId,
      context: ReserveContext,
  ): Promise<PortBalance | undefined> {
    const raw = await this.connection.getProgramAccounts(
        this.profile.getLendingProgramPk(),
        portBalanceForWallet(walletId),
    );
    const parsed = raw
        .map((a) => portBalanceParser(a))
        .filter((p) => !!p)
        .map((p) => {
          const parsed = p as ParsedAccount<PortBalanceData>;
          return PortBalance.fromRaw(parsed, context);
        });
    return parsed.length > 0 ? parsed[0] : undefined;
  }

  public async getReserveContext(): Promise<ReserveContext> {
    const raw = await this.connection.getProgramAccounts(
        this.profile.getLendingProgramPk(),
        {
          filters: [
            {
              dataSize: RESERVE_DATA_SIZE,
            },
            {
              memcmp: {
                offset: ReserveLayout.offset('lendingMarket'),
                bytes: this.lendingMarket.toBase58(),
              },
            },
          ],
        },
    );
    const parsed = raw
        .map((a) => reserveParser(a))
        .filter((p) => !!p)
        .map((a) =>
          ReserveInfo.fromRaw(a as ParsedAccount<ReserveData>),
        ) as ReserveInfo[];
    return ReserveContext.index(parsed);
  }

  public async getStakingPoolContext(): Promise<StakingPoolContext> {
    if (this.profile.getStakingProgramPk() === undefined) {
      Promise.resolve();
    }

    const raw = await this.connection.getProgramAccounts(
      this.profile.getStakingProgramPk()!,
      {
        filters: [
          {
            dataSize: STAKING_POOL_DATA_SIZE,
          },
        ],
      },
    );
    const parsed = raw
        .map((a) => stakingPoolParser(a))
        .filter((p) => !!p)
        .map((a) =>
          StakingPoolInfo.fromRaw(a as ParsedAccount<StakingPoolProto>),
        ) as StakingPoolInfo[];
    return StakingPoolContext.index(parsed);
  }

  public async getAllPortBalances(): Promise<PortBalance[]> {
    const raw = await this.connection.getProgramAccounts(
        this.profile.getLendingProgramPk(),
        {
          filters: [
            {
              dataSize: OBLIGATION_DATA_SIZE,
            },
          ],
        },
    );
    const allReserves = await this.getReserveContext();
    const parsed = raw
        .map((p) => portBalanceParser(p))
        .filter((p) => !!p)
        .map((p) =>
          PortBalance.fromRaw(p as ParsedAccount<PortBalanceData>, allReserves),
        ) as PortBalance[];
    return parsed;
  }

  public async getStakingPool(
      stakingPoolKey: PublicKey,
  ): Promise<StakingPoolInfo> {
    const raw = await this.connection.getAccountInfo(stakingPoolKey);
    if (!raw) {
      return Promise.reject(new Error('no reserve found'));
    }
    return StakingPoolInfo.fromRaw(
      stakingPoolParser({
        pubkey: stakingPoolKey,
        account: raw,
      }) as ParsedAccount<StakingPoolProto>,
    );
  }

  public async getReserve(reserveKey: PublicKey): Promise<ReserveInfo> {
    const raw = await this.connection.getAccountInfo(reserveKey);
    if (!raw) {
      return Promise.reject(new Error('no reserve found'));
    }
    return ReserveInfo.fromRaw(
      reserveParser({
        pubkey: reserveKey,
        account: raw,
      }) as ParsedAccount<ReserveData>,
    );
  }
}
