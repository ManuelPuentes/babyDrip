<script lang="ts">
	import CheckIcon from '$lib/icons/check.icon.svelte';
	import { enhance } from '$app/forms';
	import type { Client } from '$lib/interfaces/client.interface.js';

	let creating = false;

	export let form;
	$: ({ formData, errors } = form ?? {
		formData: {} as Client,
		errors: {} as Record<string, string>
	});

	const handleSubmit = () => {
		creating = true;
		return async ({ update }: any) => {
			await update();
			creating = false;
		};
	};
</script>

<div
	class="flex max-w-[700px] flex-col items-center p-4 select-none lg:m-auto lg:min-h-1/2 lg:w-1/2"
>
	<h1 class="p-3 text-2xl font-semibold">Sistema de Facturación</h1>
	<p class="text-xs">Datos del cliente</p>

	<form
		action=""
		method="post"
		class="m-4 flex w-[300px] flex-col items-center gap-2 whitespace-nowrap"
		use:enhance={handleSubmit}
	>
		<fieldset class="fieldset w-[100%]">
			<input
				type="text"
				name="name"
				class="input validator {errors?.name ? 'valid:border-red-500' : ''}"
				required
				placeholder="nombre del cliente"
				pattern="[A-Za-z][A-Za-z0-9\-]*"
				minlength="1"
				value={formData.name ?? ''}
				aria-invalid={errors?.name ? 'true' : undefined}
			/>

			{#if errors?.name}
				<p class=" overflow-hidden text-ellipsis text-red-500">{errors.name}</p>
			{:else}
				<p class="validator-hint overflow-hidden text-ellipsis">debes ingresar un valor</p>
			{/if}
		</fieldset>

		<fieldset class="fieldset w-[100%]">
			<input
				type="text"
				name="lastname"
				class="input validator {errors?.lastname ? 'valid:border-red-500' : ''}"
				required
				placeholder="apellido del cliente"
				pattern="[A-Za-z][A-Za-z0-9\-]*"
				minlength="1"
				value={formData.lastname ?? ''}
				aria-invalid={errors?.lastname ? 'true' : undefined}
			/>

			{#if errors?.lastname}
				<p class=" overflow-hidden text-ellipsis text-red-500">{errors.lastname}</p>
			{:else}
				<p class="validator-hint overflow-hidden text-ellipsis">debes ingresar un valor</p>
			{/if}
		</fieldset>

		<fieldset class="fieldset w-[100%]">
			<input
				type="tel"
				name="phone"
				class="input validator tabular-nums {errors?.phone ? 'valid:border-red-500' : ''}"
				placeholder="numero de telefono"
				pattern="\+?[\d\s-]"
				minlength="10"
				maxlength="15"
				value={formData?.phone ? String(formData.phone) : null}
				aria-invalid={errors?.phone ? 'true' : undefined}
			/>

			{#if errors?.phone}
				<p class=" overflow-hidden text-ellipsis text-red-500">{errors.phone}</p>
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
