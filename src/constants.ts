import { PublicKey } from "@solana/web3.js";
import { QuantityContext } from "./models/QuantityContext";

export const PORT_LENDING = new PublicKey(
  "Port7uDYB3wk6GJAw4KT1WpTeMtSu9bTcChBHkX2LfR"
);
export const PORT_STAKING = new PublicKey(
  "stkarvwmSzv2BygN5e2LeTwimTczLWHCKPKGC2zVLiq"
);
export const DEFAULT_PORT_LENDING_MARKET = new PublicKey(
  "6T4XxKerq744sSuj3jaoV6QiZ8acirf4TrPwQzHAoSy5"
);

export const PORT_QUANTITY_CONTEXT = QuantityContext.fromDecimals(6);

export const MARKET_MAP: Record<string, string> = {
  H27Quk3DSbu55T4dCr1NddTTSAezXwHU67FPCZVKLhSW: "dev market",
  "6T4XxKerq744sSuj3jaoV6QiZ8acirf4TrPwQzHAoSy5": "prod market",
};
