import { PublicKey } from "@solana/web3.js";
import * as BufferLayout from "@solana/buffer-layout";
import BN from "bn.js";

export const publicKey = (property: string): BufferLayout.Layout => {
  const publicKeyLayout = BufferLayout.blob(
    32,
    property
  ) as BufferLayout.Layout;

  const _decode = publicKeyLayout.decode.bind(publicKeyLayout);
  const _encode = publicKeyLayout.encode.bind(publicKeyLayout);

  publicKeyLayout.decode = (buffer: Buffer, offset: number) => {
    const data = _decode(buffer, offset);
    return new PublicKey(data);
  };

  publicKeyLayout.encode = (key: PublicKey, buffer: Buffer, offset: number) => {
    return _encode(key.toBuffer(), buffer, offset);
  };

  return publicKeyLayout;
};

export const uint64 = (property = "uint64"): BufferLayout.Layout => {
  return _uint(8, property);
};

export const uint128 = (property = "uint128"): BufferLayout.Layout => {
  return _uint(16, property);
};

const _uint = (length: number, property: string): BufferLayout.Layout => {
  const layout = BufferLayout.blob(length, property) as BufferLayout.Layout;

  const _decode = layout.decode.bind(layout);
  const _encode = layout.encode.bind(layout);

  layout.decode = (buffer: Buffer, offset: number) => {
    const data = _decode(buffer, offset);
    return new BN(
      [...data]
        .reverse()
        .map((i) => `00${i.toString(16)}`.slice(-2))
        .join(""),
      16
    );
  };

  layout.encode = (num: BN, buffer: Buffer, offset: number) => {
    const a = num.toArray().reverse();
    let b = Buffer.from(a);
    if (b.length !== length) {
      const zeroPad = Buffer.alloc(length);
      b.copy(zeroPad);
      b = zeroPad;
    }

    return _encode(b, buffer, offset);
  };

  return layout;
};
