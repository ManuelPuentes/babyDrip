import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getWarehouse } from '$lib/api/getWarehouse.api';
import type { Warehouse } from '$lib/interfaces/warehouse.interface';
import { PUBLIC_PAGE_SIZE } from '$env/static/public';
import type { Product } from '$lib/interfaces/product.interface';
import { getProductsPaginatedData } from '$lib/api/getProductsPaginated.api';

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
	const { data: warehouse } = await getWarehouse(supabase, params.warehouse_id);

	if (!warehouse) throw error(404, { message: 'warehouse not found' });

	const { count, products } = await getProductsPaginatedData(0, supabase, {
		stored_at: params.warehouse_id
	});

	const maxPageNumber = count ? Math.ceil(count / Number(PUBLIC_PAGE_SIZE)) : 0;

	return { warehouse, maxPageNumber, pageSize: Number(PUBLIC_PAGE_SIZE), products } as {
		warehouse: Warehouse;
		maxPageNumber: number;
		pageSize: number;
		products: Array<Product>;
	};
};
