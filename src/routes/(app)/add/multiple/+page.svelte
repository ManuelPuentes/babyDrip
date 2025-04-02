<script lang="ts">
	import CheckIcon from '$lib/icons/check.icon.svelte';
	import Alert from '$lib/components/Alert.svelte';

	export let data;

	const { warehouses } = data;

	let alertRef: Alert;

	export let form;
	$: ({ error, success, count } = form ?? {
		error: null as any,
		success: false,
		count: 0 as number
	});

	$: {
		if (error && alertRef && Object.keys(error).length) {
			alertRef.showAlert('algunas entradas no cumplen los criterios necesarios ', 'alert-error');
		}
	}

	$: {
		if (success && alertRef) {
			alertRef.showAlert(`products agregados de forma exitosa ${count}`, 'alert-success');
		}
	}
</script>

<div class="flex h-screen w-screen items-center justify-center">
	<Alert bind:this={alertRef} class="self-start" />

	{#if error?.invalidRows?.length > 0}
		<div
			class="m-auto flex min-h-[70%] w-[90%] max-w-[700px] flex-col items-center gap-0 rounded-2xl border border-gray-400 p-4 select-none lg:min-h-1/2 lg:w-1/2"
		>
			<h1 class="w-[100%] text-center text-2xl font-semibold">Errores detectados</h1>

			<table class="table-xs table-pin-rows table-pin-cols m-4 w-4/5 select-none">
				<thead class="border-b">
					<tr>
						<th>row</th>
						{#each Object.keys(error.invalidRows[0].data) as key (key)}
							<th>{key.replace('_', ' ')}</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each error.invalidRows as row (row.row)}
						<tr class="hover:bg-base-300 cursor-pointer">
							<th>{row.row}</th>
							{#each Object.values(row.data) as element}
								<th>{element}</th>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<form
			action=""
			enctype="multipart/form-data"
			method="post"
			class=" flex aspect-square w-4/5 flex-col items-center justify-center gap-2 rounded-2xl border border-gray-400 p-4 select-none lg:w-1/4"
		>
			<h1 class="w-[100%] text-center text-2xl font-semibold">Agregar Producto</h1>
			<fieldset class="fieldset w-3/4">
				<legend class="fieldset-legend">archivo.csv</legend>

				<input type="file" name="csv" accept=".csv" class="file-input w-full" required />
			</fieldset>
			<fieldset class="fieldset w-3/4">
				<legend class="fieldset-legend">almacen</legend>

				<select class="select validator w-full" required name="warehouse">
					<option disabled selected value="">Choose</option>
					{#each warehouses as warehouse (warehouse.id)}
						<option value={warehouse.id}>{warehouse.name}</option>
					{/each}
				</select>
			</fieldset>

			<button class="btn btn-lg border border-[#e5e5e5]" type="submit">
				<CheckIcon />
			</button>
		</form>
	{/if}
</div>
