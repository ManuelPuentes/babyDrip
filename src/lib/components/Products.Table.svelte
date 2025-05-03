<script lang="ts">
	import type { Product } from '$lib/interfaces/product.interface';

	interface Props {
		data: Array<Product>;
	}
	const { data }: Props = $props();

	let products = $state<Array<Product>>(data);
</script>

{#if products.length}
	<table class="table-xs table-pin-rows table-pin-cols table-zebra m-5 w-full">
		<thead>
			<tr>
				<td>ID</td>
				<td>Description</td>
				<td>Size</td>
				<td class="hidden lg:flex">Cost</td>
				<td>Price</td>
			</tr>
		</thead>

		<tbody>
			{#each products as product, index (product.id)}
				<tr class="cursor-pointer hover:!bg-zinc-200">
					<td class="content-start text-sm">{index + 1}</td>
					<td class="content-start text-sm">{product.description}</td>
					<td class="content-start text-sm">{product.size}</td>
					<td class="hidden content-start text-sm lg:flex"
						>{parseFloat(String(product.cost / 100)).toFixed(2)}</td
					>
					<td class="content-start text-sm"
						>{parseFloat(String(product.sold_price / 100)).toFixed(2)}</td
					>
				</tr>
			{/each}
		</tbody>
	</table>
{:else}
	<span class="text-sm">no hay productos</span>
{/if}
