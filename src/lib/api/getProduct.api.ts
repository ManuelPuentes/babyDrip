import type { Product } from '$lib/interfaces/product.interface';
import type { Database } from '$lib/supabase/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';
import { buildQueryFilter, type FilterCondition } from './queryBuilder';

export const getProduct = async ({
	supabase,
	select,
	filters
}: {
	supabase: SupabaseClient<Database>;
	filters?: Array<FilterCondition<Product>>;
	select?: Array<keyof Product>;
}) => {

	const query = buildQueryFilter<Product>({
		supabaseClient: supabase,
		table: 'products',
		select,
		filters,
	});

	const { data, error }: { data: Product, error: unknown } = await query.single();
	return { error, data };
};
