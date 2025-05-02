import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getTasaBCV } from '$lib/api/getTasaBcv.api';

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
		const productsId = JSON.parse(String(data.productsId));

		const total = Number(data.total);
		const acceptBs = Boolean(data.accept_bs)
		const partialOnInvoice = Number(data.partial_on_invoice)



		console.log(total);
		console.log(partialOnInvoice);
		console.log(acceptBs);




		if (total == 0) errors.total = 'total price cant be 0';
		if (productsId.length == 0) errors.products = 'products cant be 0';

		if (Object.keys(errors).length > 0) {
			return fail(400, { errors });
		}

		return {
			success: true,
		};

		// const { error } = await supabase
		// 	.from('sell')
		// 	.insert({
		// 		client: clientId,
		// 		seller: sellerId,
		// 		total
		// 	})
		// 	.select()
		// 	.single()
		// 	.then(({ data: sell }) => {
		// 		return supabase
		// 			.from('products')
		// 			.update({
		// 				sell_id: sell?.id
		// 			})
		// 			.in('id', productsId);
		// 	});

		// if (error) {
		// 	errors.update = 'error updating products data';

		// 	console.log(error);

		// 	// errors.error = error;
		// 	return fail(400, { errors });
		// }

		// return {
		// 	success: true,
		// 	errors: {},
		// 	message: 'Form submitted successfully!'
		// };
	}
} satisfies Actions;
