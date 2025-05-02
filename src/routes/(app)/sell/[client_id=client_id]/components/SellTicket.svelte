<script lang="ts">
	import TimesIcon from '$lib/icons/times.icon.svelte';
	import type { Product } from '$lib/interfaces/product.interface';

	interface Props {
		products: Array<Product>;
		tasaBCV: number;
		total: number;
	}
	let { products = $bindable([]), tasaBCV, total = $bindable(0) }: Props = $props();

	const removeElement = (event: any) => {
		if (event.target?.parentElement?.id) {
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

<div class="flex items-center">
	<h1 class="p-3 text-2xl font-semibold">Factura</h1>

	<div class="tooltip tooltip-bottom" data-tip="escanea QR para agregarlos a la factura">
		<div class="btn m-0 h-6 w-6 rounded-full bg-none p-0">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				width="24px"
				height="24px"
				class=" stroke-current"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				></path>
			</svg>
		</div>
	</div>
</div>

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
			{#each products as product, index}
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
	<h2 class="text-sm p-2">
		<strong>total:</strong>{parseFloat(String(total / 100)).toFixed(2)}
		<strong>USD</strong>/{parseFloat(String(tasaBCV * (total / 100))).toFixed(2)}
		<strong>BSV</strong>
	</h2>
{:else}
	<span class="text-sm">no hay productos</span>
{/if}
