import { MintId } from "./MintId";
import { TokenAccount } from "./TokenAccount";
import { TokenAccountId } from "./TokenAccountId";

export class TokenAccountContext {
  private static readonly SPL_ACCOUNT_CONTEXT_EMPTY = TokenAccountContext.index(
    []
  );

  private readonly accounts: TokenAccount[];
  private readonly bySplAccountId: Map<string, TokenAccount>;

  private constructor(
    accounts: TokenAccount[],
    bySplAccountId: Map<string, TokenAccount>
  ) {
    this.accounts = accounts;
    this.bySplAccountId = bySplAccountId;
  }

  public static empty(): TokenAccountContext {
    return TokenAccountContext.SPL_ACCOUNT_CONTEXT_EMPTY;
  }

  public static index(accounts: TokenAccount[]): TokenAccountContext {
    const bySplAccountId = new Map<string, TokenAccount>();
    accounts.forEach((a) =>
      bySplAccountId.set(a.getSplAccountId().toString(), a)
    );
    return new TokenAccountContext(accounts, bySplAccountId);
  }

  public isReady(): boolean {
    return this.accounts.length > 0;
  }

  public getAllTokenAccounts(): TokenAccount[] {
    return this.accounts;
  }

  public getSplAccount(splAccountId: TokenAccountId): TokenAccount {
    const result = this.findSplAccount(splAccountId);
    if (!result) {
      throw new Error(`No account for ${splAccountId}`);
    }

    return result;
  }

  public findSplAccount(
    splAccountId: TokenAccountId
  ): TokenAccount | undefined {
    const key = splAccountId.toString();
    return this.bySplAccountId.get(key);
  }

  public getSplAccountByMintId(mintId: MintId): TokenAccount {
    const result = this.findSplAccountByMintId(mintId);
    if (!result) {
      throw new Error(`No account for mint ${mintId}`);
    }

    return result;
  }

  public findSplAccountByMintId(mintId: MintId): TokenAccount | undefined {
    const accounts = this.accounts
      .filter((account) => account.getMintId().equals(mintId))
      .sort((a, b) => -a.getAmount().compare(b.getAmount()));
    return accounts[0];
  }
}
