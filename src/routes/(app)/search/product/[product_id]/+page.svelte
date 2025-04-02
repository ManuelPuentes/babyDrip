<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import CheckIcon from '$lib/icons/check.icon.svelte';
	import { enhance } from '$app/forms';
	import Alert from '$lib/components/Alert.svelte';

	export let data: PageData;

	let { warehouses, product } = data;

	let alertRef: Alert;
	let creating = false;

	export let form;
	$: ({ formData, errors, success } = form ?? {
		formData: {} as any,
		errors: {} as Record<string, string>,
		success: false
	});

	$: {
		if (success && alertRef) {
			alertRef.showAlert('producto actualizado de forma exitosa', 'alert-success');
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

<div class="flex h-screen w-screen items-center justify-center">
	<Alert bind:this={alertRef} class="self-start" />

	<div class="flex h-fit flex-col items-center rounded-2xl border p-4">
		<h1 class="text-2xl font-semibold">Actualizar valores</h1>

		<form
			action=""
			method="post"
			class="m-2 flex w-[300px] flex-col items-center whitespace-nowrap"
			use:enhance={handleSubmit}
			on:submit|preventDefault
		>
			<fieldset class="fieldset flex w-[100%] flex-col gap-0">
				<legend class="fieldset-legend">costo</legend>
				<input
					type="number"
					name="cost"
					class="input validator tabular-nums {errors?.cost ? 'valid:border-red-500' : ''}"
					required
					placeholder="coste del producto"
					pattern="[0-9]*"
					min="9"
					aria-invalid={errors?.cost ? 'true' : undefined}
					value={formData.cost ?? product.cost}
				/>

				{#if errors?.cost}
					<p class=" overflow-hidden text-ellipsis text-red-500">{errors.cost}</p>
				{:else}
					<p class="validator-hint overflow-hidden text-ellipsis">debes ingresar un valor</p>
				{/if}
			</fieldset>

			<fieldset class="fieldset w-[100%]">
				<legend class="fieldset-legend">precio de venta</legend>
				<input
					type="number"
					name="sold_price"
					class="input validator tabular-nums {errors?.sold_price ? 'valid:border-red-500' : ''}"
					required
					placeholder="precio de venta"
					pattern="[0-9]*"
					min="9"
					value={formData.sold_price ?? product.sold_price}
					aria-invalid={errors?.sold_price ? 'true' : undefined}
				/>

				{#if errors?.sold_price}
					<p class=" overflow-hidden text-ellipsis text-red-500">{errors.sold_price}</p>
				{:else}
					<p class="validator-hint overflow-hidden text-ellipsis">debes ingresar un valor</p>
				{/if}
			</fieldset>

			<fieldset class="fieldset w-[100%]">
				<legend class="fieldset-legend">talla</legend>

				<input
					type="text"
					name="size"
					class="input validator {errors?.size ? 'valid:border-red-500' : ''}"
					required
					placeholder="talla del producto"
					minlength="1"
					value={formData.size ?? product.size}
					aria-invalid={errors?.size ? 'true' : undefined}
				/>

				{#if errors?.size}
					<p class=" overflow-hidden text-ellipsis text-red-500">{errors.size}</p>
				{:else}
					<p class="validator-hint overflow-hidden text-ellipsis">debes ingresar un valor</p>
				{/if}
			</fieldset>

			<fieldset class="fieldset w-[100%]">
				<legend class="fieldset-legend">almacen</legend>

				<select class="select validator" required name="warehouse">
					{#each warehouses as warehouse (warehouse.id)}
						{#if warehouse.id == product.stored_at}
							<option value={warehouse.id} selected>{warehouse.name}</option>
						{:else}
							<option value={warehouse.id}>{warehouse.name}</option>
						{/if}
					{/each}
				</select>

				<p class="validator-hint overflow-hidden text-ellipsis">debes seleccionar 1</p>
			</fieldset>

			<fieldset class="fieldset w-[100%]">
				<legend class="fieldset-legend">descripcion del producto</legend>

				<textarea
					name="description"
					class="textarea validator {errors?.description ? 'valid:border-red-500' : ''}"
					placeholder="descripcion del producto"
					required
					value={formData.description ?? product.description}
					aria-invalid={errors?.size ? 'true' : undefined}
				></textarea>
				{#if errors?.description}
					<p class=" overflow-hidden text-ellipsis text-red-500">{errors.description}</p>
				{:else}
					<p class="validator-hint overflow-hidden text-ellipsis">debes ingresar un valor</p>
				{/if}
			</fieldset>

			{#if creating}
				<span class="loading loading-ring loading-xl"></span>
			{:else}
				<button class="btn border border-[#e5e5e5]" type="submit">
					<CheckIcon />
				</button>
			{/if}
		</form>
	</div>
</div>
