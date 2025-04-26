<script lang="ts">
	import { getProductsPaginatedData } from '$lib/api/getProductsPaginated.api.js';
	import { onMount } from 'svelte';

	export let data;
	let { supabase, maxPageNumber } = data;

	let products: {
		id: any;
		description: any;
		size: any;
		sold_price: any;
		cost: any;
	}[] = [];

	let load_trigger: HTMLElement;
	let loading: boolean = false;
	let pageNumber = 0;

	onMount(async (): Promise<any> => {
		const observer = new IntersectionObserver(
			async (entries) => {
				if (loading || pageNumber >= maxPageNumber) return;
				loading = true;
				const { products: _products } = await getProductsPaginatedData(pageNumber, supabase);
				products.push(..._products);
				products = products;
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
	class="flex max-w-[700px] flex-col items-center overflow-x-hidden overflow-y-auto p-4 select-none md:m-auto md:max-h-1/3 lg:min-h-1/2 lg:w-1/2"
>
	<h1 class="p-3 text-2xl font-semibold">Inventario</h1>

	{#if products.length}
		<table class="table-xs table-pin-rows table-pin-cols table-zebra m-5 w-full">
			<thead class="">
				<tr>
					<td>ID</td>
					<td>Description</td>
					<td>Size</td>
					<td class="hidden lg:flex">Cost</td>
					<td>Price</td>
				</tr>
			</thead>

			<tbody>
				{#each products as product, index}
					<tr class="cursor-pointer hover:bg-zinc-100">
						<td class="content-start text-sm text-gray-500">{index + 1}</td>
						<td class="content-start text-sm text-gray-500">{product.description}</td>
						<td class="content-start text-sm text-gray-500">{product.size}</td>
						<td class="content-start text-sm text-gray-500">{product.cost}</td>
						<td class="content-start text-sm text-gray-500">{product.sold_price}</td>
					</tr>
				{/each}
			</tbody>

			<tfoot>
				<tr>
					<td>ID</td>
					<td>Description</td>
					<td>Size</td>
					<td class="hidden lg:flex">Cost</td>
					<td>Price</td>
				</tr>
			</tfoot>
		</table>
	{:else}
		<span class="text-sm text-gray-500">no hay productos en inventario</span>
	{/if}

	<div id="load-more-trigger" style="height: 20px;" bind:this={load_trigger}></div>
	{#if loading}
		<span class="loading loading-spinner loading-xs">aaa</span>
	{/if}
</div>
