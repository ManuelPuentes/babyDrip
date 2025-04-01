<script lang="ts">
	import { afterUpdate } from 'svelte';
	import Alert from '$lib/components/Alert.svelte';
	import QrReader from '$lib/components/QrReader.svelte';
	//icons
	import QrIcon from '$lib/icons/qr.icon.svelte';
	import CartIcon from '$lib/icons/cart.icon.svelte';
	import TimesIcon from '$lib/icons/times.icon.svelte';
	//interfaces
	import type { Product } from '$lib/interfaces/product.interface.js';
	import { getProduct } from '$lib/api/getProduct.api.js';
	import { enhance } from '$app/forms';

	export let data;

	let { supabase } = data;

	let qrReader: QrReader;
	let productsTableRef: HTMLDivElement;
	let alertRef: Alert;

	let readedValue = '';
	let isScanning = false;
	let total = 0;
	let creating = false;

	let products: Array<Product> = [
		// {
		// 	id: 'id',
		// 	description: 'dptiondesiptiondescription',
		// 	size: 'NewBorn ',
		// 	sold_price: 100
		// },
		// {
		// 	id: 'id2',
		// 	description: 'dptiondesiptiondescription',
		// 	size: 'NewBorn ',
		// 	sold_price: 100
		// },
		// {
		// 	id: 'id3',
		// 	description: 'dptiondesiptiondescription',
		// 	size: 'NewBorn ',
		// 	sold_price: 100
		// },
	];

	const QrDetectedHandler = async ({ detail: { readedValue } }: CustomEvent) => {
		if (products.find((element) => element.id == readedValue)) {
			alertRef.showAlert('este elemento ya esta facturado', 'alert-warning');
			return;
		}

		const { error: _fetchError, data } = await getProduct(supabase, readedValue);

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

	const removeElement = (event: any) => {
		if (event.target?.parentElement?.id) {
			const ID = event.target?.parentElement?.id;
			products = products.filter((item) => item.id != ID);
		}
	};
	export let form;
	$: ({ errors, success } = form ?? {
		errors: {} as any,
		success: false
	});

	$: {
		if (success && alertRef) {
			alertRef.showAlert('facturaccion exitosa!', 'alert-success');
			products = [];
		}
	}

	$: {
		if (Object.keys(errors).length && alertRef) {
			const error_msg = Object.values(errors).join('\n');
			alertRef.showAlert(error_msg, 'alert-error');
		}
	}

	const handleSubmit = ({ formData }: any) => {
		creating = true;

		formData.append('total', 100);
		formData.append('products', JSON.stringify(products.map((p) => p.id)));

		return async ({ update, result }: any) => {
			let _result = await update();
			creating = false;
		};
	};

	afterUpdate(() => {
		if (productsTableRef) productsTableRef.scrollTop = productsTableRef.scrollHeight;
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
								<td><button onclick={removeElement} id={product.id}><TimesIcon /></button></td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>

			{#if products.length > 0}
				<h2 class="self-end">total:{total}</h2>
			{:else}
				<p class="w-[80%] text-center text-xs">
					No hay elementos. Escanee un código QR para agregar.
				</p>
			{/if}

			<form action="" method="post" use:enhance={handleSubmit}>
				{#if creating}
					<span class="loading loading-ring loading-xl"></span>
				{:else}
					<button class="btn border border-[#e5e5e5]" type="submit">
						<CartIcon />
						Comprar
					</button>
				{/if}
			</form>
		</div>
	{/if}

	<QrReader
		bind:this={qrReader}
		bind:isScanning
		bind:readedValue
		on:qr-detected={QrDetectedHandler}
	/>
</div>
