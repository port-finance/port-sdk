import { AssetId } from "./AssetId";
import { BigSource } from "big.js";
import { Ratio } from "./Ratio";

export class LoanToValueRatio extends Ratio {
  private readonly assetId: AssetId;

  constructor(assetId: AssetId, raw: BigSource) {
    super(raw);
    this.assetId = assetId;
  }
}
