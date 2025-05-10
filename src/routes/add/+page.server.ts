import { error, type Actions, fail } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate } from 'sveltekit-superforms';

import { getProduct } from '$lib/api/getProduct.api';
import { getWarehouses } from '$lib/api/getWarehouses.api';
import { productSchema } from '$lib/schemas/productSchema';
import { FilterType } from '$lib/api/queryBuilder.js';

export const load = async ({ locals: { supabase } }) => {
	const form = await superValidate(zod(productSchema));

	const { data: warehouses } = await getWarehouses({
		supabase
	});

	return { form, warehouses };
};

export const actions = {
	default: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(productSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { cost, sold_price } = form.data;

		try {
			await supabase
				.from('products')
				.insert({ ...form.data, cost: cost * 100, sold_price: sold_price * 100 })
				.throwOnError();
		} catch {

			return message(form, {
				text: 'create product error',
				type: 'error',
				status: 403
			});
		}

		return message(form, {
			status: 200,
			type: 'success',
			text: 'product successfully added'
		});
	}
} satisfies Actions;
