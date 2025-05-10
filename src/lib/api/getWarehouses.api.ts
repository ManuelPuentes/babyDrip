import type { Database } from '$lib/supabase/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';
import { buildQueryFilter, type FilterCondition } from './queryBuilder';
import type { Warehouse } from '$lib/interfaces/warehouse.interface';

export const getWarehouses = async ({
	supabase,
	filters,
	select
}: {
	supabase: SupabaseClient<Database>;
	filters?: Array<FilterCondition<Warehouse>>;
	select?: Array<keyof Warehouse>;
}) => {
	const query = buildQueryFilter<Warehouse>({
		supabaseClient: supabase,
		table: 'warehouse',
		filters,
		select,
		count: 'exact'
	});

	const { data, count }: { data: Array<Partial<Warehouse>>; count: number } = await query;
	return { data, count };
};
