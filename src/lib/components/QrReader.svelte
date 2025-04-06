<script lang="ts">
	import { Html5Qrcode } from 'html5-qrcode';
	import { createEventDispatcher, onMount } from 'svelte';

	let scanner: Html5Qrcode | null = null;
	export let isScanning: boolean = true;

	const dispatch = createEventDispatcher();

	const scannerConfig = {
		fps: 1,
		rememberLastUsedCamera: true,
		supportedScanTypes: [0]
	};

	export let validator: (decodedText: string) => {
		error?: string;
		data?: unknown;
	};

	const onScanSuccess = async (decodedText: string) => {
		const { data, error } = validator(decodedText);

		if (error) {
			dispatch('qr-invalid', { error });
		} else {
			dispatch('qr-detected', { data });
		}

		stopScanner();
	};

	const onScanError = async () => {};

	export async function startScanner() {
		isScanning = true;
		scanner = new Html5Qrcode('qr-reader', false);
		scanner.start({ facingMode: 'environment' }, scannerConfig, onScanSuccess, onScanError);
	}

	export async function stopScanner() {
		if (scanner) {
			await scanner.stop();
			scanner.clear();

			// dispatch('qr-reader-stop');
		}
		isScanning = false;
	}

	onMount(() => {
		return () => {
			try {
				if (scanner) {
					scanner.stop();
					scanner.clear();
					scanner = null;
				}
			} catch {}
		};
	});
</script>

<div class="m-auto flex flex-col gap-4 self-center">
	<div id="qr-reader" class={$$restProps.class}></div>
	{#if isScanning}
		<button onclick={stopScanner} class="btn self-center border border-[#e5e5e5]"> atras</button>
	{/if}
</div>
