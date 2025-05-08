<script lang="ts">
	import { getProductsPaginatedData } from '$lib/api/getProductsPaginated.api.js';
	import { onMount } from 'svelte';

	let { data } = $props();

	const { maxPageNumber, supabase, products, warehouse } = $state(data);
	let pageNumber = 1;
	let load_trigger: HTMLElement;
	let loading: boolean = $state(false);

	onMount(async (): Promise<any> => {
		const observer = new IntersectionObserver(
			async () => {
				if (loading || pageNumber >= maxPageNumber) return;
				loading = true;
				const { products: _products } = await getProductsPaginatedData(pageNumber, supabase, {
					stored_at: warehouse.id
				});

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
</script>

<div class="flex w-full flex-col p-3 select-none lg:p-5">
	{#if products.length}
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
				{#each products as product, index (product.id)}
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
					<h1 class="title">Almacen vacio.</h1>
					<p class="text-base-format py-6">
						Agrega productos a tu almacen y los veras en esta pestana.
					</p>
				</div>
			</div>
		</div>
	{/if}
</div>
