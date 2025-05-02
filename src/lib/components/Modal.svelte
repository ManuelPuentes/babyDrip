<script lang="ts">
	let modalElement: HTMLDialogElement;

	interface Props {
		header: string;
		content: string;
		button_text: string;
		on_close: () => void;
	}
	const { header, content, button_text, on_close }: Props = $props();

	export const openModal = () => {
		modalElement.showModal();
	};
</script>

<dialog class="modal" bind:this={modalElement} onclose={on_close}>
	<div class="modal-box flex w-fit flex-col items-center">
		<h3 class="text-2xl font-semibold">{header}</h3>

		<p class="text-md !font-light">{content}</p>
		<div class="modal-action">
			<form method="dialog">
				<button class="btn">{button_text}</button>
			</form>
		</div>
	</div>
</dialog>
