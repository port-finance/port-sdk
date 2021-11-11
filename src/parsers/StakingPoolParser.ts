import {
  StakingPoolLayout,
  StakingPoolProto,
} from "../structs/StakingPoolData";
import { Parser } from "./Parser";
import { RawAccount } from "./RawAccount";

export const stakingPoolParser: Parser<StakingPoolProto> = (
  raw: RawAccount
) => {
  const pubkey = raw.pubkey;
  const buffer = Buffer.from(raw.account.data);
  const data = StakingPoolLayout.decode(buffer) as StakingPoolProto;

  return { pubkey, data };
};
