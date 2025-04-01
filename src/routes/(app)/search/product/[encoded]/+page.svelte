<script lang="ts">
	export let data;

	let { supabase, product } = data;
</script>

<div class=" flex h-screen w-screen flex-col gap-5">{product.id}</div>
