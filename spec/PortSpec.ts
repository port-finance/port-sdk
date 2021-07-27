import 'jasmine'
import {Port} from "../src/Port";
import {WalletId} from "../src/models/WalletId";
import {ReserveContext} from "../src/models/ReserveContext";

const GOLDEN_WALLET = WalletId.fromBase58('APrwtpjepsbn2pCAH22RuNQpN6L1UHvycJpd73pWqDNu');

describe("Port", function () {

  let port: Port;
  let context: ReserveContext;

  beforeAll(async function () {
    port = Port.forMainNet();
    context = await port.getReserveContext();
  });

  it('should have at least one reserve', async () => {
    const reserves = context.getAllReserves();
    expect(reserves.length).toBeGreaterThanOrEqual(1);
  });

  it('should have positive total market cap', async () => {
    const total = await port.getTotalMarketCap();
    expect(total.toNumber()).toBeGreaterThan(0);
  });

  it('should have at least one share balance', async () => {
    const shares = await port.getShareBalances(GOLDEN_WALLET, context);
    expect(shares.length).toBeGreaterThanOrEqual(1);
  });

  it('should have port balance', async () => {
    const pb = await port.getPortBalance(GOLDEN_WALLET, context);
    expect(pb).not.toBeUndefined();
  });
});
