<script type="ts">
	// @ts-nocheck
	export let recent;
</script>

<div id="nav">
	<a href="./"><h3>SvelteFS</h3></a>
	{#if recent.length > 0} <hr /> {/if}
	{#each recent as item}
		<div class="item">{item}</div>
	{/each}
</div>

<style>
	#nav {
		width: 100svw;
		height: 3.5rem;
		background-color: var(--bg-secondary);
		display: flex;
		align-items: center;
		padding: 1rem;
	}
	#nav > .item {
		color: var(--color-secondary);
		margin-right: 0.8rem;
	}
	#nav > a {
		text-decoration: none;
		color: var(--color);
	}
	#nav > hr {
		margin-left: 1rem;
		margin-right: 1rem;
	}
</style>
