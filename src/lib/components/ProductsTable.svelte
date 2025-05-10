<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Snippet } from 'svelte';

	interface Props {
		data: Array<{
			id: string;
			cost: number;
			sold_price: number;
			size: string;
			description: string;
			stored_at: string;
		}>;

		children?: Snippet;
	}

	let { data, children }: Props = $props();

	const formatNumber = (value: number) => parseFloat(String(value / 100)).toFixed(2);
</script>

<div class="flex w-full flex-col p-3 select-none lg:p-5">
	{#if data.length}
		<table class="table-pin-rows table-pin-cols table-zebra table-xs table w-full">
			<thead class="text-base-format">
				<tr>
					<td></td>
					<td>Descripcion</td>
					<td>Talla</td>
					<td class="hidden lg:flex">Costo</td>
					<td>Precio</td>
				</tr>
			</thead>

			<tbody>
				{#each data as product, index (product.id)}
					<tr
						class="hover:!bg-base-300 cursor-pointer"
						onclick={() => {
							goto(`/search/product/${product.id}`);
						}}
					>
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
		<div class="hero">
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

	{#if children}
		{@render children()}
	{/if}
</div>
