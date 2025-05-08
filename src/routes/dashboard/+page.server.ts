import { PUBLIC_PAGE_SIZE } from '$env/static/public';
import { getProductsPaginatedData } from '$lib/api/getProductsPaginated.api';
import { getWarehouses } from '$lib/api/getWarehouses.api';
import type { Product } from '$lib/interfaces/product.interface.js';
import type { Warehouse } from '$lib/interfaces/warehouse.interface';

export const load = async ({ locals: { supabase } }) => {
	const { count, products } = await getProductsPaginatedData(0, supabase);
	const { data: warehouses } = await getWarehouses(supabase);
	const maxPageNumber = count ? Math.ceil(count / Number(PUBLIC_PAGE_SIZE)) : 0;

	return {
		products,
		warehouses,
		maxPageNumber,
		pageSize: Number(PUBLIC_PAGE_SIZE)
	} as {
		products: Array<Product>;
		warehouses: Array<Warehouse>;
		maxPageNumber: number;
		pageSize: number;
	};
};
