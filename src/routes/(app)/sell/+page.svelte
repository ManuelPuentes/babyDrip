<script lang="ts">
	import { onMount } from 'svelte';
	import QrReader from '$lib/components/QrReader.svelte';

	let qrReader: QrReader;
	let isScanning = false;
	let readedValue = '';

	onMount(() => {
		return () => {};
	});
</script>

<div class="flex h-screen w-screen flex-col items-center justify-center gap-5 bg-red-300">
	<QrReader bind:this={qrReader} bind:isScanning bind:readedValue />

	{#if !isScanning}
		<div class="p-2">
			<button onclick={qrReader.startScanner} class="btn border-[#e5e5e5]">Scan</button>
		</div>
	{:else}{/if}
	{readedValue}
</div>
