import type { Client } from "$lib/interfaces/client.interface";
import type { Product } from "$lib/interfaces/product.interface";
import { type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "$lib/supabase/supabase";
import { createClient } from "./createClient.api";
import { createSell } from "./createSell.api";

export const proccessSell = async (supabase: SupabaseClient, data: generateSell,) => {

    try {
        const client = await validateClient(supabase, data.client);
        const seller = await validateSeller(supabase, data.sellerEmail);

        if (client && seller) {

            const { sell: _newSell } = await createSell(supabase, client.id, seller.id, data.total);

            if (_newSell) {
                await updateProducts(supabase, data.products, _newSell.id);
            }
        }

    } catch (error) {

    }
}


const validateClient = async (supabase: SupabaseClient<Database>, client: Client) => {
    const { data: _client } = await supabase.from('client').select().eq('phone', client.phone).single();

    if (_client) return _client;

    const { client: _newClient } = await createClient(supabase, client);

    return _newClient;
}

const validateSeller = async (supabase: SupabaseClient<Database>, sellerEmail: string) => {
    const { data: _seller } = await supabase.from('user').select().eq('email', sellerEmail).single();

    return _seller;
}


const updateProducts = async (supabase: SupabaseClient<Database>, products: Array<Product>, sellId: string) => {

    const producstsId = products.map(e => e.id);

    const result = await supabase.from('products').update({
        sell_id: sellId,
        on_stock: false
    })
        .in('id', producstsId)

}


interface generateSell {
    client: Client;
    sellerEmail: string;
    products: Array<Product>;
    total: number;
}