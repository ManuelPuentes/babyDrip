<script lang="ts">
	import InvalidRows from './components/InvalidRows.svelte';
	import AddProductsForm from './components/AddProductsForm.svelte';
	import ProcessedProductsForm from './components/ProcessedProductsForm.svelte';
	import type { Product } from '$lib/interfaces/product.interface';

	const { data } = $props();

	let valid_data: Array<Product> | undefined = $state(undefined);
	let invalid_data: Array<any> | undefined = $state(undefined);

	const warehouses = data.warehouses;
</script>

<div class="flex min-h-full flex-col items-center justify-center p-3 select-none lg:p-5">
	{#if valid_data}
		<ProcessedProductsForm data={valid_data} />
	{:else if invalid_data}
		<InvalidRows data={invalid_data} />
	{:else}
		<AddProductsForm {warehouses} data={data.addProductsform} bind:valid_data bind:invalid_data />
	{/if}
</div>
