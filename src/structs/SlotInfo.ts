import BN from "bn.js";
import * as BufferLayout from "@solana/buffer-layout";
import * as Layout from "../serialization/layout";

export const SlotInfoLayout = (property: string): BufferLayout.Structure =>
  BufferLayout.struct(
    [Layout.uint64("slot"), BufferLayout.u8("stale")],
    property
  );

export interface SlotInfo {
  slot: BN;
  stale: boolean;
}
