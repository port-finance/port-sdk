import {Reserve, ReserveLayout} from "../structs/Reserve";
import {Parser} from "./Parser";
import {RawAccount} from "./RawAccount";

export const ReserveParser: Parser<Reserve> = (raw: RawAccount) => {
  const pubkey = raw.pubkey;
  const buffer = Buffer.from(raw.account.data);
  const data = ReserveLayout.decode(buffer) as Reserve;
  if (data.lastUpdate.slot.isZero()) {
    return;
  }

  return {pubkey, data};
};
