import type { SupabaseClient } from '@supabase/supabase-js';

export const getWarehouse = async (supabase: SupabaseClient, wareHouseId: string) => {
	const { data, error } = await supabase
		.from('warehouse')
		.select('id,  name')
		.eq('id', wareHouseId)
		.single();

	return { data, error };
};
