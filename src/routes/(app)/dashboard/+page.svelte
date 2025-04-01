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
		pageNumber + 1 < maxPageNumber ? pageNumber++ : pageNumber;
	};
	const prevPage = () => {
		pageNumber > 0 ? pageNumber-- : pageNumber;
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
