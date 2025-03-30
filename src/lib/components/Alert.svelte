<!-- Alert.svelte -->
<script lang="ts">
	type AlertType = 'alert-success' | 'alert-warning' | 'alert-error' | 'alert-info';

	import { fade } from 'svelte/transition';
	export let message = '';
	export let type: AlertType = 'alert-info';
	export let duration = 3000;
	export let show = false;

	export function showAlert(msg: string, alertType: AlertType = 'alert-info', alertDuration = 3000) {
		message = msg;
		type = alertType;
		duration = alertDuration;
		show = true;

		setTimeout(() => {
			show = false;
		}, duration);
	}
</script>

{#if show}
	<div transition:fade class={`alert ${type} alert-soft absolute w-full rounded-none`}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			class="h-6 w-6 shrink-0 stroke-current"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			></path>
		</svg>
		<span>{message}</span>
	</div>
{/if}
