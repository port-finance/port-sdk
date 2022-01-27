/* eslint-disable new-cap */
import { ReserveId } from "./ReserveId";
import { Asset } from "./Asset";
import { Share } from "./Share";
import { AssetExchangeRate } from "./AssetExchangeRate";
import { ReserveUtilizationRatio } from "./ReserveUtilizationRatio";
import { ReserveBorrowRate } from "./ReserveBorrowRate";
import Big from "big.js";
import { MintId } from "./MintId";
import { Apy } from "./Apy";
import { OracleId } from "./OracleId";
import { MarketId } from "./MarketId";
import { TokenAccountId } from "./TokenAccountId";
import { Percentage } from "./basic";
import { AssetPrice } from "./AssetPrice";
import { QuantityContext } from "./QuantityContext";
import { AssetValue } from "./AssetValue";
import { Parsed } from "../serialization/Parsed";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import {
  borrowObligationLiquidityInstruction,
  depositObligationCollateralInstruction,
  depositReserveLiquidityInstruction,
  redeemReserveCollateralInstruction,
  refreshReserveInstruction,
} from "../instructions";
import {
  ReserveCollateral,
  ReserveConfig,
  ReserveData,
  ReserveLayout,
  ReserveLiquidity,
} from "../structs";
import { RawData } from "../serialization/RawData";
import { StakingPoolId } from "./staking/StakingPoolId";
import { ExchangeRate } from "./ExchangeRate";
import { PORT_LENDING } from "../constants";
import BN from "bn.js";

export class ReserveInfo implements Parsed<ReserveId> {
  private readonly reserveId: ReserveId;
  readonly marketId: MarketId;
  readonly asset: ReserveAssetInfo;
  readonly share: ReserveTokenInfo;
  readonly params: ReserveParams;
  private readonly stakingPoolId: StakingPoolId | undefined;

  // tricky
  readonly proto: ReserveData;

  constructor(
    reserveId: ReserveId,
    marketId: MarketId,
    asset: ReserveAssetInfo,
    share: ReserveTokenInfo,
    params: ReserveParams,
    stakingPoolId: StakingPoolId | undefined,
    proto: ReserveData
  ) {
    this.reserveId = reserveId;
    this.marketId = marketId;
    this.asset = asset;
    this.share = share;
    this.params = params;
    this.stakingPoolId = stakingPoolId;
    this.proto = proto;
  }

  public static fromRaw(raw: RawData): ReserveInfo {
    const buffer = raw.account.data;
    const proto = ReserveLayout.decode(buffer) as ReserveData;

    const marketId = MarketId.of(proto.lendingMarket);
    const asset = ReserveAssetInfo.fromRaw(proto.liquidity);
    const token = ReserveTokenInfo.fromRaw(proto.collateral);
    const params = ReserveParams.fromRaw(asset.getMintId(), proto.config);
    const stakingPoolId = proto.config.stakingPoolId;
    return new ReserveInfo(
      ReserveId.of(raw.pubkey),
      marketId,
      asset,
      token,
      params,
      stakingPoolId,
      proto
    );
  }

  getProto(): ReserveData {
    return this.proto;
  }

  getId(): ReserveId {
    return this.getReserveId();
  }

  public getReserveId(): ReserveId {
    return this.reserveId;
  }

  public getMarketId(): MarketId {
    return this.marketId;
  }

  public getAssetMintId(): MintId {
    return this.asset.getMintId();
  }

  public getAssetBalanceId(): TokenAccountId {
    return this.asset.getSplAccountId();
  }

  public getShareMintId(): MintId {
    return this.share.getMintId();
  }

  public getShareBalanceId(): TokenAccountId {
    return this.share.getSplAccountId();
  }

  public getOracleId(): OracleId | null {
    return this.asset.getOracleId();
  }

  public getFeeBalanceId(): TokenAccountId {
    return this.asset.getFeeAccountId();
  }

  // new input arg
  public getMarketCap(price?: AssetPrice): AssetValue {
    const asset = this.getTotalAsset();
    return new AssetValue(
      asset,
      asset.toValue(price ?? this.getMarkPrice(), this.getQuantityContext())
    );
  }

  public getTotalAsset(): Asset {
    return this.getAvailableAsset().add(this.getBorrowedAsset());
  }

  // new input arg
  public getAvailableAssetValue(price?: AssetPrice): AssetValue {
    const asset = this.getAvailableAsset();
    return new AssetValue(
      asset,
      asset.toValue(price ?? this.getMarkPrice(), this.getQuantityContext())
    );
  }

  public getAvailableAsset(): Asset {
    return this.asset.getAvailableAsset();
  }

  // new input arg
  public getBorrowedAssetValue(price?: AssetPrice): AssetValue {
    const asset = this.getBorrowedAsset();
    return new AssetValue(
      asset,
      asset.toValue(price ?? this.getMarkPrice(), this.getQuantityContext())
    );
  }

  public getBorrowedAsset(): Asset {
    return this.asset.getBorrowedAsset();
  }

  public getQuantityContext(): QuantityContext {
    return this.asset.getQuantityContext();
  }

  public getMarkPrice(): AssetPrice {
    return this.asset.getMarkPrice();
  }

  public getExchangeRatio(): AssetExchangeRate {
    const asset = this.getTotalAsset();
    const share = this.share.getIssuedShare();

    const assetMintId = asset.getMintId();
    const shareMintId = share.getMintId();
    if (asset.isZero()) {
      return new AssetExchangeRate(shareMintId, assetMintId);
    }
    const ratio = Percentage.fromOneBased(share.getRaw().div(asset.getRaw()));
    return new AssetExchangeRate(shareMintId, assetMintId, ratio);
  }

  public getUtilizationRatio(): ReserveUtilizationRatio {
    const total = this.getTotalAsset();
    if (total.isZero()) {
      return ReserveUtilizationRatio.na(total.getMintId());
    }

    const pct = Percentage.fromOneBased(
      this.getBorrowedAsset().getRaw().div(total.getRaw())
    );
    return new ReserveUtilizationRatio(total.getMintId(), pct);
  }

  public getSupplyApy(): Apy {
    const utilizationRatio = this.getUtilizationRatio();
    const borrowApy = this.getBorrowApy();

    if (!utilizationRatio.isPresent() || !borrowApy.isPresent()) {
      return Apy.na();
    }

    const utilizationRatioRaw = utilizationRatio.getUnchecked();
    const borrowApyRaw = borrowApy.getUnchecked();
    return Apy.of(utilizationRatioRaw.mul(borrowApyRaw));
  }

  public getBorrowApy(): Apy {
    const params = this.params;
    const utilizationRatio = this.getUtilizationRatio();
    const optimalUtilizationRatio = params.optimalUtilizationRatio;
    const optimalBorrowRate = params.optimalBorrowRate;

    if (
      !utilizationRatio.isPresent() ||
      !optimalUtilizationRatio.isPresent() ||
      !optimalBorrowRate.isPresent()
    ) {
      return Apy.na();
    }

    const utilizationRatioRaw = utilizationRatio.getUnchecked();
    const optimalUtilizationRatioRaw = optimalUtilizationRatio.getUnchecked();
    const optimalBorrowRateRaw = optimalBorrowRate.getUnchecked();
    if (
      optimalUtilizationRatioRaw.eq(1) ||
      utilizationRatioRaw.lt(optimalUtilizationRatioRaw)
    ) {
      const minBorrowRate = params.minBorrowRate;
      if (!minBorrowRate.isPresent()) {
        return Apy.na();
      }

      const minBorrowRateRaw = minBorrowRate.getUnchecked();
      const normalizedFactor = utilizationRatioRaw.div(
        optimalUtilizationRatioRaw
      );
      const borrowRateDiff = optimalBorrowRateRaw.sub(minBorrowRateRaw);
      return Apy.of(normalizedFactor.mul(borrowRateDiff).add(minBorrowRateRaw));
    }

    const maxBorrowRate = params.maxBorrowRate;
    if (!maxBorrowRate.isPresent()) {
      return Apy.na();
    }

    const maxBorrowRateRaw = maxBorrowRate.getUnchecked();
    const normalizedFactor = utilizationRatioRaw
      .sub(optimalUtilizationRatioRaw)
      .div(new Big(1).sub(optimalUtilizationRatioRaw));
    const borrowRateDiff = maxBorrowRateRaw.sub(optimalBorrowRateRaw);

    return Apy.of(
      normalizedFactor.mul(borrowRateDiff).add(optimalBorrowRateRaw)
    );
  }

  public getStakingPoolId(): StakingPoolId | undefined {
    return this.stakingPoolId;
  }

  // add reserve instructions ,use in Sundial
  public async getMarketAuthority(): Promise<[PublicKey, number]> {
    return await PublicKey.findProgramAddress(
      [this.getMarketId().toBuffer()],
      PORT_LENDING
    );
  }

  public async depositReserve({
    amount,
    userLiquidityWallet,
    destinationCollateralWallet,
    userTransferAuthority,
  }: {
    amount: BN;
    userLiquidityWallet: PublicKey;
    destinationCollateralWallet: PublicKey;
    userTransferAuthority: PublicKey;
  }): Promise<TransactionInstruction[]> {
    const [authority] = await this.getMarketAuthority();
    const ixs: TransactionInstruction[] = [];

    ixs.push(
      refreshReserveInstruction(
        this.getReserveId(),
        this.getOracleId() ?? null
      ),
      depositReserveLiquidityInstruction(
        amount,
        userLiquidityWallet,
        destinationCollateralWallet,
        this.getReserveId(),
        this.getAssetBalanceId(),
        this.getShareMintId(),
        this.getMarketId(),
        authority,
        userTransferAuthority
      )
    );
    return ixs;
  }

  public async depositObligationCollateral({
    amount,
    userCollateralWallet,
    obligation,
    obligationOwner,
    userTransferAuthority,
  }: {
    amount: BN;
    userCollateralWallet: PublicKey;
    obligation: PublicKey;
    obligationOwner: PublicKey;
    userTransferAuthority: PublicKey;
  }): Promise<TransactionInstruction[]> {
    const [authority] = await this.getMarketAuthority();
    const ixs: TransactionInstruction[] = [];

    ixs.push(
      refreshReserveInstruction(
        this.getReserveId(),
        this.getOracleId() ?? null
      ),
      depositObligationCollateralInstruction(
        amount,
        userCollateralWallet,
        this.getShareBalanceId(),
        this.getReserveId(),
        obligation,
        this.getMarketId(),
        authority,
        obligationOwner,
        userTransferAuthority
      )
    );
    return ixs;
  }

  public async borrowObligationLiquidity({
    amount,
    userWallet,
    owner,
    obligation,
  }: {
    amount: BN;
    userWallet: PublicKey;
    obligation: PublicKey;
    owner: PublicKey;
    userTransferAuthority: PublicKey;
  }): Promise<TransactionInstruction[]> {
    const [authority] = await this.getMarketAuthority();
    const ixs: TransactionInstruction[] = [];

    ixs.push(
      borrowObligationLiquidityInstruction(
        amount,
        this.getAssetBalanceId(),
        userWallet,
        this.getReserveId(),
        this.getFeeBalanceId(),
        obligation,
        this.getMarketId(),
        authority,
        owner
      )
    );
    return ixs;
  }

  public async redeemCollateral({
    amount,
    userCollateralWallet,
    destinationLiquidityWallet,
    userTransferAuthority,
  }: {
    amount: BN;
    userCollateralWallet: PublicKey;
    destinationLiquidityWallet: PublicKey;
    userTransferAuthority: PublicKey;
  }): Promise<TransactionInstruction[]> {
    const [authority] = await this.getMarketAuthority();
    const ixs: TransactionInstruction[] = [];

    ixs.push(
      redeemReserveCollateralInstruction(
        amount,
        userCollateralWallet,
        destinationLiquidityWallet,
        this.getReserveId(),
        this.getShareMintId(),
        this.getAssetBalanceId(),
        this.getMarketId(),
        authority,
        userTransferAuthority
      )
    );
    return ixs;
  }
}

export class ReserveAssetInfo {
  private readonly mintId: MintId;
  private readonly oracleId: OracleId | null;
  private readonly feeAccountId: TokenAccountId;
  private readonly supplyAccountId: TokenAccountId;
  private readonly available: Asset;
  private readonly borrowed: Asset;
  private readonly markPrice: AssetPrice;
  private readonly cumulativeBorrowRate: ExchangeRate;
  private readonly quantityContext: QuantityContext;

  constructor(
    mintId: MintId,
    oracleId: OracleId | null,
    feeBalanceId: TokenAccountId,
    supplyAccountId: TokenAccountId,
    available: Asset,
    borrowed: Asset,
    markPrice: AssetPrice,
    cumulativeBorrowRate: ExchangeRate,
    quantityContext: QuantityContext
  ) {
    this.mintId = mintId;
    this.oracleId = oracleId;
    this.feeAccountId = feeBalanceId;
    this.supplyAccountId = supplyAccountId;
    this.available = available;
    this.borrowed = borrowed;
    this.markPrice = markPrice;
    this.cumulativeBorrowRate = cumulativeBorrowRate;
    this.quantityContext = quantityContext;
  }

  public static fromRaw(raw: ReserveLiquidity): ReserveAssetInfo {
    const mintId = raw.mintPubkey;
    const oracleId =
      raw.oracleOption === 1 ? MintId.of(raw.oraclePubkey) : null;
    const feeAccountId = raw.feeReceiver;
    const supplyBalanceId = raw.supplyPubkey;
    const available = Asset.of(mintId, raw.availableAmount);
    const borrowed = Asset.of(mintId, raw.borrowedAmountWads);
    const markPrice = AssetPrice.of(mintId, raw.marketPrice);
    const cumulativeBorrowRate = raw.cumulativeBorrowRateWads;
    const quantityContext = QuantityContext.fromDecimals(raw.mintDecimals);
    return new ReserveAssetInfo(
      mintId,
      oracleId,
      feeAccountId,
      supplyBalanceId,
      available,
      borrowed,
      markPrice,
      cumulativeBorrowRate,
      quantityContext
    );
  }

  public getMintId(): MintId {
    return this.mintId;
  }

  public getOracleId(): OracleId | null {
    return this.oracleId;
  }

  public getFeeAccountId(): TokenAccountId {
    return this.feeAccountId;
  }

  public getSplAccountId(): TokenAccountId {
    return this.supplyAccountId;
  }

  public getAvailableAsset(): Asset {
    return this.available;
  }

  public getBorrowedAsset(): Asset {
    return this.borrowed;
  }

  public getMarkPrice(): AssetPrice {
    return this.markPrice;
  }

  public getCumulativeBorrowRate(): ExchangeRate {
    return this.cumulativeBorrowRate;
  }

  public getQuantityContext(): QuantityContext {
    return this.quantityContext;
  }
}

export class ReserveTokenInfo {
  private readonly mintId: MintId;
  private readonly splAccountId: TokenAccountId;
  private readonly issuedShare: Share;

  constructor(mintId: MintId, splAccount: TokenAccountId, issuedShare: Share) {
    this.mintId = mintId;
    this.splAccountId = splAccount;
    this.issuedShare = issuedShare;
  }

  public static fromRaw(raw: ReserveCollateral): ReserveTokenInfo {
    const mintId = raw.mintPubkey;
    const splAccountId = raw.supplyPubkey;
    const issuedShare = Share.of(mintId, raw.mintTotalSupply);
    return new ReserveTokenInfo(mintId, splAccountId, issuedShare);
  }

  public getMintId(): MintId {
    return this.mintId;
  }

  public getSplAccountId(): TokenAccountId {
    return this.splAccountId;
  }

  public getIssuedShare(): Share {
    return this.issuedShare;
  }
}

export class ReserveParams {
  loanToValueRatio: Percentage;
  optimalUtilizationRatio: ReserveUtilizationRatio;
  optimalBorrowRate: ReserveBorrowRate;
  minBorrowRate: ReserveBorrowRate;
  maxBorrowRate: ReserveBorrowRate;
  liquidationThreshold: Percentage;
  liquidationPenalty: Percentage;
  borrowFee: Percentage;

  constructor(
    loanToValueRatio: Percentage,
    optimalUtilizationRatio: ReserveUtilizationRatio,
    optimalBorrowRate: ReserveBorrowRate,
    minBorrowRate: ReserveBorrowRate,
    maxBorrowRate: ReserveBorrowRate,
    liquidationThreshold: Percentage,
    liquidationPenalty: Percentage,
    borrowFee: Percentage
  ) {
    this.loanToValueRatio = loanToValueRatio;
    this.optimalUtilizationRatio = optimalUtilizationRatio;
    this.optimalBorrowRate = optimalBorrowRate;
    this.minBorrowRate = minBorrowRate;
    this.maxBorrowRate = maxBorrowRate;
    this.liquidationThreshold = liquidationThreshold;
    this.liquidationPenalty = liquidationPenalty;
    this.borrowFee = borrowFee;
  }

  static fromRaw(mintId: MintId, config: ReserveConfig): ReserveParams {
    const loanToValueRatio = config.loanToValueRatio;
    const optimalUtilizationRatio = new ReserveUtilizationRatio(
      mintId,
      config.optimalUtilizationRate
    );
    const optimalBorrowRate = new ReserveBorrowRate(
      mintId,
      config.optimalBorrowRate
    );
    const minBorrowRate = new ReserveBorrowRate(mintId, config.minBorrowRate);
    const maxBorrowRate = new ReserveBorrowRate(mintId, config.maxBorrowRate);
    const liquidationThreshold = config.liquidationThreshold;
    const liquidationPenalty = config.liquidationBonus;
    const borrowFee = Percentage.fromOneBased(config.fees.borrowFeeWad);
    return new ReserveParams(
      loanToValueRatio,
      optimalUtilizationRatio,
      optimalBorrowRate,
      minBorrowRate,
      maxBorrowRate,
      liquidationThreshold,
      liquidationPenalty,
      borrowFee
    );
  }
}
