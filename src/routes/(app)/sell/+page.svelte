<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import QrReader from '$lib/components/QrReader.svelte';
	import QrIcon from '$lib/icons/qr.icon.svelte';
	import CartIcon from '$lib/icons/cart.icon.svelte';

	export let data;

	let { supabase } = data;

	let qrReader: QrReader;
	let isScanning = false;
	let readedValue = '';
	let total = 0;

	let products: Array<{ id: number; description: string; size: string; price: number }> = [];
	let productsTable: HTMLDivElement;

	$: total = products.reduce((accumulator, currentValue) => accumulator + currentValue.price, 0);

	const generateSell = async () => {
		products.push({
			id: products.length + 1,
			description: 'description',
			size: 'size',
			price: 1000
		});

		products = products;
	};

	const fetchProductData = async () => {
		const { data, error } = await supabase
			.from('products')
			.select('id,  details, sold_price, cost')
			.limit(1);

		console.log(data);
	};

	afterUpdate(() => {
		if (productsTable) productsTable.scrollTop = productsTable.scrollHeight;
	});

	onMount(() => {
		return () => {};
	});
</script>

<div class=" flex h-screen w-screen flex-col gap-5">
	{#if !isScanning}
		<div
			class="mt-10 flex w-[90%] flex-col items-center gap-4 self-center rounded-2xl border border-[#e5e5e5] p-5"
		>
			<h1 class="p-3 text-2xl font-semibold">Sistema de Facturación</h1>
			<p class="text-xs">Escanee códigos QR para agregar elementos a la factura</p>

			<button onclick={qrReader.startScanner} class="btn border border-[#e5e5e5]">
				<QrIcon />
				Scanear QR</button
			>
		</div>
		<div
			class="flex max-h-[500px] w-[90%] flex-col items-center gap-4 self-center overflow-y-auto rounded-2xl border border-[#e5e5e5] p-5"
			bind:this={productsTable}
			id="products-table"
		>
			<h1 class="p-3 text-2xl font-semibold">Sistema de Facturación</h1>

			<table class="table">
				<thead>
					<tr>
						<th>ID</th>
						<th>Description</th>
						<th>Size</th>
						<th>Price</th>
					</tr>
				</thead>

				<tbody>
					{#if products.length > 0}
						{#each products as product}
							<tr onclick={() => {}} class=" cursor-pointer">
								<td>{product.id}</td>
								<td>{product.description}</td>
								<td>{product.size}</td>
								<td>{product.price}</td>
							</tr>
						{/each}
					{:else}{/if}
				</tbody>
			</table>

			{#if products.length > 0}
				<h2 class="self-end">total:{total}</h2>
			{:else}
				<p class="w-[80%] text-center text-xs">
					No hay elementos. Escanee un código QR para agregar.
				</p>
			{/if}

			<button onclick={generateSell} class="btn border border-[#e5e5e5]">
				<CartIcon />
				Comprar</button
			>
		</div>
	{/if}

	<div class="m-auto flex flex-col gap-5 self-center justify-self-center p-2">
		<QrReader bind:this={qrReader} bind:isScanning bind:readedValue />

		{#if isScanning}
			<button onclick={qrReader.stopScanner} class="btn self-center border border-[#e5e5e5]">
				atras</button
			>
		{/if}
	</div>
</div>
