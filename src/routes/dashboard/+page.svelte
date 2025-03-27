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
		details: JSON;
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
			.select('id,  details, sold_price, cost')
			.eq('on_stock', true)
			.range(offset, limit);

		products = data
			? (data as Array<{
					id: string;
					details: JSON;
					sold_price: number;
					cost: number;
				}>)
			: [];
	};
</script>

<div class="m-10 mx-auto overflow-x-auto select-none">
	<table class="table-xs table">
		<thead>
			<tr>
				<th>id</th>
				<th>details</th>
				<th>cost</th>
				<th>sold_price</th>
			</tr>
		</thead>
		<tbody>
			{#each products as product}
				<tr>
					<th class="text-ellipsis">{product.id}</th>
					<td>{JSON.stringify(product.details)}</td>
					<td>{product.cost}</td>
					<td>{product.sold_price}</td>
				</tr>
			{/each}
		</tbody>
		<tfoot>
			<tr>
				<th>id</th>
				<th>details</th>
				<th>cost</th>
				<th>sold_price</th>
			</tr>
		</tfoot>
	</table>
</div>

<div class="join mx-auto">
	<button class="join-item btn" onclick={prevPage}>«</button>
	<button class="join-item btn">Page {pageNumber + 1}</button>
	<button class="join-item btn" onclick={nextPage}>»</button>
</div>
