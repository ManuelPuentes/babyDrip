import type { Database } from "$lib/supabase/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

export const createSell = async (supabase: SupabaseClient<Database>, clientId: string, sellerId: string, total: number) => {

    const { data, error } = await supabase.from('sell').insert({
        client: clientId,
        seller: sellerId,
        total
    })
        .select().single();

    return { sell: data, error };
}