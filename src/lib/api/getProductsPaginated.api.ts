import { PUBLIC_PAGE_SIZE } from '$env/static/public';
import type { Product } from '$lib/interfaces/product.interface';
import type { SupabaseClient } from '@supabase/supabase-js';

export const getProductsPaginatedData = async (pageNumber: number, supabase: SupabaseClient, filters?: Partial<Product>) => {
	const pageSize = Number(PUBLIC_PAGE_SIZE);
	const offset = pageNumber * pageSize;
	const limit = (pageNumber + 1) * pageSize - 1;

	if (filters) {
		const { data, count } = await supabase
			.from('products')
			.select('id,  description, size, sold_price, cost, stored_at', { count: 'exact' })
			.is('purchase_order_id', null)
			.match(filters)
			.range(offset, limit);

		return data ? { products: data, count } : { products: [], count: 0 };

	} else {
		const { data, count } = await supabase
			.from('products')
			.select('id,  description, size, sold_price, cost, stored_at', { count: 'exact' })
			.is('purchase_order_id', null)
			.range(offset, limit);
		return data ? { products: data, count } : { products: [], count: 0 };

	}

};




