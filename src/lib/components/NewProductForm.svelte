<script lang="ts">
	import { onMount } from 'svelte';
	import type { Warehouse } from '$lib/interfaces/warehouse.interface';
	import { getWarehouses } from '$lib/api/getWarehouses.api';
	import CheckIcon from '$lib/icons/check.icon.svelte';

	export let data;

	let { supabase } = data;

	let warehouses: Array<Warehouse> = [];

	onMount(async () => {
		warehouses = (await getWarehouses(supabase)).data;
	});
</script>

<div class="flex flex-col items-center rounded-2xl border p-4">
	<h1 class="text-2xl font-semibold">Sistema de Facturación</h1>

	<form
		action=""
		method="post"
		class="m-4 flex w-[300px] flex-col items-center gap-2 whitespace-nowrap"
	>
		<fieldset class="fieldset w-[100%]">
			<input
				type="number"
				class="input validator tabular-nums"
				required
				placeholder="coste del producto"
				pattern="[0-9]*"
				minlength="1"
				title="Must be 10 digits"
			/>
			<p class="validator-hint overflow-hidden text-ellipsis">debes ingresar un valor</p>
		</fieldset>

		<fieldset class="fieldset w-[100%]">
			<input
				type="number"
				class="input validator tabular-nums"
				required
				placeholder="precio de venta"
				pattern="[0-9]*"
				minlength="1"
				title="Must be 10 digits"
			/>
			<p class="validator-hint overflow-hidden text-ellipsis">debes ingresar un valor</p>
		</fieldset>

		<fieldset class="fieldset w-[100%]">
			<input
				type="text"
				class="input validator"
				required
				placeholder="talla del producto"
				pattern="[A-Za-z][A-Za-z0-9\-]*"
				minlength="1"
				title="Only letters, numbers or dash"
			/>
			<p class=" validator-hint overflow-hidden text-ellipsis">
				debes ingresar un valor
			</p>
		</fieldset>

		<fieldset class="fieldset w-[100%]">
			<select class="select  validator" required>
				<option disabled selected value="">selecciona un almacen</option>

				{#each warehouses as warehouse}
					<option value={warehouse.id}>{warehouse.name}</option>
				{/each}
			</select>

			<p class="validator-hint overflow-hidden text-ellipsis">debes seleccionar 1</p>
		</fieldset>

		<fieldset class="fieldset w-[100%]">
			<textarea class="textarea validator" placeholder="descripcion del producto" required
			></textarea>

            <p class=" validator-hint overflow-hidden text-ellipsis">
				debes ingresar un valor
			</p>

		</fieldset>

		<button class="btn border border-[#e5e5e5]">
			<CheckIcon />
		</button>
	</form>
</div>
