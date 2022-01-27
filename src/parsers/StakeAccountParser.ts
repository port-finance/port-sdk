import {
  StakeAccountLayout,
  StakeAccountProto,
} from "../structs/StakeAccountData";
import { Parser } from "./Parser";
import { RawAccount } from "./RawAccount";

export const stakeAccountParser: Parser<StakeAccountProto> = (
  raw: RawAccount
) => {
  const pubkey = raw.pubkey;
  const buffer = Buffer.from(raw.account.data);
  const data = StakeAccountLayout.decode(buffer) as StakeAccountProto;

  return { pubkey, data };
};
