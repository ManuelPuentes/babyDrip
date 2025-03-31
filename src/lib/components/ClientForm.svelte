<script lang="ts">
	import type { Client } from '../interfaces/client.interface';
	import CheckIcon from '$lib/icons/check.icon.svelte';

	export let client: Client = {
		name: 'manuel',
		lastname: 'puentes',
		phone: 1234567890
	};

	export let setted: boolean = false;

	const validateCLient = () => {
		if (client.name && client.lastname && client.phone) setted = true;
	};
</script>

<div
	class="m-auto flex w-[90%] flex-col items-center self-center rounded-2xl border border-[#e5e5e5] p-2"
>
	<h1 class="p-3 text-2xl font-semibold">Sistema de Facturación</h1>
	<p class="text-xs">Datos del cliente</p>

	<form class="flex flex-col p-4">
		<label for="">Nombre</label>
		<input
			type="input"
			class="input validator"
			required
			placeholder="Nombre"
			pattern="[A-Za-z][A-Za-z0-9\-]*"
			minlength="1"
			maxlength="30"
			title="Only letters, numbers or dash"
			bind:value={client.name}
		/>
		<p class="validator-hint">
			Must be 3 to 30 characters
			<br />containing only letters, numbers or dash
		</p>

		<label for="">Apellido</label>
		<input
			type="input"
			class="input validator"
			required
			placeholder="Apellido"
			pattern="[A-Za-z][A-Za-z0-9\-]*"
			minlength="3"
			maxlength="30"
			title="Only letters, numbers or dash"
			bind:value={client.lastname}
		/>
		<p class="validator-hint">
			Must be 3 to 30 characters
			<br />containing only letters, numbers or dash
		</p>

		<label for="">Telefono</label>
		<input
			type="tel"
			class="input validator tabular-nums"
			required
			placeholder="Phone"
			pattern="[0-9]*"
			minlength="10"
			maxlength="10"
			title="Must be 10 digits"
			bind:value={client.phone}
		/>
		<p class="validator-hint">Must be 10 digits</p>

		<button class="btn border border-[#e5e5e5]" onclick={validateCLient}>
			<CheckIcon />
		</button>
	</form>
</div>
