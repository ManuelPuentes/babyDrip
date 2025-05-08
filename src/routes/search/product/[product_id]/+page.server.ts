import type { Product } from '$lib/interfaces/product.interface';
import { error, fail, type Actions } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import { getWarehouses } from '$lib/api/getWarehouses.api';
import type { Warehouse } from '$lib/interfaces/warehouse.interface';
import { getProduct } from '$lib/api/getProduct.api';

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
	const { data: product } = await getProduct(supabase, params.product_id);

	if (!product) throw error(404, { message: 'product not found' });

	const { data: warehouses } = await getWarehouses(supabase);

	return { product, warehouses } as { product: Product; warehouses: Array<Warehouse> };
};

export const actions: Actions = {
	default: async ({ request, locals: { supabase }, params }) => {
		const formData = await request.formData();
		const data = Object.fromEntries(formData) as {
			cost: string;
			sold_price: string;
			size: string;
			warehouse: string;
			description: string;
		};

		const { cost, sold_price, size, warehouse, description } = data;
		const errors: Record<string, string> = {};

		const { error } = await supabase
			.from('products')
			.update({
				cost: Number(cost),
				sold_price: Number(sold_price),
				size: String(size),
				stored_at: String(warehouse),
				description: String(description),
				updated_at: new Date().toISOString()
			})
			.eq('id', params.product_id ?? '');

		if (error) {
			errors.error = 'update error';
			return fail(400, { formData: data, errors });
		}

		return {
			success: true,
			message: 'Form submitted successfully!',
			formData: data
		};
	}
} satisfies Actions;
