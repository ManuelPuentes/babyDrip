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

<div class=" sm:m-auto md:h-[80%] md:w-[70%]">
	<table class="table-xs table-pin-rows table-pin-cols w-[80%] m-5">
		<thead>
			<tr>
				<td class="hidden md:flex">id</td>
				<td>details</td>
				<!-- <td>cost</td> -->
				<td>price</td>
			</tr>
		</thead>

		<tbody class="overflow-hidden">
			{#each products as product}
				<tr onclick={()=>{}} class=" cursor-pointer">
					<td class="hidden md:flex">{product.id}</td>
					<td>{JSON.stringify(product.details)}</td>
					<!-- <td>{product.cost}</td> -->
					<td>{product.sold_price}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
