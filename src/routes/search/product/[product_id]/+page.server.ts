import { error, type Actions, fail } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate } from 'sveltekit-superforms';

import { getProduct } from '$lib/api/getProduct.api';
import { getWarehouses } from '$lib/api/getWarehouses.api';
import { productSchema } from '$lib/schemas/productSchema';
import { FilterType } from '$lib/api/queryBuilder.js';

export const load = async ({ params, locals: { supabase } }) => {

	const { data: product } = await getProduct({
		supabase,
		select: ['id', 'cost', 'sold_price', 'stored_at', 'description', 'size'],
		filters: [{ field: 'id', filter: FilterType.EQ, value: params.product_id }],
	});

	const { data: warehouses } = await getWarehouses({
		supabase
	});

	if (!product) throw error(404, { message: 'product not found' });


	const form = await superValidate(product, zod(productSchema));

	return { form, product, warehouses };
};

export const actions = {
	default: async ({ request, locals: { supabase }, params }) => {
		const form = await superValidate(request, zod(productSchema));

		if (!params.product_id) {

			return message(form, {
				text: 'invalid request cannot update uknown product',
				type: 'error',
				status: 403
			});
		}

		if (!form.valid) {
			return fail(400, { form });
		}


		console.log(form);


		const { error } = await supabase
			.from('products')
			.update({
				...form.data,
				updated_at: new Date().toISOString()
			})
			.eq('id', params.product_id);


		if (error) {
			return message(form, {
				text: 'update error',
				type: 'error',
				status: 403
			});
		}

		return message(form, {
			status: 200,
			type: 'success',
			text: 'product successfully updated'
		});
	}
} satisfies Actions; 
