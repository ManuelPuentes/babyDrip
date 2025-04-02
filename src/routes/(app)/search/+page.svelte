<script lang="ts">
	import QrReader from '$lib/components/QrReader.svelte';
	import Alert from '$lib/components/Alert.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import qrvalidator from '$lib/validator/qr.validator.js';

	let qrReader: QrReader;
	let alertRef: Alert;
	let isScanning = true;

	const qrDetectedHandler = async ({ detail: { data } }: CustomEvent) => {
		switch (data.type) {
			case 'product': {
				await goto(`search/product/${data.id}`);
				break;
			}

			case 'warehouse': {
				await goto(`search/warehouse/${data.id}`);
				break;
			}
			default:
				alertRef.showAlert('este tipo de item aun no esta contemplado', 'alert-error');
				return;
		}
	};

	const qrInvalidHandler = ({ detail: { error } }: CustomEvent) => {
		alertRef.showAlert(error, 'alert-error');
	};

	onMount(() => {
		qrReader.startScanner();

		return () => {
			console.log('unmounted');
		};
	});
</script>

<div class=" flex h-screen w-screen flex-col gap-5">
	<Alert bind:this={alertRef} />

	<QrReader
		on:qr-invalid={qrInvalidHandler}
		on:qr-detected={qrDetectedHandler}
		bind:this={qrReader}
		class="w-[300px]"
		bind:isScanning
		validator={qrvalidator}
	/>
</div>
