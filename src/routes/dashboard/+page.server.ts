import { PUBLIC_PAGE_SIZE } from '$env/static/public';
import { getProductsPaginatedData } from '$lib/api/getProductsPaginated.api';
import { getWarehouses } from '$lib/api/getWarehouses.api';
import { FilterType } from '$lib/api/queryBuilder';
import type { Warehouse } from '$lib/interfaces/warehouse.interface';

export const load = async ({ locals: { supabase } }) => {
	const { count: products_count, data: products } = await getProductsPaginatedData({
		supabase,
		filters: [{ field: 'purchase_order_id', filter: FilterType.IS, value: null }],
		select: ['id', 'cost', 'sold_price', 'size', 'description', 'stored_at'],
		pageNumber: 0
	});

	const { data: warehouses } = await getWarehouses({
		supabase
	});

	const maxPageNumber = products_count ? Math.ceil(products_count / Number(PUBLIC_PAGE_SIZE)) : 0;

	return {
		products,
		warehouses,
		maxPageNumber,
		pageSize: Number(PUBLIC_PAGE_SIZE)
	} as {
		products: Array<{
			id: string;
			cost: number;
			sold_price: number;
			size: string;
			description: string;
			stored_at: string;
		}>;
		warehouses: Array<Warehouse>;
		maxPageNumber: number;
		pageSize: number;
	};
};
