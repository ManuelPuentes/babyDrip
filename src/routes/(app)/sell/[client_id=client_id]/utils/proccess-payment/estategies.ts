import { getExchangeRate } from '$lib/api/getExchangeRate.api';
import { PaymentCurrenciesEnum } from '$lib/enums/allowed_payments_currencies.enum';

interface PaymentStrategy {
	exchange(amount: number): number;
	getCurrencyCode(): string;
}

abstract class BasePaymentStrategy implements PaymentStrategy {
	protected exchangeRate: number | undefined;
	protected abstract currencyCode: string;

	exchange(amount: number): number {
		if (!this.exchangeRate) {
			throw new Error('Exchange rate not initialized');
		}
		return Math.floor((amount * 100) / this.exchangeRate);
	}

	getCurrencyCode(): string {
		return this.currencyCode;
	}
}

export class USDPaymentStrategy extends BasePaymentStrategy {
	protected readonly currencyCode = PaymentCurrenciesEnum.USD;
	private constructor(exchangeRate: number) {
		super();
		this.exchangeRate = exchangeRate;
	}

	static create(): USDPaymentStrategy {
		return new USDPaymentStrategy(100);
	}

	getCurrencyCode(): string {
		return this.currencyCode;
	}
}

export class VESPaymentStrategy extends BasePaymentStrategy {
	protected readonly currencyCode = PaymentCurrenciesEnum.VES;

	private constructor(exchangeRate: number) {
		super();
		this.exchangeRate = exchangeRate;
	}

	static async create(): Promise<VESPaymentStrategy> {
		try {
			const exchangeRate = await getExchangeRate(PaymentCurrenciesEnum.VES);
			if (!exchangeRate) {
				throw new Error('Failed to fetch VES exchange rate');
			}
			return new VESPaymentStrategy(exchangeRate);
		} catch (error) {
			throw new Error(
				`Could not create VESPaymentStrategy: ${error instanceof Error ? error.message : String(error)}`
			);
		}
	}
}

export class COPPaymentStrategy extends BasePaymentStrategy {
	protected readonly currencyCode = PaymentCurrenciesEnum.COP;

	private constructor(exchangeRate: number) {
		super();
		this.exchangeRate = exchangeRate;
	}

	static async create(): Promise<COPPaymentStrategy> {
		try {
			const exchangeRate = await getExchangeRate(PaymentCurrenciesEnum.COP);
			if (!exchangeRate) {
				throw new Error('Failed to fetch VES exchange rate');
			}
			return new COPPaymentStrategy(exchangeRate);
		} catch (error) {
			throw new Error(
				`Could not create VESPaymentStrategy: ${error instanceof Error ? error.message : String(error)}`
			);
		}
	}
}
