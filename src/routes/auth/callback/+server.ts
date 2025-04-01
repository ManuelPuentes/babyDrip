import { redirect } from '@sveltejs/kit';

export const GET = async ({ url, locals }) => {
	const code = url.searchParams.get('code');
	if (!code) {
		throw redirect(303, '/');
	}

	const {
		data: { user, session }
	} = await locals.supabase.auth.exchangeCodeForSession(code);

	if (!user || !session) {
		throw redirect(303, '/');
	}

	locals.supabase.auth.setSession(session);

	const { error: user_not_found } = await locals.supabase
		.from('user')
		.select()
		.eq('email', user?.email ?? '')
		.single();

	if (user_not_found) {
		await locals.supabase.auth.signOut();
		throw redirect(303, '/');
	}

	throw redirect(303, '/dashboard');
};
