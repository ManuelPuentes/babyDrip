<script lang="ts">
	const { error } = $props();
</script>

<h1 class="w-[100%] text-center text-2xl font-semibold">Errores detectados</h1>

<table class="table-xs table-pin-rows table-pin-cols table-zebra m-5 w-full">
	<thead>
		<tr>
			<td>row</td>
			<td>Cost</td>
			<td>Price</td>
			<td>Description</td>
			<td>Size</td>
		</tr>
	</thead>
	<tbody>
		{#each error.data as row (row.row)}
			<tr class="cursor-pointer hover:bg-zinc-100">
				<td class="content-start text-sm">{row.row}</td>
				<td class="content-start text-sm">{row.cost}</td>
				<td class="content-start text-sm">{row.sold_price}</td>
				<td class="content-start text-sm">{row.description}</td>
				<td class="content-start text-sm">{row.size}</td>
			</tr>
		{/each}
	</tbody>
</table>
