import {
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  TransactionInstruction,
} from "@solana/web3.js";
import * as BufferLayout from "buffer-layout";
import { PORT_LENDING } from "src/constants";
import { LendingInstruction } from "./instruction";

interface Data {
  instruction: number;
}

const DataLayout = BufferLayout.struct<Data>([BufferLayout.u8("instruction")]);

export const refreshReserveInstruction = (
  reserve: PublicKey,
  oracle: PublicKey | null
): TransactionInstruction => {
  const data = Buffer.alloc(DataLayout.span);
  DataLayout.encode({ instruction: LendingInstruction.RefreshReserve }, data);

  const keys = [
    { pubkey: reserve, isSigner: false, isWritable: true },
    { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
  ];
  if (oracle) {
    keys.push({ pubkey: oracle, isSigner: false, isWritable: false });
  }

  return new TransactionInstruction({
    keys,
    programId: PORT_LENDING,
    data,
  });
};
