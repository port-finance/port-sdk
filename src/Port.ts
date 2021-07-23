import {Connection, PublicKey} from '@solana/web3.js';
import {Reserve, RESERVE_DATA_SIZE} from "./structs/Reserve";
import {ReserveParser} from "./parsers/ReserveParser";
import {ReserveInfo} from "./models/ReserveInfo";
import {ParsedAccount} from "./parsers/ParsedAccount";

export class Port {

  private static ENDPOINT = 'https://port-finance.rpcpool.com';
  private static PROGRAM_ID = 'Port7uDYB3wk6GJAw4KT1WpTeMtSu9bTcChBHkX2LfR';

  private readonly connection: Connection;

  constructor(endpoint: string) {
    this.connection = new Connection(endpoint, 'recent');
  }

  public static getInstance(): Port {
    return new Port(Port.ENDPOINT)
  }

  public async getReserveAccounts(): Promise<ReserveInfo[]> {
    const raw = await this.connection.getProgramAccounts(
      new PublicKey(Port.PROGRAM_ID),
      {
        filters: [{
          dataSize: RESERVE_DATA_SIZE
        }]
      }
    );
    return raw
      .map(a => ReserveParser(a))
      .filter(p => !!p)
      .map(a => ReserveInfo.fromRaw(a as ParsedAccount<Reserve>)) as ReserveInfo[];
  }
}