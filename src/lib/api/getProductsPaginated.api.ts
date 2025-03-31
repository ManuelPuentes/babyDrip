import { PUBLIC_PAGE_SIZE } from '$env/static/public';
import type { SupabaseClient } from '@supabase/supabase-js';

export const getProductsPaginatedData = async (pageNumber: number, supabase: SupabaseClient) => {

    const pageSize = Number(PUBLIC_PAGE_SIZE);
    const offset = pageNumber * pageSize;
    const limit = (pageNumber + 1) * pageSize - 1;
    const { data, error } = await supabase
        .from('products')
        .select('id,  description, size, sold_price, cost')
        .is('sell_id', null)
        .range(offset, limit);


    return data ? data : [];
};