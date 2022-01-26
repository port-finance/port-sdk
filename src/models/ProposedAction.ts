import { Loan } from "./Loan";
import { Collateral } from "./Collateral";
import { ProfileEntry } from "./ProfileEntry";
import { Asset } from "./Asset";
import { Share } from "./Share";
import { MintId } from "./MintId";
import { ReserveId } from "./ReserveId";

export class ProposedAction {
  private readonly assets: Asset[];
  private readonly shares: Share[];
  private readonly collaterals: Collateral[];
  private readonly loans: Loan[];

  constructor(
    assets: Asset[],
    shares: Share[],
    collaterals: Collateral[],
    loans: Loan[]
  ) {
    this.assets = assets;
    this.shares = shares;
    this.collaterals = collaterals;
    this.loans = loans;
  }

  public static newProposal(args: {
    newAsset?: Asset;
    newShare?: Share;
    newCollateral?: Collateral;
    newLoan?: Loan;
  }): ProposedAction {
    const assets: Asset[] = [];
    const shares: Share[] = [];
    const collaterals: Collateral[] = [];
    const loans: Loan[] = [];
    if (args.newAsset) {
      assets.push(args.newAsset);
    }
    if (args.newShare) {
      shares.push(args.newShare);
    }
    if (args.newCollateral) {
      collaterals.push(args.newCollateral);
    }
    if (args.newLoan) {
      loans.push(args.newLoan);
    }
    return new ProposedAction(assets, shares, collaterals, loans);
  }

  public getUpdatedAsset(assetMintId: MintId): Asset | undefined {
    return this.assets.find((a) => a.getMintId().equals(assetMintId));
  }

  public getUpdatedShare(shareMintId: MintId): Share | undefined {
    return this.shares.find((s) => s.getMintId().equals(shareMintId));
  }

  public getUpdatedCollateral(reserveId: ReserveId): Collateral | undefined {
    return this.collaterals.find((c) => c.getReserveId().equals(reserveId));
  }

  public getUpdatedLoan(reserveId: ReserveId): Loan | undefined {
    return this.loans.find((l) => l.getReserveId().equals(reserveId));
  }

  public getUpdatedCollaterals(collaterals: Collateral[]): Collateral[] {
    return ProposedAction.proposal(collaterals, this.collaterals);
  }

  public getUpdatedLoans(loans: Loan[]): Loan[] {
    return ProposedAction.proposal(loans, this.loans);
  }

  private static proposal<T extends ProfileEntry<T>>(
    entries: T[],
    proposal: T[]
  ): T[] {
    if (!proposal.length) {
      return entries;
    }

    const map = new Map<string, T>();
    for (const e of entries) {
      map.set(e.getReserveId().toBase58(), e);
    }
    for (const e of proposal) {
      map.set(e.getReserveId().toBase58(), e);
    }
    return Array.from(map.values());
  }
}
