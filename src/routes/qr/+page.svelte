<script lang="ts">
	import { onMount } from 'svelte';
	import QrIcon from '$lib/icons/qr.icon.svelte';
	import Alert from '$lib/components/Alert.svelte';

	export let data;
	let alertRef: Alert;
	let creating = false;
	let qr_type: string | null = null;

	onMount(async () => {});

	async function downloadPDF() {
		creating = true;
		try {
			const response = await fetch(`/qr`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					qr_type
				})
			});

			if (!response.ok) {
				throw new Error('Failed to generate PDF');
			}

			// Create a blob from the response
			const blob = await response.blob();

			// Create download link
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `${qr_type}-${new Date().toISOString().split('T')[0]}.pdf`;
			document.body.appendChild(a);
			a.click();

			// Clean up
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		} catch {
			alertRef.showAlert('hubo un error al generar el archivo', 'alert-success');
		} finally {
			creating = false;
			alertRef.showAlert('archivo generado exitosamente', 'alert-success');
		}
	}
</script>

<Alert bind:this={alertRef} class="top-16 self-start" />
<div class="flex min-h-full flex-col items-center justify-center p-2 select-none">
	<h1 class="title">Imprimir Qr:</h1>
	<img src={data.qr} alt="exmaple qr fun hidden message" class="w-[200px]" />

	<p class="text-base-format w-fit text-center">
		Selecciona el tipo de Qr que quieres generar y da clik en descargar
	</p>

	<form method="post" class="m-2 flex w-[300px] flex-col gap-4">
		<fieldset class="fieldset border-base-300 rounded-box col-span-2 w-full border p-4">
			<legend class="fieldset-legend text-base-format">qr type:</legend>
			<select class="select validator" required name="qr_type" bind:value={qr_type}>
				<option value="products">products</option>
				<option value="warehouse">warehouse</option>
			</select>

			{#if qr_type}
				{#if creating}
					<span class="loading loading-ring loading-xl self-center"></span>
				{:else}
					<button
						type="button"
						class="btn self-center border border-[#e5e5e5]"
						on:click={downloadPDF}>download {qr_type} QR <QrIcon /></button
					>
				{/if}
			{/if}
		</fieldset>
	</form>
</div>
