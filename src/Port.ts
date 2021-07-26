import {Connection, PublicKey} from '@solana/web3.js';
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

export class Port {

  private readonly connection: Connection;
  private readonly program: PublicKey;

  constructor(endpoint: string, program: PublicKey) {
    this.connection = new Connection(endpoint, 'recent');
    this.program = program;
  }

  public static forMainNet(): Port {
    return new Port(
      'https://port-finance.rpcpool.com',
      new PublicKey('Port7uDYB3wk6GJAw4KT1WpTeMtSu9bTcChBHkX2LfR'),
    );
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
    return [];
  }

  public async getPortBalance(
    walletId: WalletId,
    context: ReserveContext,
  ): Promise<PortBalance | undefined> {
    const raw = await this.connection.getProgramAccounts(
      this.program,
      PortBalanceForWallet(walletId),
    );
    const parsed = raw
      .map(a => PortBalanceParser(a))
      .filter(p => !!p)
      .map(a => PortBalance.fromRaw(a, context)) as PortBalance[];
    return parsed.length > 0 ? parsed[0] : undefined;
  }

  public async getReserveContext(): Promise<ReserveContext> {
    const raw = await this.connection.getProgramAccounts(
      this.program,
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
}