import type { Client } from '$lib/interfaces/client.interface';
import type { Database } from '$lib/supabase/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

export const getClient = async (supabase: SupabaseClient<Database>, client: Client) => {
	const { data, error } = await supabase.from('client').select().eq('phone', client.phone).single();

	return { client: data, error };
};
