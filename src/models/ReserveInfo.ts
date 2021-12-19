import {ReserveId} from './ReserveId';
import {Asset} from './Asset';
import {Share} from './Share';
import {ExchangeRatio} from './ExchangeRatio';
import {ReserveUtilizationRatio} from './ReserveUtilizationRatio';
import {BorrowApy} from './BorrowApy';
import {ReserveBorrowRate} from './ReserveBorrowRate';
import Big from 'big.js';
import {AssetId} from './AssetId';
import {SupplyApy} from './SupplyApy';
import {LoanToValueRatio} from './LoanToValueRatio';
import {
  ReserveCollateral,
  ReserveConfig,
  ReserveData,
  ReserveLiquidity,
} from '../structs/ReserveData';
import {Wads} from './Wads';
import {ShareId} from './ShareId';
import {OracleId} from './OracleId';
import {MarketId} from './MarketId';
import {Balance} from './Balance';
import {BalanceId} from './BalanceId';
import {Percentage} from './Percentage';
import {AssetPrice} from './AssetPrice';
import {AssetQuantityContext} from './AssetQuantityContext';
import {AssetValue} from './AssetValue';
import {ParsedAccount} from '../parsers/ParsedAccount';
import {PublicKey, TransactionInstruction} from '@solana/web3.js';
import BN from 'bn.js';
import {
  borrowObligationLiquidityInstruction,
  depositObligationCollateralInstruction,
  depositReserveLiquidityInstruction,
  refreshReserveInstruction,
} from '../instructions';
import {PORT_LENDING} from '../constants';

// abstract a reserve
export class ReserveInfo {
  private readonly reserveId: ReserveId;
  readonly marketId: MarketId;
  readonly asset: ReserveAssetInfo;
  readonly share: ReserveTokenInfo;
  readonly params: ReserveParams;
  readonly stakingPool: PublicKey | null;

  constructor(
      reserveId: ReserveId,
      marketId: MarketId,
      asset: ReserveAssetInfo,
      share: ReserveTokenInfo,
      params: ReserveParams,
      stakingPool: PublicKey | null,
  ) {
    this.reserveId = reserveId;
    this.marketId = marketId;
    this.asset = asset;
    this.share = share;
    this.params = params;
    this.stakingPool = stakingPool;
  }

  public static fromRaw(account: ParsedAccount<ReserveData>): ReserveInfo {
    const id = new ReserveId(account.pubkey);
    const marketId = MarketId.of(account.data.lendingMarket);
    const asset = ReserveAssetInfo.fromRaw(account.data.liquidity);
    const token = ReserveTokenInfo.fromRaw(account.data.collateral);
    const params = ReserveParams.fromRaw(
        asset.getAssetId(),
        account.data.config,
    );
    const reserveStakingPool =
      account.data.config.stakingPoolOption === 0 ? null : account.data.config.stakingPool;
    return new ReserveInfo(
        id,
        marketId,
        asset,
        token,
        params,
        reserveStakingPool,
    );
  }

  public getReserveId(): ReserveId {
    return this.reserveId;
  }

  public getMarketId(): MarketId {
    return this.marketId;
  }

  public getAssetId(): AssetId {
    return this.asset.getAssetId();
  }

  public getAssetBalanceId(): BalanceId {
    return this.asset.getBalanceId();
  }

  public getShareId(): ShareId {
    return this.share.getShareId();
  }

  public getShareBalanceId(): BalanceId {
    return this.share.getShareBalanceId();
  }

  public getOracleId(): OracleId | null {
    return this.asset.getOracleId();
  }

  public getFeeBalanceId(): BalanceId {
    return this.asset.getFeeBalanceId();
  }

  public getMarketCap(): AssetValue {
    return new AssetValue(
        this.getAssetId(),
        this.getTotalAsset().toValue(
            this.getMarkPrice(),
            this.getQuantityContext(),
        ),
    );
  }

  public getTotalAsset(): Asset {
    return this.getAvailableAsset().add(this.getBorrowedAsset());
  }

  public getAvailableAssetValue(): AssetValue {
    return new AssetValue(
        this.getAssetId(),
        this.getAvailableAsset().toValue(
            this.getMarkPrice(),
            this.getQuantityContext(),
        ),
    );
  }

  public getAvailableAsset(): Asset {
    return this.asset.getAvailableAsset();
  }

  public getBorrowedAssetValue(): AssetValue {
    return new AssetValue(
        this.getAssetId(),
        this.getBorrowedAsset().toValue(
            this.getMarkPrice(),
            this.getQuantityContext(),
        ),
    );
  }

  public getBorrowedAsset(): Asset {
    return this.asset.getBorrowedAsset();
  }

  public getQuantityContext(): AssetQuantityContext {
    return this.asset.getQuantityContext();
  }

  public getMarkPrice(): AssetPrice {
    return this.asset.getMarkPrice();
  }

  public getExchangeRatio(): ExchangeRatio {
    const asset = this.getTotalAsset();
    const share = this.share.getIssuedShare();

    const assetId = asset.getAssetId();
    const shareId = share.getShareId();
    if (asset.isZero()) {
      return new ExchangeRatio(shareId, assetId);
    }
    const ratio = share.getRaw().div(asset.getRaw());
    return new ExchangeRatio(shareId, assetId, ratio);
  }

  public getUtilizationRatio(): ReserveUtilizationRatio {
    const total = this.getTotalAsset();
    if (total.isZero()) {
      return ReserveUtilizationRatio.na(total.mintId);
    }

    const pct = this.getBorrowedAsset().getRaw().div(total.getRaw());
    return new ReserveUtilizationRatio(total.mintId, pct);
  }

  public getSupplyApy(): SupplyApy {
    const utilizationRatio = this.getUtilizationRatio();
    const borrowApy = this.getBorrowApy();
    const assetId = utilizationRatio.getAssetId();

    if (!utilizationRatio.isPresent() || !borrowApy.isPresent()) {
      return SupplyApy.na(assetId);
    }

    const utilizationRatioRaw = utilizationRatio.getUnchecked();
    const borrowApyRaw = borrowApy.getUnchecked();
    return new SupplyApy(assetId, utilizationRatioRaw.mul(borrowApyRaw));
  }

  public getBorrowApy(): BorrowApy {
    const params = this.params;
    const utilizationRatio = this.getUtilizationRatio();
    const optimalUtilizationRatio = params.optimalUtilizationRatio;
    const optimalBorrowRate = params.optimalBorrowRate;
    const assetId = utilizationRatio.getAssetId();

    if (
      !utilizationRatio.isPresent() ||
      !optimalUtilizationRatio.isPresent() ||
      !optimalBorrowRate.isPresent()
    ) {
      return BorrowApy.na(assetId);
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
        return BorrowApy.na(assetId);
      }

      const minBorrowRateRaw = minBorrowRate.getUnchecked();
      const normalizedFactor = utilizationRatioRaw.div(
          optimalUtilizationRatioRaw,
      );
      const borrowRateDiff = optimalBorrowRateRaw.sub(minBorrowRateRaw);
      return new BorrowApy(
          assetId,
          normalizedFactor.mul(borrowRateDiff).add(minBorrowRateRaw),
      );
    }

    const maxBorrowRate = params.maxBorrowRate;
    if (!maxBorrowRate.isPresent()) {
      return BorrowApy.na(assetId);
    }

    const maxBorrowRateRaw = maxBorrowRate.getUnchecked();
    const normalizedFactor = utilizationRatioRaw
        .sub(optimalUtilizationRatioRaw)
        .div(new Big(1).sub(optimalUtilizationRatioRaw));
    const borrowRateDiff = maxBorrowRateRaw.sub(optimalBorrowRateRaw);

    return new BorrowApy(
        assetId,
        normalizedFactor.mul(borrowRateDiff).add(optimalBorrowRateRaw),
    );
  }

  public async getMarketAuthority(): Promise<[PublicKey, number]> {
    return await PublicKey.findProgramAddress(
        [this.getMarketId().key.toBuffer()],
        PORT_LENDING,
    );
  }

  public async depositReserve(
      {
        amount,
        userLiquidityWallet,
        destinationCollateralWallet,
        userTransferAuthority,
      }:{
      amount: BN;
      userLiquidityWallet: PublicKey;
      destinationCollateralWallet: PublicKey;
      userTransferAuthority: PublicKey;
      },
  ): Promise<TransactionInstruction[]> {
    const [authority] = await this.getMarketAuthority();
    const ixs: TransactionInstruction[] = [];

    ixs.push(
        refreshReserveInstruction(
            this.getReserveId().key,
            this.getOracleId()?.key ?? null,
        ),
        depositReserveLiquidityInstruction(
            amount,
            userLiquidityWallet,
            destinationCollateralWallet,
            this.getReserveId().key,
            this.getAssetBalanceId().key,
            this.getShareId().key,
            this.getMarketId().key,
            authority,
            userTransferAuthority,
        ),
    );
    return ixs;
  }

  public async depositObligationCollateral(
      {
        amount,
        userCollateralWallet,
        obligation,
        obligationOwner,
        userTransferAuthority,
      }:{
      amount: BN;
      userCollateralWallet: PublicKey;
      obligation: PublicKey;
      obligationOwner: PublicKey;
      userTransferAuthority: PublicKey;
      },
  ): Promise<TransactionInstruction[]> {
    const [authority] = await this.getMarketAuthority();
    const ixs: TransactionInstruction[] = [];

    ixs.push(
        refreshReserveInstruction(
            this.getReserveId().key,
            this.getOracleId()?.key ?? null,
        ),
        depositObligationCollateralInstruction(
            amount,
            userCollateralWallet,
            this.getShareBalanceId().key,
            this.getReserveId().key,
            obligation,
            this.getMarketId().key,
            authority,
            obligationOwner,
            userTransferAuthority,
        ),
    );
    return ixs;
  }

  public async borrowObligationLiquidity(
      {
        amount,
        userWallet,
        owner,
        obligation,
      }:{
      amount: BN;
      userWallet: PublicKey;
      obligation: PublicKey;
      owner: PublicKey;
      userTransferAuthority: PublicKey;
      },
  ): Promise<TransactionInstruction[]> {
    const [authority] = await this.getMarketAuthority();
    const ixs: TransactionInstruction[] = [];

    ixs.push(
        borrowObligationLiquidityInstruction(
            amount,
            this.getAssetBalanceId().key,
            userWallet,
            this.getReserveId().key,
            this.getFeeBalanceId().key,
            obligation,
            this.getMarketId().key,
            authority,
            owner,
        ),
    );
    return ixs;
  }
}

export class ReserveAssetInfo {
  private readonly assetId: AssetId;
  private readonly oracleId: OracleId | null;
  private readonly feeBalanceId: BalanceId;
  private readonly balance: Balance<Asset>;
  private readonly borrowed: Asset;
  private readonly markPrice: AssetPrice;
  private readonly quantityContext: AssetQuantityContext;

  constructor(
      assetId: AssetId,
      oracleId: OracleId | null,
      feeBalanceId: BalanceId,
      balance: Balance<Asset>,
      borrowed: Asset,
      markPrice: AssetPrice,
      quantityContext: AssetQuantityContext,
  ) {
    this.assetId = assetId;
    this.oracleId = oracleId;
    this.feeBalanceId = feeBalanceId;
    this.balance = balance;
    this.borrowed = borrowed;
    this.markPrice = markPrice;
    this.quantityContext = quantityContext;
  }

  public static fromRaw(raw: ReserveLiquidity): ReserveAssetInfo {
    const assetId = AssetId.fromKey(raw.mintPubkey);
    const native = assetId.isNative();
    const oracleId =
      raw.oracleOption === 1 ? AssetId.fromKey(raw.oraclePubkey) : null;
    const feeBalanceId = new BalanceId(raw.feeReceiver, native);
    const balanceId = new BalanceId(raw.supplyPubkey, native);
    const lamport = new Asset(assetId, new Big(raw.availableAmount.toString()));
    const balance = new Balance(balanceId, lamport);
    const borrowed = new Asset(
        assetId,
        new Wads(raw.borrowedAmountWads).toBig(),
    );
    const markPrice = AssetPrice.of(assetId, new Wads(raw.marketPrice).toBig());
    const quantityContext = AssetQuantityContext.fromDecimals(raw.mintDecimals);
    return new ReserveAssetInfo(
        assetId,
        oracleId,
        feeBalanceId,
        balance,
        borrowed,
        markPrice,
        quantityContext,
    );
  }

  public getAssetId(): AssetId {
    return this.assetId;
  }

  public getOracleId(): OracleId | null {
    return this.oracleId;
  }

  public getBalanceId(): BalanceId {
    return this.balance.getBalanceId();
  }

  public getFeeBalanceId(): BalanceId {
    return this.feeBalanceId;
  }

  public getAvailableAsset(): Asset {
    return this.balance.getAmount();
  }

  public getBorrowedAsset(): Asset {
    return this.borrowed;
  }

  public getMarkPrice(): AssetPrice {
    return this.markPrice;
  }

  public getQuantityContext(): AssetQuantityContext {
    return this.quantityContext;
  }
}

export class ReserveTokenInfo {
  private readonly shareId: ShareId;
  readonly balance: Balance<Share>;

  constructor(shareId: ShareId, balance: Balance<Share>) {
    this.shareId = shareId;
    this.balance = balance;
  }

  public static fromRaw(raw: ReserveCollateral): ReserveTokenInfo {
    const shareId = new ShareId(raw.mintPubkey);
    const balanceId = new BalanceId(raw.supplyPubkey, false);
    const lamport = new Share(shareId, new Big(raw.mintTotalSupply.toString()));
    const balance = new Balance(balanceId, lamport);
    return new ReserveTokenInfo(shareId, balance);
  }

  public getShareId(): ShareId {
    return this.shareId;
  }

  public getShareBalanceId(): BalanceId {
    return this.getBalance().getBalanceId();
  }

  public getIssuedShare(): Share {
    return this.getBalance().getAmount();
  }

  public getBalance(): Balance<Share> {
    return this.balance;
  }
}

export class ReserveParams {
  loanToValueRatio: LoanToValueRatio;
  optimalUtilizationRatio: ReserveUtilizationRatio;
  optimalBorrowRate: ReserveBorrowRate;
  minBorrowRate: ReserveBorrowRate;
  maxBorrowRate: ReserveBorrowRate;
  liquidationThreshold: Percentage;
  liquidationPenalty: Percentage;

  constructor(
      loanToValueRatio: LoanToValueRatio,
      optimalUtilizationRatio: ReserveUtilizationRatio,
      optimalBorrowRate: ReserveBorrowRate,
      minBorrowRate: ReserveBorrowRate,
      maxBorrowRate: ReserveBorrowRate,
      liquidationThreshold: Percentage,
      liquidationPenalty: Percentage,
  ) {
    this.loanToValueRatio = loanToValueRatio;
    this.optimalUtilizationRatio = optimalUtilizationRatio;
    this.optimalBorrowRate = optimalBorrowRate;
    this.minBorrowRate = minBorrowRate;
    this.maxBorrowRate = maxBorrowRate;
    this.liquidationThreshold = liquidationThreshold;
    this.liquidationPenalty = liquidationPenalty;
  }

  static fromRaw(assetId: AssetId, config: ReserveConfig): ReserveParams {
    const loanToValueRatio = new LoanToValueRatio(
        assetId,
        new Big(config.loanToValueRatio).div(100),
    );
    const optimalUtilizationRatio = new ReserveUtilizationRatio(
        assetId,
        new Big(config.optimalUtilizationRate).div(100),
    );
    const optimalBorrowRate = new ReserveBorrowRate(
        assetId,
        new Big(config.optimalBorrowRate).div(100),
    );
    const minBorrowRate = new ReserveBorrowRate(
        assetId,
        new Big(config.minBorrowRate).div(100),
    );
    const maxBorrowRate = new ReserveBorrowRate(
        assetId,
        new Big(config.minBorrowRate).div(100),
    );
    const liquidationThreshold = new Percentage(
        new Big(config.liquidationThreshold).div(100),
    );
    const liquidationPenalty = new Percentage(
        new Big(config.liquidationBonus).div(100),
    );
    return new ReserveParams(
        loanToValueRatio,
        optimalUtilizationRatio,
        optimalBorrowRate,
        minBorrowRate,
        maxBorrowRate,
        liquidationThreshold,
        liquidationPenalty,
    );
  }
}
