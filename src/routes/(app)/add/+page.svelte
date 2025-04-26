<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import CheckIcon from '$lib/icons/check.icon.svelte';
	import { enhance } from '$app/forms';
	import { getWarehouses } from '$lib/api/getWarehouses.api';
	import type { Warehouse } from '$lib/interfaces/warehouse.interface';
	import Alert from '$lib/components/Alert.svelte';
	import type { Product } from '$lib/interfaces/product.interface';

	export let data: PageData;
	let alertRef: Alert;
	let creating = false;

	export let form;
	$: ({ formData, errors, success } = form ?? {
		formData: {} as Product,
		errors: {} as Record<string, string>,
		success: false
	});

	let warehouses: Array<Warehouse>;

	onMount(async () => {
		warehouses = (await getWarehouses(data.supabase)).data;
	});

	$: {
		if (success && alertRef) {
			alertRef.showAlert('producto agregado de forma exitosa', 'alert-success');
		}
	}

	$: {
		if (errors && alertRef && Object.keys(errors).length) {
			const error_msg = Object.values(errors).join('\n');
			alertRef.showAlert(error_msg, 'alert-error');
		}
	}

	const handleSubmit = () => {
		creating = true;

		return async ({ update }: any) => {
			await update();
			creating = false;
		};
	};
</script>

<Alert bind:this={alertRef} class="self-start" />

<div
	class="flex max-w-[700px] flex-col items-center p-4 select-none lg:m-auto lg:min-h-1/2 lg:w-1/2"
>
	<h1 class="text-2xl font-semibold">Agregar Producto</h1>
	<form
		action=""
		method="post"
		class="m-2 flex w-[300px] flex-col items-center whitespace-nowrap"
		use:enhance={handleSubmit}
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
				value={formData.cost ?? 10}
				aria-invalid={errors?.cost ? 'true' : undefined}
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
				value={formData.sold_price ?? 10}
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
				pattern="[A-Za-z][A-Za-z0-9\-]*"
				minlength="1"
				value={formData.size ?? 'xs'}
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
					<option value={warehouse.id}>{warehouse.name}</option>
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
				value={formData.description ?? 'description'}
				aria-invalid={errors?.size ? 'true' : undefined}
			></textarea>
			{#if errors?.description}
				<p class=" overflow-hidden text-wrap text-ellipsis text-red-500">{errors.description}</p>
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
