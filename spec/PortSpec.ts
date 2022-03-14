import "jasmine";
import { Port } from "../src/Port";
import { WalletId } from "../src/models/WalletId";
import { ReserveContext } from "../src/models/ReserveContext";
import { Connection } from "@solana/web3.js";

const GOLDEN_WALLET = WalletId.fromBase58(
  "APrwtpjepsbn2pCAH22RuNQpN6L1UHvycJpd73pWqDNu"
);

describe("Port", function () {
  let port: Port;
  let context: ReserveContext;

  beforeAll(async function () {
    port = Port.forMainNet({
      connection: new Connection("https://solana-api.projectserum.com"),
    });
    context = await port.getReserveContext();
  });

  it("should have at least one reserve", async () => {
    const reserves = context.getAllReserves();
    expect(reserves.length).toBeGreaterThanOrEqual(1);
  });

  it("should have positive total market cap", async () => {
    const total = await port.getTotalMarketCap();
    expect(total.toNumber()).toBeGreaterThan(0);
  });

  it("should have at least one share balance", async () => {
    const shares = await port.getShareAccount(GOLDEN_WALLET, context);
    expect(shares.length).toBeGreaterThanOrEqual(1);
  });

  it("should have port balance", async () => {
    const pb = await port.getPortProfile(GOLDEN_WALLET);
    expect(pb).not.toBeUndefined();
  });

  it("should have all port balances", async () => {
    const pb = await port.getAllPortProfiles();
    expect(pb).not.toBeUndefined();
  });

  it("should have staking pools", async () => {
    const pb = await port.getStakingPoolContext();
    expect(pb).not.toBeUndefined();
  });
});
