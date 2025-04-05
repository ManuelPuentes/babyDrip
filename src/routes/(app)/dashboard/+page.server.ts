import { PUBLIC_PAGE_SIZE } from '$env/static/public';
import { getProductsPaginatedData } from '$lib/api/getProductsPaginated.api';
import type { Product } from '$lib/interfaces/product.interface.js';

export const load = async ({ locals: { supabase } }) => {
	const { products, count } = await getProductsPaginatedData(0, supabase);
	const maxPageNumber = count ? Math.ceil(count / Number(PUBLIC_PAGE_SIZE)) : 0;

	return {
		products,
		maxPageNumber,
		pageSize: Number(PUBLIC_PAGE_SIZE)
	} as {
		products: Product[];
		maxPageNumber: number;
		pageSize: number;
	};
};
