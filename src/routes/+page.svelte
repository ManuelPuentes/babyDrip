<script>
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import LogIn from '$lib/components/LogIn.svelte';

	let { data } = $props();
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
</script>

<div class="flex h-full w-full items-center justify-center select-none">
	<LogIn {supabase} />
</div>
