<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import CheckIcon from '$lib/icons/check.icon.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import Alert from '$lib/components/Alert.svelte';
	import { goto } from '$app/navigation';

	let { data } = $props();

	const { form, errors, message, enhance, submitting } = superForm(data.form);
	const { product, warehouses } = data;

	$effect(() => {
		if ($message && $message.type == 'error') {
			alertRef.showAlert($message.text, 'alert-error');
		}
	});

	$effect(() => {
		if ($message && $message.type == 'success') {
			modalRef.openModal();
		}
	});

	let alertRef: Alert;
	let modalRef: Modal;
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

<div
	class="flex max-w-[1920px] flex-col items-center justify-center p-2 select-none lg:h-full m-auto"
>
	<h1 class="title">Actualizar Producto:</h1>

	<form
		method="POST"
		use:enhance
		class="grid w-full grid-cols-2 gap-2 p-4 lg:aspect-square lg:w-1/3"
	>
		<fieldset class="fieldset col-span-2 w-full lg:col-span-1">
			<legend class="fieldset-legend text-base-format">precio de venta:</legend>
			<input
				type="number"
				name="cost"
				class={`input validator w-full ${$errors.cost ? '!input-error' : ''}`}
				required
				placeholder="costo"
				pattern="[0-9]*"
				aria-invalid={$errors.cost ? 'true' : undefined}
				bind:value={$form.cost}
			/>
			{#if $errors.cost}
				<span class="text-ellipsis text-red-500">
					{$errors.cost}
				</span>
			{/if}
		</fieldset>

		<fieldset class="fieldset col-span-2 w-full lg:col-span-1">
			<legend class="fieldset-legend text-base-format">costo:</legend>
			<input
				type="number"
				name="sold_price"
				class={`input validator w-full ${$errors.sold_price ? '!input-error' : ''}`}
				required
				placeholder="precio de venta"
				pattern="[0-9]*"
				aria-invalid={$errors.sold_price ? 'true' : undefined}
				bind:value={$form.sold_price}
			/>
			{#if $errors.sold_price}
				<span class="text-ellipsis text-red-500">
					{$errors.sold_price}
				</span>
			{/if}
		</fieldset>

		<fieldset class="fieldset col-span-2 w-full lg:col-span-1">
			<legend class="fieldset-legend text-base-format">talla:</legend>
			<input
				type="text"
				name="size"
				class={`input validator w-full ${$errors.size ? '!input-error' : ''}`}
				required
				placeholder="talla del producto"
				minlength="1"
				aria-invalid={$errors.size ? 'true' : undefined}
				bind:value={$form.size}
			/>
			{#if $errors.size}
				<span class="text-ellipsis text-red-500">
					{$errors.size}
				</span>
			{/if}
		</fieldset>

		<fieldset class="fieldset col-span-2 w-full lg:col-span-1">
			<legend class="fieldset-legend text-base-format">almacen:</legend>

			<select
				class={`select validator w-full ${$errors.stored_at ? '!select-error' : ''}`}
				required
				name="stored_at"
			>
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
				class={`textarea validator w-full ${$errors.description ? '!textarea-error' : ''}`}
				placeholder="descripcion del producto"
				required
				bind:value={$form.description}
				aria-invalid={$errors.description ? 'true' : undefined}
			></textarea>
			{#if $errors.description}
				<span class="text-ellipsis text-red-500">
					{$errors.description}
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
</div>
