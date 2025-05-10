<script lang="ts">
	const { data } = $props();
</script>

<h1 class="title p-4">Errores detectados</h1>

<table class="table-pin-rows table-pin-cols table-zebra table-xs table w-full">
	<thead class="text-base-format">
		<tr>
			<td></td>
			<td>Descripcion</td>
			<td>Talla</td>
			<td>Costo</td>
			<td>Precio</td>
		</tr>
	</thead>
	<tbody>
		{#each data as row (row.row)}
			<tr class="hover:!bg-base-300 text-base-format cursor-pointer">
				<td class="">{row.row}</td>
				<td>{row.errors.description}</td>
				<td>{row.errors.size}</td>
				<td>{row.errors.cost}</td>
				<td>{row.errors.sold_price}</td>
			</tr>
		{/each}
	</tbody>
</table>
