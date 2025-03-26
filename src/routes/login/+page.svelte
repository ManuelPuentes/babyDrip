<script>
	export let data;

	let { supabase, session } = data;

	async function signInWithGitHub() {
		const { error, data } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: 'http://localhost:5173/auth/callback',
				scopes: 'email'
				// skipBrowserRedirect: true
			}
		});
	}
</script>

<div class="flex w-full grow items-center justify-center bg-neutral-100">
	<div class="rounded-md bg-white p-6 shadow-lg">
		<h2 class="text-center">Welcome</h2>
		<button
			class="mt-2 w-full bg-black px-4 py-4 text-center text-white hover:shadow-lg"
			on:click={signInWithGitHub}>Sign In With Google</button
		>
	</div>
</div>
