<!-- <script lang="ts">
	import Alert from '$lib/components/Alert.svelte';
	import type { PageData } from './$types';
	import InvalidRows from './components/InvalidRows.svelte';
	import AddProductsForm from './components/AddProductsForm.svelte';
	import { AddProductsErrorTypesEnum, type AddProductError } from './interfaces/interfaces';
	import ProcessedProductsForm from './components/ProcessedProductsForm.svelte';

	interface FormState {
		error?: AddProductError;
		success?: boolean;
		result?: unknown;
	}

	interface Props {
		data: PageData;
		form?: FormState;
	}

	const { data, form }: Props = $props();

	let { warehouses } = $state<PageData>(data);
	let { error, success, result } = $state<FormState>(form ?? {});

	let alertRef: Alert;

	$effect(() => {
		if (error && alertRef) {
			alertRef.showAlert(error.message, 'alert-error');
		}
	});
</script>

<Alert bind:this={alertRef} class="top-16" />

<div class=" m-auto flex flex-col items-center justify-center p-2 select-none">
	{#if success && result}
		<ProcessedProductsForm data={result} />
	{:else if error?.type == AddProductsErrorTypesEnum.CSV_INVALID_ROWS}
		<InvalidRows {error} />
	{:else}
		<AddProductsForm {warehouses} />
	{/if}
</div> -->

<script lang="ts">
	import Alert from '$lib/components/Alert.svelte';
	import type { PageData } from './$types';
	import InvalidRows from './components/InvalidRows.svelte';
	import AddProductsForm from './components/AddProductsForm.svelte';
	import { AddProductsErrorTypesEnum, type AddProductError } from './interfaces/interfaces';
	import ProcessedProductsForm from './components/ProcessedProductsForm.svelte';
	import { superForm } from 'sveltekit-superforms';
	import type { Product } from '$lib/interfaces/product.interface';

	const { data } = $props();

	let valid_data: Array<Product> | undefined = $state(undefined);
	let invalid_data: Array<any> | undefined = $state(undefined);

	const warehouses = data.warehouses;
</script>

<div class="flex min-h-full flex-col items-center justify-center p-3 select-none lg:p-5">
	{#if valid_data}
		<ProcessedProductsForm data={valid_data} />
	{:else if invalid_data}
		<InvalidRows data={invalid_data} />
	{:else}
		<AddProductsForm {warehouses} data={data.addProductsform} bind:valid_data bind:invalid_data />
	{/if}
</div>

<!-- <div class="m-auto flex flex-col items-center justify-center p-2 select-none lg:h-full">
	<h1 class="title">Actualizar Producto:</h1>
	<form
		action="?/process_csv_file"
		enctype="multipart/form-data"
		method="POST"
		class="grid w-full grid-cols-2 gap-2 p-4 lg:aspect-square lg:w-1/3"
		use:enhance
	>
		<fieldset class="fieldset border-base-300 rounded-box col-span-2 w-full border p-4">
			<legend class="fieldset-legend text-base-format">archivo.csv:</legend>
			<input
				type="file"
				name="file"
				class={`file-input validator w-full ${$errors.file ? '!file-input-error' : ''}`}
				required
				accept="text/csv"
				placeholder="costo"
				aria-invalid={$errors.file ? 'true' : undefined}
				bind:value={$form.file}
			/>

			{#if $errors.file}
				<span class="text-ellipsis text-red-500">
					{$errors.file}
				</span>
			{/if}
		</fieldset>

		<fieldset class="fieldset border-base-300 rounded-box col-span-1 w-full border p-4">
			<legend class="fieldset-legend text-base-format">logistics:</legend>
			<input
				type="number"
				name="logistics"
				class={`input validator w-full ${$errors.logistics ? '!input-error' : ''}`}
				placeholder="0"
				required
			/>

			{#if $errors.logistics}
				<span class="text-ellipsis text-red-500">
					{$errors.logistics}
				</span>
			{/if}
		</fieldset>

		<fieldset class="fieldset border-base-300 rounded-box col-span-1 w-full border p-4">
			<legend class="fieldset-legend text-base-format">taxes:</legend>
			<input
				type="number"
				name="taxes"
				class={`input validator w-full ${$errors.taxes ? '!input-error' : ''}`}
				placeholder="0"
				required
			/>

			{#if $errors.taxes}
				<span class="text-ellipsis text-red-500">
					{$errors.taxes}
				</span>
			{/if}
		</fieldset>

		<fieldset class="fieldset border-base-300 rounded-box col-span-2 w-full border p-4">
			<legend class="fieldset-legend text-base-format">almacen:</legend>

			<select
				class={`select validator w-full ${$errors.stored_at ? '!select-error' : ''}`}
				required
				name="stored_at"
			>
				{#each warehouses as warehouse (warehouse.id)}
					<option value={warehouse.id}>{warehouse.name}</option>
				{/each}
			</select>

			{#if $errors.stored_at}
				<span class="text-ellipsis text-red-500">
					{$errors.stored_at}
				</span>
			{/if}
		</fieldset>

		{#if $submitting}
			<span class="loader-ring col-span-2 place-self-center"></span>
		{:else}
			<button class="btn col-span-2 place-self-center" type="submit">
				Update<CheckIcon />
			</button>
		{/if}
	</form>
</div> -->
