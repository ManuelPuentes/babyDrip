<script lang="ts">
	import CheckIcon from '$lib/icons/check.icon.svelte';
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

<div
	class="flex max-w-[700px] flex-col items-center overflow-x-hidden overflow-y-auto p-4 select-none md:m-auto md:max-h-1/3 lg:min-h-1/2 lg:w-1/2"
>
	{#if success && result}
		<ProcessedProductsForm data={result} />
	{:else if error?.type == AddProductsErrorTypesEnum.CSV_INVALID_ROWS}
		<InvalidRows {error} />
	{:else}
		<AddProductsForm {warehouses} />
	{/if}
</div>
