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
	class="m-auto flex max-w-[700px] flex-col items-center overflow-y-scroll p-4 select-none md:max-h-1/3 lg:min-h-1/2 lg:w-1/2"
>
	<h1 class=" text-center text-2xl font-semibold">Sistema de Inventario</h1>

	<div>
		<table class="table-xs table-pin-rows table-pin-cols table-zebra m-5">
			<thead class="border-b">
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
						<td>{index + 1}</td>
						<td>{product.description}</td>
						<td>{product.size}</td>
						<td class="hidden lg:flex">{product.cost}</td>
						<td>{product.sold_price}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div id="load-more-trigger" style="height: 20px;" bind:this={load_trigger}></div>

	{#if loading}
		<span class="loading loading-spinner loading-xs">aaa</span>
	{/if}
</div>
