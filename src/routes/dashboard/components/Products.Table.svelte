<script lang="ts">
	import type { Product } from '$lib/interfaces/product.interface';

	interface Props {
		data: Array<Product>;
	}
	const { data }: Props = $props();

	let products = $state<Array<Product>>(data);

	const formatNumber = (value: number) => parseFloat(String(value / 100)).toFixed(2);
</script>

{#if products.length}
	<table class="table-pin-rows table-pin-cols table-zebra table w-full">
		<thead class="text-base-format">
			<tr>
				<td></td>
				<td>Description</td>
				<td>Size</td>
				<td class="hidden lg:flex">Cost</td>
				<td>Price</td>
			</tr>
		</thead>

		<tbody>
			{#each products as product, index (product.id)}
				<tr class="hover:!bg-base-300 cursor-pointer">
					<td class="text-base-format">{index + 1}</td>
					<td class="text-base-format">{product.description}</td>
					<td class="text-base-format">{product.size}</td>
					<td class="text-base-format hidden lg:flex">{formatNumber(product.cost)}</td>
					<td class="text-base-format">{formatNumber(product.sold_price)}</td>
				</tr>
			{/each}
		</tbody>
	</table>
{:else}
	<div class="hero min-h-[calc(100vh-130px)] lg:min-h-[calc(100vh-64px)]">
		<div class="hero-content text-center">
			<div class="max-w-md">
				<h1 class="title">Inventario Vacio.</h1>
				<p class="text-base-format py-6">
					Agrega productos a tu inventario y los veras en esta pestana.
				</p>
			</div>
		</div>
	</div>
{/if}
