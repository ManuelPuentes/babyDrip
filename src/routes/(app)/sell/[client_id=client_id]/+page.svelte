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

	const qrDetectedHandler = async ({ detail: { data } }: CustomEvent) => {
		if (data.type != 'product') {
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
		total += product.sold_price;

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

<Alert bind:this={alertRef} />
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
	<div class="flex flex-col items-center select-none lg:m-auto lg:w-1/2">
		<div class="flex flex-col items-center gap-4 select-none lg:w-4/5">
			<h1 class="p-3 text-center text-2xl font-semibold">Sistema de Facturación</h1>
			<p class="w-4/5 text-center text-xs">
				Escanee códigos QR para agregar elementos a la factura
			</p>

			<button onclick={qrReader.startScanner} class="btn border border-[#e5e5e5]">
				<QrIcon />
				Scanear QR</button
			>
		</div>
		<div class="divider"></div>
		<div
			class="flex flex-col items-center gap-4 select-none lg:w-4/5"
			bind:this={productsTableRef}
			id="products-table"
		>
			<h1 class="p-3 text-center text-2xl font-semibold">Factura</h1>
			<table class="table-xs table-pin-rows table-pin-cols w-full break-words">
				<thead class="border-b border-[#e5e5e5]">
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
	</div>
{/if}
