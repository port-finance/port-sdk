import { ReserveData, ReserveLayout } from "../structs/ReserveData";
import { Parser } from "./Parser";
import { RawAccount } from "./RawAccount";

export const ReserveParser: Parser<ReserveData> = (raw: RawAccount) => {
  const pubkey = raw.pubkey;
  const buffer = Buffer.from(raw.account.data);
  const data = ReserveLayout.decode(buffer) as ReserveData;

  if (data.lastUpdate.slot.isZero()) {
    return;
  }

  return { pubkey, data };
};
