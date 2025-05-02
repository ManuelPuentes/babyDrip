<script lang="ts">
	import type { Snippet } from 'svelte';
	let modalElement: HTMLDialogElement;

	interface Props {
		header: string;
		content: string;
		button_text: string;
		on_close: () => void;
		children?: Snippet;
	}
	const { header, content, button_text, on_close, children }: Props = $props();

	export const openModal = () => {
		modalElement.showModal();
	};
</script>

<dialog class="modal" bind:this={modalElement} onclose={on_close}>
	<div class="modal-box flex w-fit flex-col items-center">
		<h3 class="text-2xl font-semibold">{header}</h3>
		<pre class="text-md !font-light text-balance">{content}</pre>

		{#if children}
			{@render children()}
		{/if}

		<div class="modal-action my-2 border">
			<form method="dialog">
				<button class="btn">{button_text}</button>
			</form>
		</div>
	</div>
</dialog>
