<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Alert from '$lib/components/Alert.svelte';
	import QrReader from '$lib/components/QrReader.svelte';
	import ReloadIcon from '$lib/icons/reload.icon.svelte';

	import qrvalidator from '$lib/validator/qr.validator.js';

	let qrReader: QrReader;
	let alertRef: Alert;
	let isScanning = true;

	const qrDetectedHandler = async ({ detail: { data } }: CustomEvent) => {
		switch (data.type) {
			case 'products': {
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
		return () => {};
	});
</script>

<div class="flex h-screen w-screen flex-col items-center justify-center gap-5">
	<Alert bind:this={alertRef} />

	<div class=" flex w-40 flex-col gap-4 self-center {isScanning ? 'hidden' : 'flex'}">
		<button class="btn self-center border border-[#e5e5e5]" onclick={qrReader.startScanner}>
			<ReloadIcon /></button
		>
	</div>

	<QrReader
		on:qr-invalid={qrInvalidHandler}
		on:qr-detected={qrDetectedHandler}
		on:qr-reader-stop={() => {
			goto('/dashboard');
		}}
		bind:this={qrReader}
		class="w-[300px] {isScanning ? 'flex' : 'hidden'}"
		bind:isScanning
		validator={qrvalidator}
	/>
</div>
