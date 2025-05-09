<script lang="ts">
	import { getProductsPaginatedData } from '$lib/api/getProductsPaginated.api.js';
	import { FilterType } from '$lib/api/queryBuilder.js';
	import type { Product } from '$lib/interfaces/product.interface.js';
	import { onMount } from 'svelte';
	import ProductsTable from './components/ProductsTable.svelte';

	let { data } = $props();

	const { maxPageNumber, supabase, warehouses, products } = $state(data);
	let pageNumber = 1;
	let load_trigger: HTMLElement;
	let loading: boolean = $state(false);
	let filtered_products: Array<{
		id: string;
		cost: number;
		sold_price: number;
		size: string;
		description: string;
		stored_at: string;
	}> = $state(products);

	let numbers: Array<number> = $state([]);

	onMount(async (): Promise<any> => {
		const observer = new IntersectionObserver(
			async () => {
				if (loading || pageNumber >= maxPageNumber) return;
				loading = true;
				const { data: _products } = await getProductsPaginatedData({
					supabase,
					filters: [{ field: 'purchase_order_id', filter: FilterType.IS, value: null }],
					select: ['id', 'cost', 'sold_price', 'size', 'description', 'stored_at'],
					pageNumber
				});
				products.push(
					...(_products as Array<{
						id: string;
						cost: number;
						sold_price: number;
						size: string;
						description: string;
						stored_at: string;
					}>)
				);
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

	const formatNumber = (value: number) => parseFloat(String(value / 100)).toFixed(2);

	const getInputValue = (event: Event) => {
		const target = event.target as HTMLInputElement; // Cast to input element
		return target.value;
	};

	const filterByDescription = (event: Event) => {
		const filter_value = getInputValue(event);
		filtered_products = products.filter((product) =>
			product.description.toLocaleLowerCase().includes(filter_value.toLocaleLowerCase())
		);
	};
	const filterBySoldPrice = (event: Event) => {
		const filter_value = Number(getInputValue(event)) * 100;

		if (filter_value == 0) {
			filtered_products = products;
			return;
		}

		filtered_products = products.filter((product) => product.sold_price <= filter_value);
	};
	const filterBySize = (event: Event) => {
		const filter_value = getInputValue(event);
		filtered_products = products.filter((product) =>
			product.size.toLocaleLowerCase().includes(filter_value.toLocaleLowerCase())
		);
	};

	const filterByWarehouse = (event: Event) => {
		const filter_value = getInputValue(event);
		filtered_products = products.filter((product) => product.stored_at == filter_value);
	};
</script>

<div class="grid grid-cols-4 gap-4 p-4">
	<h1 class="text-base-format col-span-4">filtros:</h1>

	<label class="input col-span-4 w-full lg:col-span-1">
		<input type="text" class="grow" placeholder="Descripcion" onchange={filterByDescription} />
	</label>
	<label class="input col-span-2 w-full lg:col-span-1">
		<input type="text" class="grow" placeholder="Talla" onchange={filterBySize} />
	</label>

	<label class="input col-span-2 w-full lg:col-span-1">
		<input type="number" class="grow" placeholder="Precio" onchange={filterBySoldPrice} />
	</label>

	<select class="select col-span-2 lg:col-span-1" name="warehouse" onchange={filterByWarehouse}>
		<option disabled selected value="">Almacen</option>
		{#each warehouses as warehouse (warehouse.id)}
			<option value={warehouse.id}>{warehouse.name}</option>
		{/each}
	</select>
</div>

<ProductsTable data={filtered_products}>
	<div class="self-center p-4" bind:this={load_trigger}></div>
	{#if loading}
		<span class="loader-ring self-center"></span>
	{/if}
</ProductsTable>
