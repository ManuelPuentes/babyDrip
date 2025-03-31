import type { SupabaseClient } from '@supabase/supabase-js';

export const getProduct = async (supabase: SupabaseClient, productId: string) => {
    const { data, error } = await supabase
        .from('products')
        .select('id,  description, size, sold_price')
        .eq('id', productId)
        .eq('on_stock', true)
        .single();

    return { data, error };
};