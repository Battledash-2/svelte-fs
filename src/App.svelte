<!-- svelte-ignore missing-declaration -->
<script lang="ts">
	// @ts-nocheck
	import { Router, Route, navigate } from 'svroutes';

	import Navbar from './common/Navbar.svelte';
	import Config from './Config.js';
	import Home from './lib/Home.svelte';
	import { setContext } from 'svelte';
	import get from './lib/localStorage';
	import Folder from './lib/Folder.svelte';
	import File from './lib/File.svelte';

	const urlState = location.hash;
	if (urlState) {
		console.log('detected state');
		navigate(new URL(urlState.slice(1), location.href).href);
	}

	let files = get(Config.filesKey, []);
	let folders = get(Config.foldersKey, [
		{
			uuid: 'root',
			parent: null,
			name: 'root',
			files: [],
			folders: [],
		},
	]);
	let recent = get(Config.recentKey, []);
	setContext(Config.glblKey, { files, folders, recent });

	function getFolder(path, within = $folders.find((c) => c.uuid === 'root')) {
		let split = decodeURIComponent(path).split('/');
		if (split[0].startsWith('/')) split[0] = split[0].substring(1);
		if (split[0] === 'root') split.splice(0, 1);
		split = split.filter((p) => !!p);

		let folder = within;

		for (let item of split) {
			folder = $folders.find(
				(f) =>
					f.uuid ===
					folder.folders.find((id) => {
						return $folders.find((c) => c.uuid === id).name === item;
					})
			);
		}

		return folder;
	}

	function getFile(path, within = $folders.find((c) => c.uuid === 'root')) {
		const split = path.split('/');
		const folder = getFolder(split.slice(0, -1).join('/'));
		const fname = split.at(-1);

		const file = $files.find((f) => f.parent === folder.uuid && f.name === fname);

		return [file, folder];
	}

	if (location.pathname === '/svelte-fs') navigate('/svelte-fs/');
</script>

<Navbar {recent} />
<div id="container">
	<Router>
		<Route path="svelte-fs/edit/.*" let:wildcards>
			{@const [file, folder] = getFile(decodeURIComponent(wildcards))}
			<File {file} {folder} />
		</Route>
		<Route path="svelte-fs/.*" let:wildcards>
			{@const folder = getFolder(decodeURIComponent(wildcards))}
			<Folder {folder} />
		</Route>

		<Route path="edit/.*" let:wildcards>
			{@const [file, folder] = getFile(decodeURIComponent(wildcards))}
			<File {file} {folder} />
		</Route>
		<Route path=".*" let:wildcards>
			{@const folder = getFolder(decodeURIComponent(wildcards))}
			<Folder {folder} />
		</Route>
		<Route index component={Home} />
	</Router>
</div>
