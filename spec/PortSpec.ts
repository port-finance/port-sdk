import 'jasmine'
import {Port} from "../src/Port";

describe("Port", function () {
  let port: Port;

  beforeEach(function () {
    port = Port.forMainNet();
  });

  it('should have at least one reserve', async () => {
    const context = await port.getReserveContext();
    const reserves = context.getAllReserves();
    expect(reserves.length).toBeGreaterThanOrEqual(1);
  });

  it('should have positive total market cap', async () => {
    const total = await port.getTotalMarketCap();
    expect(total.toNumber()).toBeGreaterThan(0);
  })
});
