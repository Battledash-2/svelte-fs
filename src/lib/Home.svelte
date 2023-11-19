<script>
	import { getContext } from 'svelte';
	import Folder from './Folder.svelte';
	import Config from '../Config.js';
	import { get } from 'svelte/store';

	const ctx = getContext(Config.glblKey);
</script>

<Folder folder={get(ctx.folders).find((/** @type {{ uuid: string; }} */ f) => f.uuid === 'root')} />
