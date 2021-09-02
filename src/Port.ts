import {Connection} from '@solana/web3.js';
import {RESERVE_DATA_SIZE, ReserveData} from "./structs/ReserveData";
import {ReserveParser} from "./parsers/ReserveParser";
import {ReserveInfo} from "./models/ReserveInfo";
import {ParsedAccount} from "./parsers/ParsedAccount";
import {ReserveContext} from "./models/ReserveContext";
import {QuoteValue} from "./models/QuoteValue";
import {PortBalance} from "./models/PortBalance";
import {WalletId} from "./models/WalletId";
import {PortBalanceForWallet} from "./utils/Filters";
import {PortBalanceParser} from "./parsers/PortBalanceParser";
import {Balance} from "./models/Balance";
import {Share} from "./models/Share";
import {BalanceData, BalanceParser} from "./parsers/BalanceParser";
import {BalanceId} from "./models/BalanceId";
import {ShareId} from "./models/ShareId";
import {PortBalanceData} from "./structs/PortBalanceData";
import {Profile} from "./Profile";

export class Port {

  private readonly connection: Connection;
  private readonly profile: Profile;

  constructor(endpoint: string, profile: Profile) {
    this.connection = new Connection(endpoint, 'recent');
    this.profile = profile;
  }

  public static forMainNet(endpoint?: string): Port {
    return new Port(
      endpoint || 'https://port-finance.rpcpool.com',
      Profile.forMainNet(),
    );
  }

  public getProfile(): Profile {
    return this.profile;
  }

  public async getTotalMarketCap(): Promise<QuoteValue> {
    const context = await this.getReserveContext();
    return context.getAllReserves()
      .map(r => r.getMarketCap())
      .map(c => c.getValue())
      .reduce(QuoteValue.sum, QuoteValue.zero());
  }

  public async getShareBalances(
    walletId: WalletId,
    context: ReserveContext,
  ): Promise<Balance<Share>[]> {
    const shareMintPks = context.getAllReserves().map(r => r.getShareId()).map(s => s.key);
    const programId = this.profile.getTokenProgramPk();
    const result = await this.connection.getTokenAccountsByOwner(
      walletId.key,
      {programId},
    );
    const raw = result.value;
    return raw
      .map(a => BalanceParser(a))
      .filter(p => p && shareMintPks.find(k => k.equals(p.data.mint)))
      .map(p => {
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
      PortBalanceForWallet(walletId),
    );
    const parsed = raw
      .map(a => PortBalanceParser(a))
      .filter(p => !!p)
      .map(p => {
        const parsed = p as ParsedAccount<PortBalanceData>
        return PortBalance.fromRaw(parsed, context);
      });
    return parsed.length > 0 ? parsed[0] : undefined;
  }

  public async getReserveContext(): Promise<ReserveContext> {
    const raw = await this.connection.getProgramAccounts(
      this.profile.getLendingProgramPk(),
      {
        filters: [{
          dataSize: RESERVE_DATA_SIZE
        }]
      }
    );
    const parsed = raw
      .map(a => ReserveParser(a))
      .filter(p => !!p)
      .map(a => ReserveInfo.fromRaw(a as ParsedAccount<ReserveData>)) as ReserveInfo[];
    return ReserveContext.index(parsed);
  }

  public async getAllPortBalances(): Promise<PortBalance[]> {
    const raw = await this.connection.getProgramAccounts(
      this.profile.getLendingProgramPk(),
      {
        filters: [{
          dataSize: RESERVE_DATA_SIZE
        }]
      }
    );
    const allReserves = await this.getReserveContext();
    const parsed = raw
      .map(p => PortBalanceParser(p))
      .filter(p => !!p)
      .map(p => PortBalance.fromRaw(p as ParsedAccount<PortBalanceData>, allReserves)) as PortBalance[];
    return parsed;
  }
}