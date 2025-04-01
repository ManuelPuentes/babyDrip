<script>
	import '../../app.css';
	import { goto, invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	import HomeIcon from '$lib/icons/home.icon.svelte';
	import CartIcon from '$lib/icons/cart.icon.svelte';
	import AddIcon from '$lib/icons/add.icon.svelte';
	import QrIcon from '$lib/icons/qr.icon.svelte';

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

	async function logout() {
		await supabase.auth.signOut();
		goto('/');
	}
</script>

<div class="flex h-screen w-screen min-w-[300px] flex-col font-mono">
	<div class="navbar bg-base-100 shadow-sm">
		<div class="navbar-start">
			<span class="btn btn-ghost text-xl">babyDrip</span>
		</div>

		<div class="navbar-end">
			{#if session}
				<button onclick={logout} class="btn border-[#e5e5e5]">Sign Out</button>
			{/if}
		</div>
	</div>

	{@render children()}

	<div class="dock shadow-sm md:hidden">
		<a href="/add"><AddIcon />Add</a>
		<a href="/dashboard"><HomeIcon />Home</a>
		<a href="/search"><QrIcon />Search</a>
		<!-- <a href="/"><SearchIcon />Search</a> -->
		<a href="/sell"><CartIcon />Sell</a>
	</div>
</div>
