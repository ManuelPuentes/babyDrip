<script>
	import '../../app.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	import { PUBLIC_APP_URL } from '$env/static/public';

	let { data, children } = $props();
	let { session, supabase } = $derived(data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}

			invalidate('supabase:auth');
		});

		return () => data.subscription.unsubscribe();
	});

	async function signInWithGoogle() {
		await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${PUBLIC_APP_URL}/auth/callback`,
				scopes: 'email'
			}
		});
	}

	async function logout() {
		await supabase.auth.signOut();
	}
</script>

<div class="flex h-screen w-screen flex-col font-mono">
	<div class="navbar bg-base-100 shadow-sm">
		<div class="navbar-start">
			<span class="btn btn-ghost text-xl">babyDrip</span>
		</div>

		<div class="navbar-end">
			{#if session}
				<button onclick={logout} class="btn border-[#e5e5e5]">Sign Out</button>
			{:else}
				<button onclick={signInWithGoogle} class="btn border-[#e5e5e5]">
					<svg
						aria-label="Google logo"
						width="16"
						height="16"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 512 512"
						><g
							><path d="m0 0H512V512H0" fill="#fff"></path><path
								fill="#34a853"
								d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
							></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
							></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
							></path><path
								fill="#ea4335"
								d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
							></path></g
						></svg
					>
					Login with Google
				</button>
			{/if}
		</div>
	</div>
	{@render children()}
</div>
