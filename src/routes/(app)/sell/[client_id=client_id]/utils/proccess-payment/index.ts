import { PaymentCurrenciesEnum } from '$lib/enums/allowed_payments_currencies.enum';
import { VESPaymentStrategy } from './estategies';

export const calculatePaymentDetails = async ({
	total,
	payment_per_currency
}: {
	total: number;
	payment_per_currency: Record<PaymentCurrenciesEnum, number>;
}) => {
	const details: Record<string, { value: number; exchange: number }> = {};

	await Promise.all(
		Object.entries(payment_per_currency).map(async ([key, value]: [string, number]) => {
			switch (key) {
				case PaymentCurrenciesEnum.VES:
					const strategy = await VESPaymentStrategy.create();
					const exchange: number = strategy.exchange(value);

					total -= exchange;
					details[PaymentCurrenciesEnum.VES] = { value, exchange };
					break;
				default:
					break;
			}
		})
	);

	details[PaymentCurrenciesEnum.USD] = { value: total, exchange: total };

	return details;
};
