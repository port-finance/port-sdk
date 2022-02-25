import { Lamport } from "./Lamport";
import { MintId } from "../MintId";
import { WrappedLamport } from "./WrappedLamport";

export abstract class Token<T extends Token<T>> extends WrappedLamport<T> {
  private readonly mintId: MintId;

  protected constructor(mintId: MintId, lamport: Lamport) {
    super(lamport);
    this.mintId = mintId;
  }

  public isNative(): boolean {
    return this.getMintId().isNative();
  }

  public getMintId(): MintId {
    return this.mintId;
  }

  protected isCompatibleWith(that: T): boolean {
    return this.mintId.equals(that.mintId);
  }
}
