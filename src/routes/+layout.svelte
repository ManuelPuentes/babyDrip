<script>
	import { onMount } from 'svelte';
	import '../app.css';
	import { goto, invalidate } from '$app/navigation';
	import Navbar from '$lib/components/Navbar.svelte';
	import Dock from '$lib/components/Dock.svelte';
	let { data, children } = $props();
	let { session, supabase } = $derived(data);

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});

	async function logout() {
		await supabase.auth.signOut();
		goto('/');
	}
</script>

<div class="flex h-screen flex-col items-center">
	<div class="h-16 w-full">
		{#if session}
			<Navbar {logout} />
		{/if}
	</div>

	<div class="w-full max-w-[1920px] flex-1 overflow-auto">{@render children()}</div>

	<div class="h-16 md:hidden">
		{#if session}
			<Dock />
		{/if}
	</div>
</div>
