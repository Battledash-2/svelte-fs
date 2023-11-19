<script>
	// @ts-nocheck
	import { getContext } from 'svelte';
	import Config from '../Config.js';
	import { navigate } from 'svroutes';
	import { filterFileName } from './filter';
	import { get } from 'svelte/store';

	export let file;
	export let folder;
	const { files, folders } = getContext(Config.glblKey);

	let name = file && file.name;
	let content = file && file.content;

	function save() {
		const con = confirm('Are you sure you would like to save? (changes cannot be undone)');
		if (!con) return;

		const filter = filterFileName(name, folder, _, get(files), name !== file.name);
		if (filter) return alert(filter);

		file.name = name;
		file.content = content;

		files.update((f) => f.map((x) => (x.uuid === file.uuid ? file : x)));

		let newPath = location.pathname.split('/');
		newPath[newPath.length - 1] = name;
		navigate(location.origin + newPath.join('/'));
		// history.replaceState(null, null, location.origin + newPath.join('/'));
	}

	function del() {
		const con = confirm('Deleting a file cannot be undone. Are you sure you would like to delete ' + name + '?');
		if (!con) return;

		folders.update((f) =>
			f.map((c) => {
				if (c.uuid === folder.uuid) c.files = c.files.filter((d) => d !== file.uuid);
				return c;
			})
		);

		files.update((f) => f.filter((c) => c.uuid !== file.uuid));
		navigate('/');
	}

	function done() {
		let path =
			location.origin +
			'/' +
			location.pathname
				.split('/')
				.slice(0, -1)
				.filter((c) => c !== 'edit')
				.join('/')
				.slice(1);
		navigate(path);
	}
</script>

{#if file}
	<div id="file">
		<div id="controls">
			<input bind:value={name} placeholder="Filename" />
			<!-- <h3>{file.name}</h3> -->
			<div id="button_wrapper">
				<button on:click={done} title="done">DONE</button>
				<button on:click={save} title="save">SAVE</button>
				<button on:click={del} title="delete">DELETE</button>
			</div>
		</div>

		<textarea bind:value={content} />
	</div>

	<style>
		input {
			width: 35%;
			font-size: large;
			background-color: rgb(33, 38, 49);
			border: none;
			outline: none;
			color: var(--color);
			padding: 0.5rem;
		}
		button:first-child {
			background: #628da7;
		}
		button:nth-child(2) {
			background: rgb(108, 170, 108);
		}
		button {
			width: 5rem;
			height: 2rem;
			color: rgb(42, 40, 40) 323;
			border-radius: 5px;
			color: var(--color);
		}
		#button_wrapper {
			display: flex;
			width: 100%;
			justify-content: right;
			align-items: center;
			gap: 1rem;
		}
		#controls {
			display: flex;
			gap: 1rem;
			align-items: center;
		}
		#file {
			display: grid;
			gap: 1rem;
			align-items: center;
			justify-content: center;
		}
		textarea {
			width: 95svw;
			height: calc(85svh - 1rem);
			color: white;
			background: var(--bg-secondary);
			border: none;
			outline: none;
			padding: 1rem;
			resize: none;
			font-size: large;
		}
	</style>
{:else}
	404 - Could not find file
{/if}
