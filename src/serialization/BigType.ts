import Big from "big.js";
import * as BufferLayout from "@solana/buffer-layout";
import { UintField } from "./UIntField";

export class BigType {
  private static readonly WAD = new Big(10).pow(18);

  public static readonly U8 = new BigType(1);
  public static readonly U16 = new BigType(2);
  public static readonly U32 = new BigType(4);
  public static readonly U64 = new BigType(8);
  public static readonly U128 = new BigType(16);
  public static readonly D64 = new BigType(8, BigType.WAD);
  public static readonly D128 = new BigType(16, BigType.WAD);

  private readonly bytes: number;
  private readonly multiplier?: Big;

  private constructor(bytes: number, multiplier?: Big) {
    this.bytes = bytes;
    this.multiplier = multiplier;
  }

  public getLayout(): BufferLayout.Layout {
    if (this.bytes === 1) {
      return BufferLayout.u8();
    }
    if (this.bytes === 2) {
      return BufferLayout.u16();
    }
    if (this.bytes === 3) {
      return BufferLayout.u24();
    }
    if (this.bytes === 4) {
      return BufferLayout.u32();
    }
    return new UintField(this.bytes);
  }

  public getBytes(): number {
    return this.bytes;
  }

  public getMultiplier(): Big | undefined {
    return this.multiplier;
  }
}
