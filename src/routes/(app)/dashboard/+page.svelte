<script lang="ts">
	import { getProductsPaginatedData } from '$lib/api/getProductsPaginated.api.js';
	import type { Product } from '$lib/interfaces/product.interface.js';
	import { onMount } from 'svelte';

	export let data;
	let {
		supabase,
		env: { pageSize }
	} = data;

	let pageNumber = 0;
	let maxPageNumber = 0;

	let products: Array<Product> = [];

	const nextPage = () => {
		if (pageNumber + 1 < maxPageNumber) pageNumber++;
	};
	const prevPage = () => {
		if (pageNumber > 0) pageNumber--;
	};

	$: fetchProductsData(pageNumber);

	onMount(async () => {
		const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
		maxPageNumber = count ? Math.ceil(count / pageSize) : 0;
	});

	const fetchProductsData = async (pageNumber: number) => {
		products = await getProductsPaginatedData(pageNumber, supabase);
	};
</script>

<div
	class="m-auto flex min-h-[70%] w-[90%] max-w-[700px] flex-col items-center gap-0 rounded-2xl border border-gray-400 p-4 select-none lg:min-h-1/2 lg:w-1/2"
>
	<h1 class=" text-center text-2xl font-semibold">Sistema de Inventario</h1>

	<div class="min-h-[85%] overflow-hidden">
		<table class="table-xs table-pin-rows table-pin-cols m-5">
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
				{#each products as product, index (product.id)}
					<tr class="hover:bg-base-300 cursor-pointer">
						<td>{index}</td>
						<td>{product.description}</td>
						<td>{product.size}</td>
						<td class="hidden lg:flex">{product.cost}</td>
						<td>{product.sold_price}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="join flex justify-center">
		<button class="join-item btn" onclick={prevPage}>«</button>
		<button class="join-item btn">{pageNumber + 1}</button>
		<button class="join-item btn" onclick={nextPage}>»</button>
	</div>
</div>
