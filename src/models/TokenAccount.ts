import { TokenAccountId } from "./TokenAccountId";
import { MintId } from "./MintId";
import { Lamport } from "./basic";
import { Parsed } from "../serialization/Parsed";
import { WalletId } from "./WalletId";
import { RawData } from "../serialization/RawData";
import { AccountLayout, u64 } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

export class TokenAccount implements Parsed<TokenAccountId> {
  private readonly splAccountId: TokenAccountId;
  private readonly walletId: WalletId;
  private readonly mintId: MintId;
  private readonly amount: Lamport;

  public constructor(
    balanceId: TokenAccountId,
    walletId: WalletId,
    mintId: MintId,
    amount: Lamport
  ) {
    this.splAccountId = balanceId;
    this.walletId = walletId;
    this.mintId = mintId;
    this.amount = amount;
  }

  public static forNative(raw: RawData): TokenAccount {
    return new TokenAccount(
      TokenAccountId.of(raw.pubkey),
      WalletId.of(raw.pubkey),
      MintId.native(),
      Lamport.of(raw.account.lamports)
    );
  }

  public static fromRaw(raw: RawData): TokenAccount {
    const buffer = Buffer.from(raw.account.data);
    const accountInfo = AccountLayout.decode(buffer);

    accountInfo.mint = new PublicKey(accountInfo.mint);
    accountInfo.owner = new PublicKey(accountInfo.owner);
    accountInfo.amount = u64.fromBuffer(accountInfo.amount);

    return new TokenAccount(
      TokenAccountId.of(raw.pubkey),
      WalletId.of(accountInfo.owner),
      MintId.of(accountInfo.mint),
      Lamport.of(accountInfo.amount)
    );
  }

  public getId(): TokenAccountId {
    return this.getSplAccountId();
  }

  public getSplAccountId(): TokenAccountId {
    return this.splAccountId;
  }

  public getWalletId(): WalletId {
    return this.walletId;
  }

  public isNative(): boolean {
    return this.getMintId().isNative();
  }

  public getMintId(): MintId {
    return this.mintId;
  }

  public isPositive(): boolean {
    return this.amount.isPositive();
  }

  public getAmount(): Lamport {
    return this.amount;
  }
}
