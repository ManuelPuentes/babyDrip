import type { SupabaseClient } from '@supabase/supabase-js';

export const getWarehouses = async (supabase: SupabaseClient) => {
    const { data, error } = await supabase
        .from('warehouse')
        .select('id,name');
    return { data: (data) ? data : [], error };
};