<script lang="ts">
	import { getProductsPaginatedData } from '$lib/api/getProductsPaginated.api.js';

	export let data;
	let { supabase, maxPageNumber, products } = data;

	let pageNumber = 0;

	const nextPage = () => {
		if (pageNumber + 1 < maxPageNumber) pageNumber++;
	};
	const prevPage = () => {
		if (pageNumber > 0) pageNumber--;
	};

	$: fetchProductsData(pageNumber);

	const fetchProductsData = async (pageNumber: number) => {
		const { products: _products } = await getProductsPaginatedData(pageNumber, supabase);
		products = _products;
	};
</script>

<div
	class="flex max-w-[700px] flex-col items-center p-4 select-none lg:m-auto lg:min-h-1/2 lg:w-1/2"
>
	<h1 class=" text-center text-2xl font-semibold">Sistema de Inventario</h1>

	<div>
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

	<div class="join flex justify-center">
		<button class="join-item btn" onclick={prevPage}>«</button>
		<button class="join-item btn">{pageNumber + 1}</button>
		<button class="join-item btn" onclick={nextPage}>»</button>
	</div>
</div>
