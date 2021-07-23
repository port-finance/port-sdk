import {WalletId} from "./WalletId";
import {WalletAdapter} from "@solana/wallet-base";

export class Wallet {

  private readonly walletId: WalletId;
  private readonly adapter: WalletAdapter;

  constructor(walletId: WalletId, adapter: WalletAdapter) {
    this.walletId = walletId;
    this.adapter = adapter;
  }

  public getWalletId(): WalletId {
    return this.walletId;
  }

  public getAdaptor() {
    return this.adapter;
  }
}
