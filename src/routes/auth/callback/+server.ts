import { error, redirect } from '@sveltejs/kit';

export const GET = async ({ url, locals }) => {
	const code = url.searchParams.get('code');

	if (!code) {
		throw redirect(303, '/');
	}

	const {
		data: { session },
		error: _code_exchange_error
	} = await locals.supabase.auth.exchangeCodeForSession(code);

	if (_code_exchange_error && !session) {
		throw error(400, 'exchange for session failed');
	}

	// throw redirect(303, '/dashboard');
};
