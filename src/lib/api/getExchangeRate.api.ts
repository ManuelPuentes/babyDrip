import { PaymentCurrenciesEnum } from '$lib/enums/allowed_payments_currencies.enum';
import { EXCHANGE_API_KEY } from '$env/static/private';

export async function getExchangeRate(currency: PaymentCurrenciesEnum) {
	const url = `https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/pair/USD/${currency}`;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		const data = await response.json();
		return data.conversion_rate;
	} catch {
		return null;
	}
}
