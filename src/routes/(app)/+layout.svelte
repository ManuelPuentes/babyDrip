<script>
	import '../../app.css';
	import { goto, invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	import HomeIcon from '$lib/icons/home.icon.svelte';
	import BabyIcon from '$lib/icons/baby.icon.svelte';
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

		<div class="navbar-center hidden lg:flex">
			<ul class="menu menu-horizontal px-1">
				<li><a href="/dashboard"><HomeIcon />Home</a></li>
				<li><a href="/add"><AddIcon />Add</a></li>
				<li><a href="/search"><QrIcon />Search</a></li>
				<li><a href="/sell"><CartIcon />Sell</a></li>
			</ul>
		</div>

		<div class="navbar-end">
			{#if session}
				<button onclick={logout} class="btn border-[#e5e5e5]">Sign Out</button>
			{/if}
		</div>
	</div>

	{@render children()}

	<div class="dock shadow-sm md:hidden">
		<a href="/dashboard"><HomeIcon />Home</a>
		<a href="/add"><AddIcon />Add</a>
		<BabyIcon class="h-12 w-12" />
		<a href="/search"><QrIcon />Search</a>
		<a href="/sell"><CartIcon />Sell</a>
	</div>
</div>
