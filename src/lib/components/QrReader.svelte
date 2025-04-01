<script lang="ts">
	import { Html5Qrcode } from 'html5-qrcode';
	import { createEventDispatcher, onMount } from 'svelte';

	let scanner: Html5Qrcode | null = null;
	export let isScanning: boolean = true;
	export let readedValue: string | null = null;

	const dispatch = createEventDispatcher();

	const scannerConfig = {
		fps: 1,
		rememberLastUsedCamera: true,
		supportedScanTypes: [0]
	};

	const onScanSuccess = async (decodedText: string) => {
		try {
			readedValue = decodedText;
			dispatch('qr-detected', { readedValue });
			stopScanner();
		} catch {
			stopScanner();
		}
	};

	const onScanError = async () => {
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

<div class="m-auto flex flex-col gap-4 self-center">
	<div id="qr-reader" class={$$restProps.class}></div>
	{#if isScanning}
		<button onclick={stopScanner} class="btn self-center border border-[#e5e5e5]"> atras</button>
	{/if}
</div>
