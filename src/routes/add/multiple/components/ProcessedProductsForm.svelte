<script lang="ts">
	import { enhance } from '$app/forms';
	import CheckIcon from '$lib/icons/check.icon.svelte';
	import type { Product } from '$lib/interfaces/product.interface';
	import Alert from '$lib/components/Alert.svelte';
	import { goto } from '$app/navigation';
	import Modal from '$lib/components/Modal.svelte';

	const { data } = $props();

	let products = $state(data);

	let alertRef: Alert;
	let modalRef: Modal;
	let successMessage: string = $state('');

	let formated_products = $derived.by(() => {
		return products.map((e: Product) => {
			return { ...e, sold_price: e.sold_price / 100 };
		});
	});

	let invalidProducts = $state(new Map());

	$effect(() => {
		if (invalidProducts.size && alertRef) {
			alertRef.showAlert(
				`ALgunos productos no cumplen los requerimientos esperados`,
				'alert-error'
			);
		}
	});

	async function handleSubmit({ formData }: { formData: FormData }) {
		const data = formated_products.map((p: Product) => {
			return { ...p, sold_price: p.sold_price * 100 };
		});

		formData.append(`products`, JSON.stringify(data));
		return async ({ result }: any) => {
			const {
				type,
				data
			}: {
				type: 'success' | 'failure';
				status: number;
				data: unknown;
			} = await result;

			if (type === 'failure') {
				const { error } = data as { error: { message: string; data: any } };
				invalidProducts = error.data;
			}

			if (type === 'success') {
				const { success } = data as { success: { message: string; data: any } };
				successMessage = success.message;
				modalRef.openModal();
			}
		};
	}
</script>

<Alert bind:this={alertRef} class="top-16" />

<Modal
	bind:this={modalRef}
	header="Success!"
	content={`Productos agregados correctamente!\n${successMessage}`}
	button_text="Finalizar"
	on_close={() => {
		goto('/dashboard');
	}}
/>

<h1 class="title p-4">Processed products:</h1>

<form
	action="?/save_data"
	method="post"
	enctype="multipart/form-data"
	use:enhance={handleSubmit}
	class="flex flex-col gap-2"
	id="savbe_data_form"
>
	<div class="grid grid-cols-1 gap-2 md:grid-cols-2">
		{#each formated_products as element, index (index)}
			<div class="grid grid-cols-2 gap-2 rounded-lg border border-zinc-400 p-5">
				<fieldset class="fieldset col-span-1 text-sm">
					<legend class="fieldset-legend font-light">cost</legend>
					<input
						type="number"
						class="input !text-base-content"
						disabled
						value={parseFloat(String(element.cost / 100)).toFixed(2)}
					/>
				</fieldset>
				<fieldset class="fieldset col-span-1 text-sm">
					<legend class="fieldset-legend font-light">size</legend>
					<input type="text" class="input !text-base-content" disabled value={element.size} />
				</fieldset>
				<fieldset class="fieldset col-span-2 text-sm">
					<legend class="fieldset-legend font-light">description</legend>
					<textarea class="textarea !text-base-content w-full" disabled value={element.description}
					></textarea>
				</fieldset>
				<fieldset class="fieldset col-span-2 text-sm">
					<legend class="fieldset-legend font-light">sold price </legend>
					<span class="text-xs">suggested sold price ({String(element.sold_price)})</span>
					<input
						id={String(index)}
						type="number"
						step=".01"
						class="input w-full"
						placeholder={String(element.sold_price)}
						bind:value={element.sold_price}
					/>

					{#if invalidProducts.get(Number(index))}
						<span class="text-red-400">
							{Object.values(invalidProducts.get(Number(index)).errors).join(',\n')}
						</span>
					{/if}
				</fieldset>
			</div>
		{/each}
	</div>

	<button class="btn btn-lg my-2 w-full self-center border border-zinc-400" type="submit">
		Guardar <CheckIcon />
	</button>
</form>
