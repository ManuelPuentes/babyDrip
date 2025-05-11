import type { Client } from '$lib/interfaces/client.interface';
import type { Database } from '$lib/supabase/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';
import { buildQueryFilter, type FilterCondition } from './queryBuilder';

export const getClient = async ({
	supabase,
	select,
	filters
}: {
	supabase: SupabaseClient<Database>;
	filters?: Array<FilterCondition<Client>>;
	select?: Array<keyof Client>;
}) => {
	const query = buildQueryFilter<Client>({
		supabaseClient: supabase,
		table: 'client',
		select,
		filters
	});

	const { data, error }: { data: Client; error: any } = await query.single();
	return { error, data };
};
