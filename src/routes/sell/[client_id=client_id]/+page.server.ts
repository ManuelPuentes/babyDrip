import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getTasaBCV } from '$lib/api/getTasaBcv.api';
import { calculatePaymentDetails } from './utils/proccess-payment';

export const load: PageServerLoad = async ({ params, locals: { user, supabase } }) => {
	const { data: seller } = await supabase
		.from('user')
		.select()
		.eq('email', user?.email ?? '')
		.single();

	const { data: client } = await supabase
		.from('client')
		.select()
		.eq('id', params.client_id)
		.single();

	const tasaBCV = await getTasaBCV();

	if (!seller) throw error(404, { message: 'seller not found' });
	if (!client) throw error(404, { message: 'client not found' });
	if (!tasaBCV) throw error(404, { message: 'la tasa bcv no fue obtenida' });

	return { client, seller, tasaBCV };
};

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const data = Object.fromEntries(formData);
		const errors: Record<string, string> = {};

		const clientId = String(data.clientId);
		const sellerId = String(data.sellerId);
		const productsId = JSON.parse(data.productsId as string);

		const total = Number(data.total);
		const paymentPerCurrency = JSON.parse(data.paymentPerCurrency as string);

		if (total == 0) errors.total = 'total price cant be 0';
		if (productsId.length == 0) errors.products = 'products cant be 0';

		if (Object.keys(errors).length > 0) {
			return fail(400, { errors });
		}

		try {
			const payment_details = await calculatePaymentDetails({
				payment_per_currency: paymentPerCurrency,
				total
			});

			const { error } = await supabase.rpc('create_purchase_order', {
				client_id: clientId,
				seller_id: sellerId,
				total,
				payment_details,
				product_ids: productsId
			});

			if (error) {
				errors.update = 'error creating purchase order';
				return fail(400, { errors });
			}

			return {
				success: true,
				result: {
					payment_details,
					total
				}
			};
		} catch {
			return fail(500, {
				error: {
					message: 'Server error during sell'
				}
			});
		}
	}
} satisfies Actions;
