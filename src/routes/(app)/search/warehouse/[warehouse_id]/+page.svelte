<script lang="ts">
	import type { Product } from '$lib/interfaces/product.interface.js';

	export let data;

	let { warehouse, maxPageNumber, pageSize, supabase } = data;
	let pageNumber = 0;
	let products: Array<Product> = [];

	const nextPage = () => {
		if (pageNumber + 1 < maxPageNumber) pageNumber++;
	};
	const prevPage = () => {
		if (pageNumber > 0) pageNumber--;
	};

	const fetchProductsData = async (pageNumber: number) => {
		const offset = pageNumber * pageSize;
		const limit = (pageNumber + 1) * pageSize - 1;

		const { data } = await supabase
			.from('products')
			.select('id,  description, size, sold_price, cost')
			.is('sell_id', null)
			.eq('stored_at', warehouse.id ?? '')
			.range(offset, limit);

		products = data ?? [];
	};

	$: fetchProductsData(pageNumber);
</script>

<div
	class="over min:w-[90%] mt-10 flex h-[80%] flex-col justify-center gap-4 self-center overflow-hidden rounded-2xl border border-[#e5e5e5] p-2 select-none"
>
	<h1 class=" text-center text-2xl font-semibold">Sistema de Inventario</h1>

	<div class="min-h-[85%] overflow-hidden">
		<table class="table-xs table-pin-rows table-pin-cols m-5">
			<thead class="border-b">
				<tr>
					<td>ID</td>
					<td>Description</td>
					<td>Size</td>
					<td>Price</td>
				</tr>
			</thead>

			<tbody>
				{#each products as product, index (product.id)}
					<tr onclick={() => {}} class=" cursor-pointer hover:bg-red-300">
						<td>{index}</td>
						<td>{product.description}</td>
						<td>{product.size}</td>
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
