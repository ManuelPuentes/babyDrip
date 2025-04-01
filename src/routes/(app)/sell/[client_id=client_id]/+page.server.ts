import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { createSell } from "$lib/api/createSell.api";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "$lib/supabase/supabase";
import type { Product } from "$lib/interfaces/product.interface";

export const load: PageServerLoad = (async ({ url, parent, params }) => {});

export const actions: Actions = {

    default: async ({ request, locals: { supabase, user }, params, }) => {

        const formData = await request.formData();
        const data = Object.fromEntries(formData);
        const errors: any = {};

        const products = JSON.parse(String(data.products));
        const total = Number(data.total);

        const { data: seller } = await supabase.from('user').select().eq('email', user?.email).single();
        const { data: client } = await supabase.from('client').select().eq('id', params.client_id).single();

        if (total == 0) errors.total = "total price cant be 0";
        if (products.length == 0) errors.products = "products cant be 0";
        if (!client) errors.client = "client not found";
        if (!seller) errors.seller = "seller not found";

        if (Object.keys(errors).length > 0) {
            return fail(400, { errors });
        };

        const { sell: _newSell } = await createSell(supabase, client.id, seller.id, total);

        if (!_newSell) {
            errors.sell = "unexpected error creating sell";
            return fail(400, { errors });
        }

        const { data: updatedProducts, error: updateErrors } = await updateProducts(supabase, products, _newSell.id);

        if (updateErrors) {
            errors.update = "error updating products data"
            return fail(400, { errors });
        }

        return {
            success: true,
            errors: {},
            message: 'Form submitted successfully!',
        };
    }

} satisfies Actions;


const updateProducts = async (supabase: SupabaseClient<Database>, products: Array<string>, sellId: string) => {

    const { data, error } = await supabase.from('products').update({
        sell_id: sellId,
    })
        .in('id', products);

    return { data, error };
}
