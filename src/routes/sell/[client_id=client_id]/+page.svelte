<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	//components
	import Alert from '$lib/components/Alert.svelte';
	import QrReader from '$lib/components/QrReader.svelte';
	import SellTicket from './components/SellTicket.svelte';
	import Modal from '$lib/components/Modal.svelte';

	//icons
	import QrIcon from '$lib/icons/qr.icon.svelte';
	import CartIcon from '$lib/icons/cart.icon.svelte';
	//interfaces
	import type { Product } from '$lib/interfaces/product.interface.js';
	//api
	import { getProduct } from '$lib/api/getProduct.api.js';
	//utils
	import qrvalidator from '$lib/validator/qr.validator.js';
	import { goto } from '$app/navigation';

	interface FormState {
		errors?: any;
		success?: boolean;
		result?: {
			payment_details: Record<string, { value: number; exchange: number }>;
			total: number;
		};
	}

	interface Props {
		data: PageData;
		form: FormState;
	}

	const { data, form }: Props = $props();

	let { tasaBCV, client, seller, supabase } = $state<PageData>(data);

	const { errors, success, result } = $derived(form ?? {});

	let alertRef: Alert;
	let qrReader: QrReader;
	let modalRef: Modal;
	let productsTableRef: HTMLDivElement | undefined = $state();
	let acceptBs = $state(false);
	let partialOnInvoice = $state(0);

	let isScanning = $state(false);
	let total = $state(0);
	let creating = $state(false);

	let payment_details_result: Record<string, { value: number; exchange: number }> = $state({});

	let products: Array<Product> = $state([
		// {
		// 	id: 'id',
		// 	description: 'dptiondesiptiondescription',
		// 	size: 'NewBorn ',
		// 	sold_price: 100,
		// 	cost: 0,
		// 	stored_at: ''
		// }
		// {
		// 	id: 'id2',
		// 	description:
		// 		'dptiondesiptiondescription dptiondesiptiondescription dptiondesiptiondescription dptiondesiptiondescription dptiondesiptiondescription ',
		// 	size: 'NewBorn ',
		// 	sold_price: 100,
		// 	cost: 0,
		// 	stored_at: ''
		// },
		// {
		// 	id: 'id3',
		// 	description: 'dptiondesiptiondescription',
		// 	size: 'NewBorn ',
		// 	sold_price: 100,
		// 	cost: 0,
		// 	stored_at: ''
		// },
		// {
		// 	id: 'id',
		// 	description: 'dptiondesiptiondescription',
		// 	size: 'NewBorn ',
		// 	sold_price: 100,
		// 	cost: 0,
		// 	stored_at: ''
		// },
		// {
		// 	id: 'id2',
		// 	description:
		// 		'dptiondesiptiondescription dptiondesiptiondescription dptiondesiptiondescription dptiondesiptiondescription dptiondesiptiondescription ',
		// 	size: 'NewBorn ',
		// 	sold_price: 100,
		// 	cost: 0,
		// 	stored_at: ''
		// },
		// {
		// 	id: 'id3',
		// 	description: 'dptiondesiptiondescription',
		// 	size: 'NewBorn ',
		// 	sold_price: 100,
		// 	cost: 0,
		// 	stored_at: ''
		// },
		// {
		// 	id: 'id',
		// 	description: 'dptiondesiptiondescription',
		// 	size: 'NewBorn ',
		// 	sold_price: 100,
		// 	cost: 0,
		// 	stored_at: ''
		// },
		// {
		// 	id: 'id2',
		// 	description:
		// 		'dptiondesiptiondescription dptiondesiptiondescription dptiondesiptiondescription dptiondesiptiondescription dptiondesiptiondescription ',
		// 	size: 'NewBorn ',
		// 	sold_price: 100,
		// 	cost: 0,
		// 	stored_at: ''
		// },
		// {
		// 	id: 'id3',
		// 	description: 'dptiondesiptiondescription',
		// 	size: 'NewBorn ',
		// 	sold_price: 100,
		// 	cost: 0,
		// 	stored_at: ''
		// }
	]);

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

		products.push(product);

		products = products;

		alertRef.showAlert('element added', 'alert-success');
	};

	const qrInvalidHandler = ({ detail: { error } }: CustomEvent) => {
		alertRef.showAlert(error, 'alert-error');
	};
	$effect(() => {
		if (success && result?.payment_details) payment_details_result = result.payment_details;
	});

	$effect(() => {
		if (success && alertRef) {
			alertRef.showAlert('facturaccion exitosa!', 'alert-success');
			products = [];
			modalRef.openModal();
		}
	});

	$effect(() => {
		if (errors && Object.keys(errors).length > 0) {
			const error_msg = Object.values(errors).join('\n');
			alertRef.showAlert(error_msg, 'alert-error');
		}
	});

	$effect(() => {
		if (productsTableRef && products.length) {
			productsTableRef.scrollTop = productsTableRef.scrollHeight;
		}
	});

	const handleSubmit = ({ formData }: any) => {
		creating = true;

		let payment_details: Record<string, number> = {};

		formData.append('total', total);
		formData.append('productsId', JSON.stringify($state.snapshot(products).map((p) => p.id)));

		if (acceptBs) {
			payment_details['VES'] = partialOnInvoice;
		}

		formData.append('paymentPerCurrency', JSON.stringify(payment_details));
		formData.append('clientId', client.id);
		formData.append('sellerId', seller.id);

		return async ({ update }: any) => {
			await update();
			creating = false;
		};
	};
</script>

<Alert bind:this={alertRef} class="top-16 self-start" />

<Modal
	bind:this={modalRef}
	header="Success!"
	content="La venta se procesó correctamente."
	button_text="cerrar"
	on_close={() => {
		goto(`/sell/${client.id}`);
	}}
>
	<div class="my-3 flex aspect-square w-2/3 flex-col items-center justify-center border p-2">
		<h3>detalles</h3>
		<table class="table-xs table-pin-rows table-pin-cols table-zebra w-full">
			<tbody>
				{#each Object.entries(payment_details_result) as payment_currency_details}
					<tr>
						<td class="content-start text-center text-sm">{payment_currency_details[0]}</td>
						<td class="content-start text-center text-sm"
							>{parseFloat(String(payment_currency_details[1].exchange / 100)).toFixed(2)}</td
						>
					</tr>
				{/each}
			</tbody>
		</table>

		<span
			>total: {parseFloat(String((result?.total ?? 0) / 100)).toFixed(2)} <strong>USD</strong></span
		>
	</div>
</Modal>

<div
	class="flex max-w-[700px] flex-col items-center gap-4 overflow-x-hidden overflow-y-auto p-4 select-none md:m-auto md:max-h-1/3 lg:min-h-1/2 lg:w-1/2"
	bind:this={productsTableRef}
>
	<QrReader
		bind:this={qrReader}
		bind:isScanning
		on:qr-invalid={qrInvalidHandler}
		on:qr-detected={qrDetectedHandler}
		validator={qrvalidator}
	/>
	{#if !isScanning}
		{#if creating}
			<span class="loading loading-ring loading-xl m-auto"></span>
		{:else}
			<SellTicket bind:products {tasaBCV} bind:total />

			<form
				action=""
				method="post"
				use:enhance={handleSubmit}
				class="grid w-full grid-cols-1 gap-2 p-2 transition-all duration-500 ease-out md:grid-cols-2"
			>
				<fieldset>
					<legend class="text-sm">abono en bs: </legend>
					<label class="toggle text-base-content">
						<input type="checkbox" bind:checked={acceptBs} name="accept_bs" />

						<svg
							aria-label="enabled"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="4"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M18 6 6 18" />
							<path d="m6 6 12 12" />
						</svg>
						<svg aria-label="disabled" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
							<g
								stroke-linejoin="round"
								stroke-linecap="round"
								stroke-width="4"
								fill="none"
								stroke="currentColor"
							>
								<path d="M20 6 9 17l-5-5"></path>
							</g>
						</svg>
					</label>
					<span class="text-sm">tasa del día ({tasaBCV}) <strong>BS/USD</strong> </span>
				</fieldset>

				<fieldset>
					<input
						type="number"
						name="partial_on_invoice"
						class="input validator"
						disabled={!acceptBs}
						bind:value={partialOnInvoice}
						step=".01"
						min="0"
						max={parseFloat(String(tasaBCV * (total / 100))).toFixed(2)}
						placeholder="Type here"
					/>
					<div class="validator-hint">
						max bs:{parseFloat(String(tasaBCV * (total / 100))).toFixed(2)}
					</div>
				</fieldset>
				<div class=" flex w-full justify-around gap-4 md:col-span-2">
					<button onclick={qrReader.startScanner} class="btn">
						<QrIcon />
						Scanear QR</button
					>
					<button class="btn" type="submit">
						<CartIcon />
						Comprar
					</button>
				</div>
			</form>
		{/if}
	{/if}
</div>
