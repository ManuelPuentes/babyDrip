<script lang="ts">
	import TimesIcon from '$lib/icons/times.icon.svelte';
	import type { Product } from '$lib/interfaces/product.interface';

	interface Props {
		products: Array<Product>;
		tasaBCV: number;
		total: number;
	}
	let { products = $bindable([]), tasaBCV, total = $bindable(0) }: Props = $props();

	const removeElement = (event: MouseEvent) => {
		if (event.target instanceof HTMLElement && event.target.parentElement?.id) {
			const ID = event.target?.parentElement?.id;
			products = products.filter((item) => item.id != ID);
		}
	};

	$effect(() => {
		total = products.reduce(
			(accumulator, currentValue) => accumulator + (currentValue.sold_price ?? 0),
			0
		);
	});
</script>

<h1 class="title">Factura:</h1>

{#if products.length}
	<table class="table-xs table-pin-rows table-pin-cols table-zebra w-full">
		<thead>
			<tr>
				<td>ID</td>
				<td>Description</td>
				<td>Price</td>
				<td></td>
			</tr>
		</thead>

		<tbody>
			{#each products as product, index (product.id)}
				<tr class="cursor-pointer hover:!bg-zinc-200">
					<td class="content-start text-sm">{index + 1}</td>
					<td class="content-start text-sm">{product.description}</td>
					<td class="content-start text-sm"
						>{parseFloat(String(product.sold_price / 100)).toFixed(2)}</td
					>
					<td
						><button onclick={removeElement} id={product.id} class="hover:scale-150"
							><TimesIcon class="w-3" /></button
						></td
					>
				</tr>
			{/each}
		</tbody>
	</table>
	<h2 class="p-2 text-sm">
		<strong>total:</strong>{parseFloat(String(total / 100)).toFixed(2)}
		<strong>USD</strong>/{parseFloat(String(tasaBCV * (total / 100))).toFixed(2)}
		<strong>BSV</strong>
	</h2>
{:else}
	<span class="text-base-format">no hay productos</span>
{/if}
