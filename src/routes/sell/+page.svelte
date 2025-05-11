<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import CheckIcon from '$lib/icons/check.icon.svelte';
	import { goto } from '$app/navigation';
	import type { Client } from '$lib/interfaces/client.interface.js';

	let { data } = $props();

	const { form, errors, message, enhance, submitting, constraints } = superForm(data.form);

	$effect(() => {
		if ($message && $message.type == 'success') {
			const client = $message.data as Client;
			goto(`/sell/${client.id}`);
		}
	});
</script>

<div class="flex min-h-full flex-col items-center justify-center p-2 select-none">
	<h1 class="title">Datos del Cliente</h1>
	<p class="text-xs">Datos del cliente</p>

	<form
		action=""
		method="post"
		class="m-4 flex w-[300px] flex-col items-center gap-2 whitespace-nowrap"
		use:enhance
	>
		<fieldset
			class="fieldset border-base-300 rounded-box col-span-2 w-full border p-4 lg:col-span-1"
		>
			<legend class="fieldset-legend text-base-format">numero de telefono:</legend>
			<input
				type="tel"
				name="phone"
				class={`input validator w-full ${$errors.phone ? '!input-error' : ''}`}
				required
				placeholder="telefono: +58"
				aria-invalid={$errors.phone ? 'true' : undefined}
				{...$constraints.phone}
				bind:value={$form.phone}
			/>
			<span>campo requerido</span>
			{#if $errors.phone}
				<span class="text-ellipsis text-red-500">
					{$errors.phone}
				</span>
			{/if}
		</fieldset>

		<fieldset
			class="fieldset border-base-300 rounded-box col-span-2 w-full border p-4 lg:col-span-1"
		>
			<legend class="fieldset-legend text-base-format">nombre:</legend>
			<input
				type="text"
				name="name"
				class={`input validator w-full ${$errors.name ? '!input-error' : ''}`}
				placeholder="nombre: Pedro"
				aria-invalid={$errors.name ? 'true' : undefined}
				{...$constraints.name}
				bind:value={$form.name}
			/>
			{#if $errors.name}
				<span class="text-ellipsis text-red-500">
					{$errors.name}
				</span>
			{/if}
		</fieldset>

		<fieldset
			class="fieldset border-base-300 rounded-box col-span-2 w-full border p-4 lg:col-span-1"
		>
			<legend class="fieldset-legend text-base-format">apellido:</legend>
			<input
				type="text"
				name="lastname"
				class={`input validator w-full ${$errors.name ? '!input-error' : ''}`}
				placeholder="apellido: Perez"
				aria-invalid={$errors.lastname ? 'true' : undefined}
				{...$constraints.lastname}
				bind:value={$form.lastname}
			/>
			{#if $errors.lastname}
				<span class="text-ellipsis text-red-500">
					{$errors.lastname}
				</span>
			{/if}
		</fieldset>

		{#if $submitting}
			<span class="loading loading-ring loading-xl"></span>
		{:else}
			<button class="btn border border-[#e5e5e5]" type="submit">
				<CheckIcon />
			</button>
		{/if}
	</form>
</div>
