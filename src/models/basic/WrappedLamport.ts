import { WrappedDecimal } from "./WrappedDecimal";
import { Lamport } from "./Lamport";
import { u64 } from "@solana/spl-token";

export abstract class WrappedLamport<
  T extends WrappedLamport<T>
> extends WrappedDecimal<Lamport, T> {
  public isMax(): boolean {
    return this.getWrapped().isMax();
  }

  public toU64(): u64 {
    return this.getAmount().toU64();
  }

  public getAmount(): Lamport {
    return this.getWrapped();
  }
}
