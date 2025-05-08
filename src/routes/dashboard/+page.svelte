<script lang="ts">
	import { getProductsPaginatedData } from '$lib/api/getProductsPaginated.api.js';
	import type { Product } from '$lib/interfaces/product.interface.js';
	import { onMount } from 'svelte';

	let { data } = $props();

	const { maxPageNumber, supabase, products, warehouses } = $state(data);
	let pageNumber = 1;
	let load_trigger: HTMLElement;
	let loading: boolean = $state(false);
	let filtered_products: Array<Product> = $state(products);

	onMount(async (): Promise<any> => {
		const observer = new IntersectionObserver(
			async () => {
				if (loading || pageNumber >= maxPageNumber) return;
				loading = true;
				const { products: _products } = await getProductsPaginatedData(pageNumber, supabase);
				products.push(..._products);
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

<div class="flex w-full flex-col p-3 select-none lg:p-5">
	{#if filtered_products.length}
		<table class="table-pin-rows table-pin-cols table-zebra table-xs table w-full">
			<thead class="text-base-format">
				<tr>
					<td></td>
					<td>Descripcion</td>
					<td>Talla</td>
					<td class="hidden lg:flex">Costo</td>
					<td>Precio</td>
				</tr>
			</thead>

			<tbody>
				{#each filtered_products as product, index (product.id)}
					<tr class="hover:!bg-base-300 cursor-pointer">
						<td class="text-base-format">{index + 1}</td>
						<td class="text-base-format">{product.description}</td>
						<td class="text-base-format">{product.size}</td>
						<td class="text-base-format hidden lg:flex">{formatNumber(product.cost)}</td>
						<td class="text-base-format">{formatNumber(product.sold_price)}</td>
					</tr>
				{/each}
			</tbody>
		</table>

		<div class="self-center p-4" bind:this={load_trigger}></div>

		{#if loading}
			<span class="loader-ring self-center"></span>
		{/if}
	{:else}
		<div class="hero min-h-[calc(100vh-130px)] lg:min-h-[calc(100vh-64px)]">
			<div class="hero-content text-center">
				<div class="max-w-md">
					<h1 class="title">Inventario Vacio.</h1>
					<p class="text-base-format py-6">
						Agrega productos a tu inventario y los veras en esta pestana.
					</p>
				</div>
			</div>
		</div>
	{/if}
</div>
