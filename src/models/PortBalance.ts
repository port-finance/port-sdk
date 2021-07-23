import {PortId} from "./PortId";
import {Collateral} from "./Collateral";
import {Loan} from "./Loan";
import {ReserveId} from "./ReserveId";
import {Margin} from "./Margin";
import {ReserveContext} from "./ReserveContext";
import {PortBalanceParser} from "../../models";
import {ParsedAccount} from "../../contexts/AccountContext";
import {MarginRatio} from "./MarginRatio";

export class PortBalance {

  static DATA_SIZE = 916;

  private readonly portId: PortId;
  private readonly collaterals: Collateral[];
  private readonly loans: Loan[];
  private readonly loanMargin: Margin;
  private readonly initialMargin: Margin;
  private readonly maintenanceMargin: Margin;

  constructor(
    portId: PortId,
    collaterals: Collateral[],
    loans: Loan[],
    loanMargin: Margin,
    initialMargin: Margin,
    maintenanceMargin: Margin,
  ) {
    this.portId = portId;
    this.collaterals = collaterals;
    this.loans = loans;
    this.loanMargin = loanMargin;
    this.initialMargin = initialMargin;
    this.maintenanceMargin = maintenanceMargin;
  }

  public static fromRaw(raw: ParsedAccount<PortBalanceParser>, reserves: ReserveContext): PortBalance {
    const portId = new PortId(raw.pubkey);
    const collaterals = raw.info.deposits
      .map(c => {
        const reserveId = new ReserveId(c.depositReserve)
        const reserve = reserves.getReserveByReserveId(reserveId);
        if (!reserve) {
          return undefined;
        }
        return Collateral.fromRaw(c, reserve.getShareId());
      })
      .filter(Boolean) as Collateral[];
    const loans = raw.info.borrows
      .map(l => {
        const reserveId = new ReserveId(l.borrowReserve)
        const reserve = reserves.getReserveByReserveId(reserveId);
        if (!reserve) {
          return undefined;
        }
        return Loan.fromRaw(l, reserve.getAssetId());
      })
      .filter(Boolean) as Loan[];
    const loanMargin = Margin.fromWads(raw.info.borrowedValue);
    const initialMargin = Margin.fromWads(raw.info.allowedBorrowValue);
    const maintenanceMargin = Margin.fromWads(raw.info.unhealthyBorrowValue);
    return new PortBalance(
      portId,
      collaterals,
      loans,
      loanMargin,
      initialMargin,
      maintenanceMargin,
    );
  }

  public getPortId(): PortId {
    return this.portId;
  }

  public getCollateral(reserveId: ReserveId): Collateral | undefined {
    return this.getCollaterals().find(c => c.getReserveId().equals(reserveId));
  }

  public getCollateralReserveIds(): ReserveId[] {
    return this.getCollaterals().map(c => c.getReserveId());
  }

  public getCollaterals(): Collateral[] {
    return this.collaterals;
  }

  public getLoan(reserveId: ReserveId): Loan | undefined {
    return this.getLoans().find(l => l.getReserveId().equals(reserveId));
  }

  public getLoanReserveIds(): ReserveId[] {
    return this.getLoans().map(l => l.getReserveId());
  }

  public getLoans(): Loan[] {
    return this.loans;
  }

  public getLoanMargin(): Margin {
    return this.loanMargin;
  }

  public getInitialMargin(): Margin {
    return this.initialMargin;
  }

  public getMaintenanceMargin(): Margin {
    return this.maintenanceMargin;
  }

  public getRiskFactor(): MarginRatio {
    return this.getLoanMargin().toRatioAgainst(this.getMaintenanceMargin());
  }
}
