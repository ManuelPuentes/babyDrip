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

	import qrvalidator from '$lib/validator/qr.validator.js';

	export let data;

	let { supabase, client, seller } = data;

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
		// }
		// {
		// 	id: 'id4',
		// 	description: 'dptiondesiptiondescription',
		// 	size: 'NewBorn ',
		// 	sold_price: 100
		// },
		// {
		// 	id: 'id5',
		// 	description: 'dptiondesiptiondescription',
		// 	size: 'NewBorn ',
		// 	sold_price: 100
		// },
		// {
		// 	id: 'id6',
		// 	description: 'dptiondesiptiondescription',
		// 	size: 'NewBorn ',
		// 	sold_price: 100
		// },
		// {
		// 	id: 'id7',
		// 	description: 'dptiondesiptiondescription',
		// 	size: 'NewBorn ',
		// 	sold_price: 100
		// },
		// {
		// 	id: 'id8',
		// 	description: 'dptiondesiptiondescription',
		// 	size: 'NewBorn ',
		// 	sold_price: 100
		// },
		// {
		// 	id: 'id9',
		// 	description: 'dptiondesiptiondescription',
		// 	size: 'NewBorn ',
		// 	sold_price: 100
		// },
	];

	$: total = products.reduce(
		(accumulator, currentValue) => accumulator + (currentValue.sold_price ?? 0),
		0
	);

	const qrDetectedHandler = async ({ detail: { data } }: CustomEvent) => {
		if (data.type != 'products') {
			alertRef.showAlert('este QR no corresponde a un producto', 'alert-error');
			return;
		}

		if (products.find((element) => element.id == data.id)) {
			alertRef.showAlert('este elemento ya esta facturado', 'alert-warning');
			return;
		}

		const { data: product } = await getProduct(supabase, data.id);

		if (!product) {
			alertRef.showAlert('producto no encontrado', 'alert-error');
			return;
		}

		products.push({
			id: product.id,
			description: product.description,
			size: product.size,
			sold_price: product.sold_price
		});

		products = products;

		alertRef.showAlert('element added', 'alert-success');
	};

	const qrInvalidHandler = ({ detail: { error } }: CustomEvent) => {
		alertRef.showAlert(error, 'alert-error');
	};

	const removeElement = (event: any) => {
		if (event.target?.parentElement?.id) {
			const ID = event.target?.parentElement?.id;
			products = products.filter((item) => item.id != ID);
		}
	};
	export let form;
	$: ({ errors, success } = form ?? {
		errors: {} as Record<string, string>,
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

		formData.append('total', total);
		formData.append('productsId', JSON.stringify(products.map((p) => p.id)));
		formData.append('clientId', client.id);
		formData.append('sellerId', seller.id);

		return async ({ update }: any) => {
			await update();
			creating = false;
		};
	};

	afterUpdate(() => {
		if (productsTableRef) productsTableRef.scrollTop = productsTableRef.scrollHeight;
	});
</script>

<Alert bind:this={alertRef} class="top-16 self-start" />
<div class={isScanning ? 'flex h-screen' : 'hidden'}>
	<QrReader
		bind:this={qrReader}
		bind:isScanning
		bind:readedValue
		on:qr-invalid={qrInvalidHandler}
		on:qr-detected={qrDetectedHandler}
		validator={qrvalidator}
	/>
</div>
{#if !isScanning}
	<div
		class="flex max-w-[700px] flex-col items-center overflow-x-hidden overflow-y-auto select-none md:m-auto md:max-h-1/3 lg:min-h-1/2 lg:w-1/2"
	>
		<div
			class="flex w-full flex-col items-center gap-4 p-4 select-none"
			bind:this={productsTableRef}
			id="products-table"
		>
			<h1 class="text-center text-2xl font-semibold">Factura</h1>
			<span class="w-5/6 text-center text-sm"
				>Escanee códigos QR para agregar elementos a la factura</span
			>

			<table class="table-xs table-pin-rows table-pin-cols w-full break-words">
				<thead>
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
				<h2>total:{total}</h2>
			{:else}
				<span class="w-5/6 bg-zinc-100 p-4 text-center text-sm">No hay elementos.</span>
			{/if}

			<div class="flex w-full justify-around">
				<button onclick={qrReader.startScanner} class="btn">
					<QrIcon />
					Scanear QR</button
				>

				<form action="" method="post" use:enhance={handleSubmit}>
					{#if creating}
						<span class="loading loading-ring loading-xl"></span>
					{:else}
						<button class="btn" type="submit">
							<CartIcon />
							Comprar
						</button>
					{/if}
				</form>
			</div>
		</div>
	</div>
{/if}
