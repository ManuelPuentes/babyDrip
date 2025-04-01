import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getWarehouse } from '$lib/api/getWarehouse.api';
import type { Warehouse } from '$lib/interfaces/warehouse.interface';

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
	const { data: warehouse } = await getWarehouse(supabase, params.product_id);

	if (!warehouse) throw error(404, { message: 'warehouse not found' });

	return { warehouse } as { warehouse: Warehouse };
};
