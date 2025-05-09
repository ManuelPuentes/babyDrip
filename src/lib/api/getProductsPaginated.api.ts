import { PUBLIC_PAGE_SIZE } from '$env/static/public';
import type { Product } from '$lib/interfaces/product.interface';
import type { Database } from '$lib/supabase/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';
import { buildQueryFilter, type FilterCondition } from './queryBuilder';

export const getProductsPaginatedData = async ({
	supabase,
	pageNumber,
	select,
	filters
}: {
	supabase: SupabaseClient<Database>;
	filters?: Array<FilterCondition<Product>>;
	select?: Array<keyof Product>;
	pageNumber: number;
}) => {
	const pageSize = Number(PUBLIC_PAGE_SIZE);
	const offset = pageNumber * pageSize;
	const limit = (pageNumber + 1) * pageSize - 1;

	const query = buildQueryFilter<Product>({
		supabaseClient: supabase,
		table: 'products',
		select,
		filters,
		count: 'exact'
	});

	const { data, count }: { data: Array<Partial<Product>>; count: number } = await query.range(
		offset,
		limit
	);

	return { data, count };
};
