import { PUBLIC_PAGE_SIZE } from '$env/static/public';
import type { Warehouse } from '$lib/interfaces/warehouse.interface';

import { error } from '@sveltejs/kit';
import { FilterType } from '$lib/api/queryBuilder';
import { getWarehouse } from '$lib/api/getWarehouse.api';
import { getProductsPaginatedData } from '$lib/api/getProductsPaginated.api';

export const load = async ({ params, locals: { supabase } }) => {
	const { data: warehouse } = await getWarehouse({
		supabase,
		filters: [{ field: 'id', filter: FilterType.EQ, value: params.warehouse_id }]
	});

	if (!warehouse) throw error(404, { message: 'warehouse not found' });

	const { count: products_count, data: products } = await getProductsPaginatedData({
		supabase,
		filters: [
			{ field: 'purchase_order_id', filter: FilterType.IS, value: null },
			{ field: 'stored_at', filter: FilterType.EQ, value: warehouse.id }
		],
		select: ['id', 'cost', 'sold_price', 'size', 'description', 'stored_at'],
		pageNumber: 0
	});

	const maxPageNumber = products_count ? Math.ceil(products_count / Number(PUBLIC_PAGE_SIZE)) : 0;

	return {
		products,
		warehouse,
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
		warehouse: Warehouse;
		maxPageNumber: number;
		pageSize: number;
	};
};
