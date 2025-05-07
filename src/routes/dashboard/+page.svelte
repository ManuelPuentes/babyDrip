<script lang="ts">
	import { getProductsPaginatedData } from '$lib/api/getProductsPaginated.api.js';
	import ProductsTable from '$lib/components/Products.Table.svelte';
	import { onMount } from 'svelte';

	let { data } = $props();
	let loading: boolean = $state(false);
	let products_list = $state(data.products);
	const { maxPageNumber, supabase } = $state(data);

	let pageNumber = 1;
	let load_trigger: HTMLElement;

	onMount(async (): Promise<any> => {
		const observer = new IntersectionObserver(
			async () => {
				if (loading || pageNumber >= maxPageNumber) return;
				loading = true;
				const { products: _products } = await getProductsPaginatedData(pageNumber, supabase);
				products_list.push(..._products);
				products_list = products_list;
				pageNumber++;
				loading = false;
			},
			{
				threshold: 0.5
			}
		);
		observer.observe(load_trigger);

		return () => {
			observer.unobserve(load_trigger);
		};
	});
</script>

<div
	class="flex max-w-[700px] flex-col items-center overflow-x-hidden overflow-y-auto border p-4 select-none md:m-auto md:max-h-1/3 lg:min-h-1/2 lg:w-1/2"
>
	<h1 class="p-3 text-2xl font-semibold">Inventario</h1>

	<ProductsTable data={products_list} />

	<div id="load-more-trigger" style="height: 20px;" bind:this={load_trigger}></div>
	{#if loading}
		<span class="loading loading-spinner loading-xs"></span>
	{/if}
</div>
