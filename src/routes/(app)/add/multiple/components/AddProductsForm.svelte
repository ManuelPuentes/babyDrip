<script lang="ts">
	import CheckIcon from '$lib/icons/check.icon.svelte';

	interface Props {
		warehouses: Array<any>;
	}

	const { warehouses }: Props = $props();
</script>

<section class="flex flex-col items-center">
	<h1 class="w-fit text-2xl font-semibold ">Agregar Productos</h1>
	<form
		action="?/process_csv_file"
		enctype="multipart/form-data"
		method="post"
		class=" grid aspect-square w-full max-w-[500px] grid-cols-2 gap-4 p-4"
	>
		<fieldset class="fieldset col-span-2 text-sm">
			<legend class="fieldset-legend">archivo.csv</legend>
			<input type="file" name="csv" accept=".csv" class="file-input w-full" required />
		</fieldset>

		<fieldset class="fieldset col-span-2 text-sm">
			<legend class="fieldset-legend">almacen</legend>
			<select class="select validator w-full" required name="warehouse">
				<option disabled selected value="">Choose</option>
				{#each warehouses as warehouse (warehouse.id)}
					<option value={warehouse.id}>{warehouse.name}</option>
				{/each}
			</select>
		</fieldset>

		<fieldset class="fieldset col-span-1 text-sm">
			<legend class="fieldset-legend">logistica</legend>
			<input
				type="number"
				name="logistics"
				class="input validator w-full"
				placeholder="0"
				required
			/>
		</fieldset>

		<fieldset class="fieldset col-span-1 text-sm">
			<legend class="fieldset-legend">taxes</legend>
			<input type="number" name="taxes" class="input validator w-full" placeholder="0" required />
		</fieldset>

		<button class="btn btn-lg col-span-2 border border-[#e5e5e5]" type="submit">
			<CheckIcon />
		</button>
	</form>
</section>
