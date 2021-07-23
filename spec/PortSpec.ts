import 'jasmine'
import {Port} from "../src/Port";

describe("Port", function () {
  let port: Port;

  beforeEach(function () {
    port = Port.getInstance();
  });

  it("should be able to play a Song", async () => {
    const accounts = await port.getReserveAccounts();
    expect(accounts).toHaveSize(2);
  });
});
