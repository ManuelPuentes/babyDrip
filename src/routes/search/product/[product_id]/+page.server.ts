// import type { Product } from '$lib/interfaces/product.interface';
// import { error, fail, type Actions } from '@sveltejs/kit';

// import type { PageServerLoad } from './$types';
// import { getWarehouses } from '$lib/api/getWarehouses.api';
// import type { Warehouse } from '$lib/interfaces/warehouse.interface';
import { getProduct } from '$lib/api/getProduct.api';
import { FilterType } from '$lib/api/queryBuilder.js';
import { superValidate } from 'sveltekit-superforms';
// export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
// 	const { data: product } = await getProduct(supabase, params.product_id);

// 	if (!product) throw error(404, { message: 'product not found' });

// 	const { data: warehouses } = await getWarehouses(supabase);

// 	return { product, warehouses } as { product: Product; warehouses: Array<Warehouse> };
// };

// export const actions: Actions = {
// 	default: async ({ request, locals: { supabase }, params }) => {
// 		const formData = await request.formData();
// 		const data = Object.fromEntries(formData) as {
// 			cost: string;
// 			sold_price: string;
// 			size: string;
// 			warehouse: string;
// 			description: string;
// 		};

// 		const { cost, sold_price, size, warehouse, description } = data;
// 		const errors: Record<string, string> = {};

// 		const { error } = await supabase
// 			.from('products')
// 			.update({
// 				cost: Number(cost),
// 				sold_price: Number(sold_price),
// 				size: String(size),
// 				stored_at: String(warehouse),
// 				description: String(description),
// 				updated_at: new Date().toISOString()
// 			})
// 			.eq('id', params.product_id ?? '');

// 		if (error) {
// 			errors.error = 'update error';
// 			return fail(400, { formData: data, errors });
// 		}

// 		return {
// 			success: true,
// 			message: 'Form submitted successfully!',
// 			formData: data
// 		};
// 	}
// } satisfies Actions; 


import { error, type Actions } from '@sveltejs/kit';
import { productSchema } from '$lib/schemas/productSchema';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { message } from 'sveltekit-superforms';
import { getWarehouses } from '$lib/api/getWarehouses.api';



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

		const { error } = await supabase
			.from('products')
			.update({
				...form,
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
