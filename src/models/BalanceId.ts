import { PublicKey } from "@solana/web3.js";

import { Id } from "./Id";
import { WalletId } from "./WalletId";

export class BalanceId extends Id {
  readonly native: boolean;

  constructor(key: PublicKey, native: boolean) {
    super(key);
    this.native = native;
  }

  public static native(walletId: WalletId): BalanceId {
    return new BalanceId(walletId.key, true);
  }

  public isNative(): boolean {
    return this.native;
  }
}
