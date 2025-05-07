<script>
	import HomeIcon from '$lib/icons/home.icon.svelte';
	import CartIcon from '$lib/icons/cart.icon.svelte';
	import GraphIcon from '$lib/icons/graph.icon.svelte';
	import SearchIcon from '$lib/icons/search.icon.svelte';
</script>

<div class="dock border shadow-sm md:hidden">
	<a href="/dashboard"><HomeIcon />Home</a>
	<a href="/search"><SearchIcon />Search</a>
	<a href="/sell"><CartIcon />Sell</a>
	<a href="/analytics"><GraphIcon />Analytics</a>
</div>
