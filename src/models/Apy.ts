import { Ratio, Percentage } from "./basic";
import { BigSource } from "big.js";

export class Apy extends Ratio<Apy> {
  private static APY_NA = new Apy();

  private constructor(pct?: Percentage) {
    super(pct);
  }

  public static na(): Apy {
    return Apy.APY_NA;
  }

  public static of(raw: BigSource): Apy {
    return new Apy(Percentage.fromOneBased(raw));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected isCompatibleWith(that: Apy): boolean {
    return true;
  }
}
