<script lang="ts">
	import { onMount } from 'svelte';

	export let data;
	let {
		supabase,
		env: { pageSize }
	} = data;

	let pageNumber = 0;
	let maxPageNumber = 0;

	let products: Array<{
		id: string;
		description: string;
		size: string;
		sold_price: number;
		cost: number;
	}> = [];

	const nextPage = () => {
		pageNumber + 1 < maxPageNumber ? pageNumber++ : pageNumber;
	};
	const prevPage = () => {
		pageNumber > 0 ? pageNumber-- : pageNumber;
	};

	$: getProductsPaginatedData(pageNumber);

	onMount(async () => {
		const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
		maxPageNumber = count ? Math.ceil(count / pageSize) : 0;
	});

	const getProductsPaginatedData = async (pageNumber: number) => {
		const offset = pageNumber * pageSize;
		const limit = (pageNumber + 1) * pageSize - 1;
		const { data, error } = await supabase
			.from('products')
			.select('id,  description, size, sold_price, cost')
			.eq('on_stock', true)
			.range(offset, limit);

		products = data ? data : [];
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
				{#each products as product, index}
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
