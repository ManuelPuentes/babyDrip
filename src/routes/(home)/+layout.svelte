<script>
	import { onMount } from 'svelte';
	import '../../app.css';
	import { invalidate } from '$app/navigation';
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
</script>

{@render children()}
