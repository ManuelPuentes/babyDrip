import { getProduct } from '$lib/api/getProduct.api';
import type { Product } from '$lib/interfaces/product.interface';
import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
	const { data: product } = await getProduct(supabase, params.product_id);

	if (!product) throw error(404, { message: 'product not found' });

	return { product } as { product: Product };
};
