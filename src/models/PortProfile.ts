import { PortProfileId } from "./PortProfileId";
import { Collateral } from "./Collateral";
import { Loan } from "./Loan";
import { ReserveId } from "./ReserveId";
import { Margin } from "./Margin";
import { MarginRatio } from "./MarginRatio";
import { Parsed } from "../serialization/Parsed";
import * as BufferLayout from "@solana/buffer-layout";
import { RawData } from "../serialization/RawData";
import {
  ObligationCollateralLayout,
  ObligationLayout,
  ObligationLiquidityLayout,
  PortProfileCollateralData,
  PortProfileData,
  PortProfileLoanData,
  ProtoObligation,
} from "../structs";
import { PublicKey } from "@solana/web3.js";
import { QuoteValue } from "./QuoteValue";

export class PortProfile implements Parsed<PortProfileId> {
  private readonly profileId: PortProfileId;
  private readonly collaterals: Collateral[];
  private readonly loans: Loan[];
  private readonly loanMargin: Margin;
  private readonly initialMargin: Margin;
  private readonly maintenanceMargin: Margin;

  // use in api-server
  private readonly owner: PublicKey | undefined;
  private readonly depositedValue: QuoteValue | undefined;

  private constructor(
    profileId: PortProfileId,
    collaterals: Collateral[],
    loans: Loan[],
    loanMargin: Margin,
    initialMargin: Margin,
    maintenanceMargin: Margin,
    owner?: PublicKey,
    depositedValue?: QuoteValue
  ) {
    this.profileId = profileId;
    this.collaterals = collaterals;
    this.loans = loans;
    this.loanMargin = loanMargin;
    this.initialMargin = initialMargin;
    this.maintenanceMargin = maintenanceMargin;
    this.owner = owner;
    this.depositedValue = depositedValue;
  }

  public static newAccount(profileId: PortProfileId): PortProfile {
    return new PortProfile(
      profileId,
      [],
      [],
      Margin.zero(),
      Margin.zero(),
      Margin.zero()
    );
  }

  public static fromRaw(raw: RawData): PortProfile {
    const profileId = PortProfileId.of(raw.pubkey);
    // eslint-disable-next-line new-cap
    const proto = PortProfileParser(raw.account.data);

    const collaterals = proto.deposits.map(
      (c) => new Collateral(ReserveId.of(c.depositReserve), c.depositedAmount)
    );
    const loans = proto.borrows.map(
      (l) =>
        new Loan(
          l.borrowReserve,
          l.borrowedAmountWads,
          l.cumulativeBorrowRateWads
        )
    );
    const loanMargin = proto.borrowedValue;
    const initialMargin = proto.allowedBorrowValue;
    const maintenanceMargin = proto.unhealthyBorrowValue;
    const depositedValue = proto.depositedValue;
    const owner = proto.owner;
    return new PortProfile(
      profileId,
      collaterals,
      loans,
      loanMargin,
      initialMargin,
      maintenanceMargin,
      owner,
      depositedValue
    );
  }

  public getDepositedValue(): QuoteValue | undefined {
    return this.depositedValue;
  }

  public getOwner(): PublicKey | undefined {
    return this.owner;
  }

  public getId(): PortProfileId {
    return this.getProfileId();
  }

  public getProfileId(): PortProfileId {
    return this.profileId;
  }

  public getCollateral(reserveId: ReserveId): Collateral | undefined {
    return this.getCollaterals().find((c) =>
      c.getReserveId().equals(reserveId)
    );
  }

  public getCollateralReserveIds(): ReserveId[] {
    return this.getCollaterals().map((c) => c.getReserveId());
  }

  public getCollaterals(): Collateral[] {
    return this.collaterals;
  }

  public getLoan(reserveId: ReserveId): Loan | undefined {
    return this.getLoans().find((l) => l.getReserveId().equals(reserveId));
  }

  public getLoanReserveIds(): ReserveId[] {
    return this.getLoans().map((l) => l.getReserveId());
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

  public getLoanToValue(): MarginRatio {
    return this.getLoanMargin().toRatioAgainst(this.getInitialMargin());
  }
}

const PortProfileParser = (buffer: Buffer) => {
  const {
    version,
    lastUpdate,
    lendingMarket,
    owner,
    depositedValue,
    borrowedValue,
    allowedBorrowValue,
    unhealthyBorrowValue,
    depositsLen,
    borrowsLen,
    dataFlat,
  } = ObligationLayout.decode(buffer) as ProtoObligation;

  const depositsBuffer = dataFlat.slice(
    0,
    depositsLen * ObligationCollateralLayout.span
  );
  const deposits = BufferLayout.seq(
    ObligationCollateralLayout,
    depositsLen
  ).decode(depositsBuffer) as PortProfileCollateralData[];

  const borrowsBuffer = dataFlat.slice(
    depositsBuffer.length,
    depositsBuffer.length + borrowsLen * ObligationLiquidityLayout.span
  );
  const borrows = BufferLayout.seq(
    ObligationLiquidityLayout,
    borrowsLen
  ).decode(borrowsBuffer) as PortProfileLoanData[];

  return {
    version,
    lastUpdate,
    lendingMarket,
    owner,
    depositedValue,
    borrowedValue,
    allowedBorrowValue,
    unhealthyBorrowValue,
    deposits,
    borrows,
  } as PortProfileData;
};
