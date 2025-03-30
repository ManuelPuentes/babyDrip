<script lang="ts">
	import { Html5Qrcode } from 'html5-qrcode';
	import { onMount } from 'svelte';

	let scanner: Html5Qrcode | null = null;
	export let isScanning: boolean = true;
	export let readedValue: any | null = null;

	const scannerConfig = {
		fps: 1,
		rememberLastUsedCamera: true,
		supportedScanTypes: [0]
	};

	const onScanSuccess = async (decodedText: string) => {
		try {
			readedValue = decodedText;
			stopScanner();
		} catch (error) {
			stopScanner();
		}
	};

	const onScanError = async (error: any) => {
		if (scanner) {
			// await scanner.stop();
		}
	};

	export async function startScanner() {
		isScanning = true;
		scanner = new Html5Qrcode('qr-reader', false);
		scanner.start({ facingMode: 'environment' }, scannerConfig, onScanSuccess, onScanError);
	}

	export async function stopScanner() {
		if (scanner) {
			await scanner.stop();
		}
		isScanning = false;
	}

	onMount(() => {
		return () => {};
	});
</script>

<div id="qr-reader" class={$$restProps.class}></div>
