import { createClient } from '$lib/api/createClient.api';
import type { Client } from '$lib/interfaces/client.interface';
import type { Database } from '$lib/supabase/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';
import { fail, type Actions } from '@sveltejs/kit';
import { getClient } from '$lib/api/getClient.api';
import { message, superValidate } from 'sveltekit-superforms';
import { clientSchema } from '$lib/schemas/clientSchema';
import { zod } from 'sveltekit-superforms/adapters';
import { FilterType } from '$lib/api/queryBuilder';

export const load = async () => {
	const form = await superValidate(zod(clientSchema));
	return { form };
};

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(clientSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { phone, lastname, name } = form.data;

		const { data: client } = await ((lastname && name) ?
			createClient(supabase, { lastname, name, phone })
			: getClient({
				supabase,
				filters: [
					{ field: 'phone', filter: FilterType.EQ, value: phone }
				]
			}))

		if (!client) {
			form.errors.phone = ['client not found']
			return fail(400, { form });
		}

		return message(form, {
			type: 'success',
			status: 200,
			text: 'client created successfully',
			data: client
		});

	}
} satisfies Actions;

