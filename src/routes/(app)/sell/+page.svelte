<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import ClientForm from '$lib/components/ClientForm.svelte';
	import Alert from '$lib/components/Alert.svelte';
	import QrReader from '$lib/components/QrReader.svelte';
	//icons
	import QrIcon from '$lib/icons/qr.icon.svelte';
	import CartIcon from '$lib/icons/cart.icon.svelte';
	import TimesIcon from '$lib/icons/times.icon.svelte';
	//interfaces
	import type { Client } from '$lib/interfaces/client.interface.js';
	import type { Product } from '$lib/interfaces/product.interface.js';

	export let data;

	let { supabase } = data;

	let qrReader: QrReader;
	let productsTableRef: HTMLDivElement;
	let alertRef: Alert;

	let readedValue = '';
	let isScanning = false;
	let total = 0;

	let products: Array<Product> = [
		// {
		// 	id: 'id',
		// 	description:
		// 		'description description description description description description description descriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescription',
		// 	size: 'NewBorn NewBorn NewBorn NewBorn NewBorn',
		// 	sold_price: 100
		// }
	];

	let clientData: Client;
	let clientSetted: boolean;

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
					alertRef.showAlert(JSON.stringify(_fetchError), 'alert-error');
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

	const removeElement = (elementId: string) => {
		products = products.filter((item) => item.id != elementId);
	};

	const generateSell = async () => {
		console.log(clientData);
	};

	afterUpdate(() => {
		if (productsTableRef) productsTableRef.scrollTop = productsTableRef.scrollHeight;
	});

	onMount(() => {
		return () => {};
	});
</script>

<div class=" flex h-screen w-screen flex-col gap-5">
	<Alert bind:this={alertRef} />

	{#if !clientSetted}
		<ClientForm bind:client={clientData} bind:setted={clientSetted} />
	{:else if !isScanning && clientSetted}
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
			bind:this={productsTableRef}
			id="products-table"
		>
			<h1 class="p-3 text-2xl font-semibold">Sistema de Facturación</h1>
			<table class=" table-xs table-pin-rows table-pin-cols w-[90%] break-words">
				<thead class="d border-b">
					<tr>
						<!-- <th>ID</th> -->
						<th>Description</th>
						<th>Size</th>
						<th>Price</th>
						<th></th>
					</tr>
				</thead>

				<tbody>
					{#if products.length > 0}
						{#each products as product (product.id)}
							<tr class=" cursor-pointer">
								<!-- <td class="text-ellipsis">{product.id}</td> -->
								<td class="">{product.description}</td>
								<td class="">{product.size}</td>
								<td class="">{product.sold_price}</td>
								<td
									><button
										onclick={() => {
											removeElement(product.id);
										}}><TimesIcon /></button
									></td
								>
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

	<QrReader
		bind:this={qrReader}
		bind:isScanning
		bind:readedValue
		on:qr-detected={QrDetectedHandler}
	/>
</div>
