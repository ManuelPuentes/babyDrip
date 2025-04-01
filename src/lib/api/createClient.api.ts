import type { Client } from '$lib/interfaces/client.interface';
import type { Database } from '$lib/supabase/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

export const createClient = async (supabase: SupabaseClient<Database>, client: Client) => {
	const { data, error } = await supabase
		.from('client')
		.insert({
			lastname: client.lastname,
			name: client.name,
			phone: client.phone
		})
		.select()
		.single();

	return { client: data, error };
};
