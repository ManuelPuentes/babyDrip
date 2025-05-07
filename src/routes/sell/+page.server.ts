import { createClient } from '$lib/api/createClient.api';
import type { Client } from '$lib/interfaces/client.interface';
import type { Database } from '$lib/supabase/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { getClient } from '$lib/api/getClient.api';

export const load = async () => {};

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const data = Object.fromEntries(formData) as { name: string; lastname: string; phone: string };
		const errors: Record<string, string> = {};

		const { name, lastname, phone } = data;

		if (!isAlphaNumeric(String(name))) errors.name = 'invalid name';

		if (!isAlphaNumeric(String(lastname))) errors.lastname = 'invalid lastname';

		if (!isValidPhoneNumber(String(phone))) errors.phone = 'invalid phone number';

		if (Object.keys(errors).length > 0) {
			return fail(400, { formData: data, errors });
		}

		const client = await ensureClientExist(supabase, {
			name: String(name),
			lastname: String(lastname),
			phone: String(phone)
		});

		if (!client) return fail(400);

		throw redirect(303, `sell/${String(client.id)}`);
	}
} satisfies Actions;

function isAlphaNumeric(str: string) {
	return /^[a-zA-Z0-9]+$/.test(str);
}

function isValidPhoneNumber(phone: string) {
	return /^\+?[\d\s-]{10,15}$/.test(phone);
}

const ensureClientExist = async (supabase: SupabaseClient<Database>, client: Client) => {
	const { client: _client } = await getClient(supabase, client);

	if (_client) return _client;

	const { client: _newClient } = await createClient(supabase, client);

	return _newClient;
};
