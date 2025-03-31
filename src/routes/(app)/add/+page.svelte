<script lang="ts">
	import { onMount } from 'svelte';

	import NewProductForm from '$lib/components/NewProductForm.svelte';

	export let data;

	let { supabase, user } = data;

	onMount(async () => {});
</script>

<div class="flex h-full flex-col items-center justify-center border p-2">
	<NewProductForm {data} />
</div>
