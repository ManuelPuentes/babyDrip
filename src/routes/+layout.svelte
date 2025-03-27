<script>
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

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
	}
</script>

<svelte:head>
	<title>Enceladus-1: the DALL-E wrapper</title>
	<meta name="description" content="It's on Enceladus" />
</svelte:head>

<div class="flex min-h-screen flex-col font-mono">

	<div class="navbar bg-base-100 min-w-[500px] shadow-sm">
		<div class="navbar-start">
			{#if session}
				<div class="dropdown">
					<div tabindex="0" role="button" class="btn btn-ghost md:hidden">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h8m-8 6h16"
							/>
						</svg>
					</div>
					<ul
						tabindex="0"
						class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
					>
						<li><a>Item 1</a></li>
						<li><a>Item 3</a></li>
					</ul>
				</div>
			{/if}
			<a class="btn btn-ghost text-xl">babyDrip</a>
		</div>
		<div class="navbar-center hidden md:flex">
			{#if session}
				<ul class="menu menu-horizontal px-1">
					<li><a>Item 1</a></li>
					<li><a>Item 3</a></li>
					<li><a>Item 3</a></li>
				</ul>
			{/if}
		</div>
		<div class="navbar-end">
			{#if session}
				<button onclick={logout} class="btn btn-ghost text-xl">Sign Out</button>
			{:else}
				<a href="/login" class="btn btn-ghost text-xl">Sign In</a>
			{/if}
		</div>
	</div>
	{@render children()}
</div>
