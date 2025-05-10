<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import CheckIcon from '$lib/icons/check.icon.svelte';

	let { data, warehouses, valid_data = $bindable(), invalid_data = $bindable() } = $props();
	const { form, errors, message, enhance, submitting } = superForm(data);

	$effect(() => {
		if ($message && $message.type == 'success' && $message.data) {
			valid_data = $message.data;
		}
	});

	$effect(() => {
		if ($message && $message.type == 'error' && $message.data) {
			invalid_data = $message.data;
		}
	});
</script>

<h1 class="title">Agregar Productos:</h1>
<form
	action="?/process_csv_file"
	enctype="multipart/form-data"
	method="POST"
	class="grid w-full grid-cols-2 gap-2 p-4 lg:aspect-square lg:w-1/3"
	use:enhance
	id="proccess_csv_form"
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
		<legend class="fieldset-legend text-base-format">logistica:</legend>
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
		<legend class="fieldset-legend text-base-format">impuestos:</legend>
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
