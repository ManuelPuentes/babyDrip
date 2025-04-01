<script lang="ts">
	import QrReader from '$lib/components/QrReader.svelte';
	import Alert from '$lib/components/Alert.svelte';
	import { getProduct } from '$lib/api/getProduct.api.js';
	import { onMount } from 'svelte';
	import type { QrData } from '$lib/interfaces/qr.interface.js';
	import { goto } from '$app/navigation';
	import { getWarehouse } from '$lib/api/getWarehouse.api.js';

	export let data;

	let { supabase } = data;

	let qrReader: QrReader;
	let alertRef: Alert;
	let readedValue = '';
	let isScanning = true;

	const QrDetectedHandler = async ({ detail: { readedValue } }: CustomEvent) => {
		try {
			const qrData: QrData = JSON.parse(readedValue);

			switch (qrData.type) {
				case 'product': {
					const productResult = await getProduct(supabase, qrData.id);

					if (!productResult.error && productResult.data)
						await goto(`search/product/${btoa(JSON.stringify(productResult.data))}`);

					break;
				}

				case 'warehouse': {
					const wareHouseResult = await getWarehouse(supabase, qrData.id);
					if (!wareHouseResult.error && wareHouseResult.data)
						await goto(`search/warehouse/${btoa(JSON.stringify(wareHouseResult.data))}`);
					break;
				}
				default:
					alertRef.showAlert('este tipo de item aun no esta contemplado', 'alert-error');
					return;
			}
		} catch {
			alertRef.showAlert('Qr invalido', 'alert-error');
		}
	};

	onMount(() => {
		qrReader.startScanner();
	});
</script>

<div class=" flex h-screen w-screen flex-col gap-5">
	<Alert bind:this={alertRef} />

	<QrReader
		bind:this={qrReader}
		class="w-[300px]"
		bind:isScanning
		bind:readedValue
		on:qr-detected={QrDetectedHandler}
	/>
</div>
