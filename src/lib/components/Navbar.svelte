<script lang="ts">
	import HomeIcon from '$lib/icons/home.icon.svelte';
	import CartIcon from '$lib/icons/cart.icon.svelte';
	import AddIcon from '$lib/icons/add.icon.svelte';
	import QrIcon from '$lib/icons/qr.icon.svelte';
	import GraphIcon from '$lib/icons/graph.icon.svelte';
	import SearchIcon from '$lib/icons/search.icon.svelte';

	interface Props {
		logout: () => Promise<void>;
	}
	const props: Props = $props();
	const logout = props.logout;
</script>

<div class="navbar bg-base-100 shadow-sm">
	<div class="navbar-start">
		<span class="btn btn-ghost text-xl">babyDrip</span>
	</div>

	<div class="navbar-center z-10 hidden md:flex">
		<ul class="menu menu-horizontal px-1">
			<li><a href="/dashboard"><HomeIcon />Home</a></li>
			<li><a href="/search"><SearchIcon />Search</a></li>
			<li><a href="/sell"><CartIcon />Sell</a></li>
			<li>
				<a href="/add/multiple"><AddIcon class="w-5" /> Add Products</a>
			</li>
			<!-- <li>
            <details bind:open={submenu} class="dropdown">
                <summary><AddIcon />Add</summary>

                <ul class="p-2">
                    <li on:click|stopPropagation><a href="/add"><AddIcon />Add single</a></li>
                    <li on:click|stopPropagation={toggleSubmenu}>
                        <a href="/add/multiple"><FileIcon /> Add multiple</a>
                    </li>
                </ul>
            </details>
        </li> -->
			<li><a href="/qr"><QrIcon />Print QR</a></li>
			<li><a href="/analytics"><GraphIcon />Analytics</a></li>
		</ul>
	</div>

	<div class="navbar-end">
		<button onclick={logout} class="btn border-[#e5e5e5]">Sign Out</button>
	</div>
</div>
