import { ParsedAccount } from "./ParsedAccount";
import { RawAccount } from "./RawAccount";

export type Parser<T> = (raw: RawAccount) => ParsedAccount<T> | undefined;
