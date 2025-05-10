import type { Database } from '$lib/supabase/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';
import { buildQueryFilter, type FilterCondition } from './queryBuilder';
import type { Warehouse } from '$lib/interfaces/warehouse.interface';

export const getWarehouse = async ({
	supabase,
	select,
	filters
}: {
	supabase: SupabaseClient<Database>;
	filters?: Array<FilterCondition<Warehouse>>;
	select?: Array<keyof Warehouse>;
}) => {
	const query = buildQueryFilter<Warehouse>({
		supabaseClient: supabase,
		table: 'warehouse',
		select,
		filters
	});

	const { data, error }: { data: Warehouse; error: any } = await query.single();
	return { error, data };
};
