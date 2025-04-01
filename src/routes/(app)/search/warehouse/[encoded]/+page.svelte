<script lang="ts">
	export let data;

	let { supabase, warehouse } = data;
</script>

<div class=" flex h-screen w-screen flex-col gap-5">{warehouse.id}</div>
