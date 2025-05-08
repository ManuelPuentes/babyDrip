<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import CheckIcon from '$lib/icons/check.icon.svelte';
	import { enhance } from '$app/forms';
	import Alert from '$lib/components/Alert.svelte';
	import type { Product } from '$lib/interfaces/product.interface';
	import Modal from '$lib/components/Modal.svelte';
	import { goto } from '$app/navigation';

	export let data: PageData;

	let { warehouses, product } = data;

	let alertRef: Alert;
	let modalRef: Modal;
	let creating = false;

	export let form;
	$: ({ formData, errors, success } = form ?? {
		formData: {} as Product,
		errors: {} as Record<string, string>,
		success: false
	});

	$: {
		if (success && alertRef) {
			alertRef.showAlert('producto actualizado de forma exitosa', 'alert-success');
			modalRef.openModal();
		}
	}

	$: {
		if (errors && alertRef && Object.keys(errors).length) {
			const error_msg = Object.values(errors).join('\n');
			alertRef.showAlert(error_msg, 'alert-error');
		}
	}

	onMount(() => {});

	const handleSubmit = () => {
		creating = true;

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
	content={`Producto actualizado correctamente!`}
	button_text="Finalizar"
	on_close={() => {
		goto('/dashboard');
	}}
/>

<div class="flex flex-col items-center justify-center p-2 select-none lg:h-full">
	<h1 class="title">Actualizar Producto:</h1>

	<form
		action=""
		method="post"
		class="grid w-full grid-cols-2 gap-2 p-4 lg:aspect-square lg:w-1/3"
		use:enhance={handleSubmit}
		on:submit|preventDefault
	>
		<fieldset class="fieldset col-span-2 w-full lg:col-span-1">
			<legend class="fieldset-legend text-base-format">costo</legend>
			<input
				type="number"
				name="cost"
				class="input validator w-full tabular-nums {errors?.cost ? 'valid:border-red-500' : ''}"
				required
				placeholder="coste del producto"
				pattern="[0-9]*"
				min="9"
				aria-invalid={errors?.cost ? 'true' : undefined}
				value={formData.cost ?? product.cost}
			/>

			{#if errors?.cost}
				<p class=" overflow-hidden text-ellipsis text-red-500">{errors.cost}</p>
			{/if}
		</fieldset>

		<fieldset class="fieldset col-span-2 w-full lg:col-span-1">
			<legend class="fieldset-legend text-base-format">precio de venta:</legend>
			<input
				type="number"
				name="sold_price"
				class="input validator w-full tabular-nums {errors?.sold_price
					? 'valid:border-red-500'
					: ''}"
				required
				placeholder="precio de venta"
				pattern="[0-9]*"
				min="9"
				value={formData.sold_price ?? product.sold_price}
				aria-invalid={errors?.sold_price ? 'true' : undefined}
			/>

			{#if errors?.sold_price}
				<p class=" overflow-hidden text-ellipsis text-red-500">{errors.sold_price}</p>
			{/if}
		</fieldset>

		<fieldset class="fieldset col-span-2 w-full lg:col-span-1">
			<legend class="fieldset-legend text-base-format">talla:</legend>

			<input
				type="text"
				name="size"
				class="input validator w-full {errors?.size ? 'valid:border-red-500' : ''}"
				required
				placeholder="talla del producto"
				minlength="1"
				value={formData.size ?? product.size}
				aria-invalid={errors?.size ? 'true' : undefined}
			/>

			{#if errors?.size}
				<p class=" overflow-hidden text-ellipsis text-red-500">{errors.size}</p>
			{/if}
		</fieldset>

		<fieldset class="fieldset col-span-2 w-full lg:col-span-1">
			<legend class="fieldset-legend text-base-format">almacen:</legend>

			<select class="select validator w-full" required name="warehouse">
				{#each warehouses as warehouse (warehouse.id)}
					{#if warehouse.id == product.stored_at}
						<option value={warehouse.id} selected>{warehouse.name}</option>
					{:else}
						<option value={warehouse.id}>{warehouse.name}</option>
					{/if}
				{/each}
			</select>
		</fieldset>

		<fieldset class="fieldset col-span-2 w-full">
			<legend class="fieldset-legend text-base-format">descripcion del producto:</legend>

			<textarea
				name="description"
				class="textarea validator w-full{errors?.description ? 'valid:border-red-500' : ''}"
				placeholder="descripcion del producto"
				required
				value={formData.description ?? product.description}
				aria-invalid={errors?.size ? 'true' : undefined}
			></textarea>
			{#if errors?.description}
				<p class=" overflow-hidden text-ellipsis text-red-500">{errors.description}</p>
			{/if}
		</fieldset>

		{#if creating}
			<span class="loader-ring col-span-2 place-self-center"></span>
		{:else}
			<button class="btn col-span-2 place-self-center" type="submit">
				Update<CheckIcon />
			</button>
		{/if}
	</form>
</div>
