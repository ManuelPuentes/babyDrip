<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import QrReader from '$lib/components/QrReader.svelte';
	import QrIcon from '$lib/icons/qr.icon.svelte';
	import CartIcon from '$lib/icons/cart.icon.svelte';
	import Alert from '$lib/components/Alert.svelte';

	export let data;

	let { supabase } = data;

	let qrReader: QrReader;
	let isScanning = false;
	let readedValue = '';
	let error: { message: string } | null = null;

	let alertRef: Alert;

	let total = 0;

	let products: Array<{
		id: string;
		description: string;
		size: string;
		sold_price: number;
	}> = [];
	let productsTable: HTMLDivElement;

	const QrDetectedHandler = async ({ detail: { readedValue } }: CustomEvent) => {
		if (products.find((element) => element.id == readedValue)) {
			alertRef.showAlert('este elemento ya esta facturado', 'alert-warning');
			return;
		}

		const { error: _fetchError, data } = await fetchProductData(readedValue);

		if (_fetchError) {
			switch (_fetchError.code) {
				case '22P02':
					alertRef.showAlert('QR invalido', 'alert-error');
					break;
				case 'PGRST116':
					alertRef.showAlert('producto no encontrado', 'alert-error');
					break;
				default:
					error = { message: JSON.stringify(_fetchError) };
					break;
			}
		}

		if (!data) return;

		products.push({
			id: data.id,
			description: data.description,
			size: data.size,
			sold_price: data.sold_price
		});

		products = products;
		total += data.sold_price;

		alertRef.showAlert('element added', 'alert-success');
	};

	const fetchProductData = async (productId: string) => {
		const { data, error } = await supabase
			.from('products')
			.select('id,  description, size, sold_price')
			.eq('id', productId)
			.single();

		return { data, error };
	};

	const generateSell = async () => {};

	afterUpdate(() => {
		if (productsTable) productsTable.scrollTop = productsTable.scrollHeight;
	});

	onMount(() => {
		return () => {};
	});
</script>

<div class=" flex h-screen w-screen flex-col gap-5">
	<Alert bind:this={alertRef} />

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
						{#each products as product, index}
							<tr onclick={() => {}} class=" cursor-pointer">
								<td>{index}</td>
								<td>{product.description}</td>
								<td>{product.size}</td>
								<td>{product.sold_price}</td>
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
		<QrReader
			bind:this={qrReader}
			bind:isScanning
			bind:readedValue
			on:qr-detected={QrDetectedHandler}
		/>

		{#if isScanning}
			<button onclick={qrReader.stopScanner} class="btn self-center border border-[#e5e5e5]">
				atras</button
			>
		{/if}
	</div>
</div>
