<script>
	// @ts-nocheck

	import { getContext } from 'svelte';
	import Config from '../Config.js';

	import FolderIcon from '../assets/folder.png';
	import FileIcon from '../assets/file.png';
	import TrashIcon from '../assets/trash.png';

	import { uuid } from './uuid';
	import { get } from 'svelte/store';
	import { navigate } from 'svroutes';
	import { filterFileName, filterFolderName } from './filter';

	/**
	 * {
	 * uuid: '2gnAdYQ-rMQwyVe-2GEMHQ2',
	 * name: 'My Folder',
	 * files: [ 'icNAz4h-eAorwE5-vJYIwQl', 'aNWatGP-gVX2CoT-SAOSqZP' ],
	 * folders: [ 'qNCbOJz-dNntBJe-cMjlyxg' ],
	 * }
	 * @type {any}
	 */
	export let folder;
	const { files, folders } = getContext(Config.glblKey);

	function getFile(id) {
		return $files.find((o) => o.uuid === id);
	}
	function getFolder(id) {
		return $folders.find((o) => o.uuid === id);
	}

	function createFolder() {
		let name = prompt('Folder name?');
		name = name.trim();
		let filter = filterFolderName(name, folder, get(folders), get(files));
		if (filter !== null) return alert(filter);

		const new_folder = {
			uuid: uuid(),
			name: name,
			parent: folder.uuid,
			files: [],
			folders: [],
		};

		folders.update((rt) => rt.unshift(new_folder) && rt);
		folders.update((rt) =>
			rt.map((fld) => {
				if (fld.uuid === folder.uuid) fld.folders.unshift(new_folder.uuid);
				return fld;
			})
		);
	}
	function createFile() {
		let name = prompt('File name?');
		name = name.trim();
		let filter = filterFileName(name, folder, get(folders), get(files));
		if (filter !== null) return alert(filter);

		const new_file = {
			uuid: uuid(),
			name: name,
			parent: folder.uuid,
			content: '',
		};

		files.update((rt) => rt.unshift(new_file) && rt);
		folders.update((rt) =>
			rt.map((fld) => {
				if (fld.uuid === folder.uuid) fld.files.unshift(new_file.uuid);
				return fld;
			})
		);
	}

	function path() {
		let p = [];

		let cur = folder;
		if (!cur) return [[]];
		p.push([cur.name]);
		let og = cur.uuid;

		while (cur.parent && cur.parent !== 'root') {
			cur = $folders.find((f) => f.uuid === cur.parent);
			p.push([cur.name]);
		}

		if (og !== 'root') {
			cur = $folders.find((f) => f.uuid === cur.parent);
			cur && p.push([cur.name]);
		}

		p = p.reverse();

		let nav = '';
		for (let part of p) {
			nav += '/' + part[0];
			part[1] = nav.substring(1);
		}

		return p;
	}

	function link(elm, href) {
		if (!elm.href) elm.href = href;
		function fn(ev) {
			if (ev.target.parentElement !== elm && ev.target !== elm) return;
			ev.preventDefault();
			navigate(elm.href);
		}
		elm.addEventListener('click', fn);

		return {
			destroy() {
				elm.removeEventListener('click', fn);
			},
		};
	}

	function deleteFolder(fldr = folder, nav = true) {
		const con = !nav || confirm('Deleting a folder cannot be undone. Are you sure you would like to delete ' + fldr.name + '?');
		if (!con) return;
		let _id = fldr.uuid;

		fldr.folders.forEach((id) => {
			deleteFolder(
				get(folders).find((c) => c.uuid === id),
				false
			);
		});

		files.update((f) => {
			return f.filter((c) => {
				return !fldr.files.some((a) => a === c.uuid);
			});
		});
		folders.update((f) =>
			f.map((c) => {
				if (c.uuid === fldr.parent) c.folders = c.folders.filter((d) => d !== fldr.uuid);
				return c;
			})
		);
		folders.update((f) => f.filter((c) => c.uuid !== _id));
		if (nav) navigate('../');
	}

	function renameFolder(/** @type {MouseEvent} */ e, folder) {
		e.preventDefault();
		const newName = prompt('What would you like to rename ' + folder.name + ' to?', folder.name);
		if (newName == null) return;
		const parent = $folders.find((c) => c.uuid === folder.parent);

		const filter = filterFolderName(newName, parent, $folders, files, true);
		if (filter) return alert(filter);

		folders.update((f) => f.map((c) => (c.uuid === folder.uuid ? ((c.name = newName), c) : c)));
	}
</script>

{#if folder}
	<div id="folder">
		<div id="path" title={folder.name}>
			{#each path() as part}
				&nbsp;
				<a style="color: var(--color); text-decoration: none;" title={part[1]} use:link href={'../'.repeat(path().length - 1) + part[1]}>&gt; {part[0]}</a>
			{/each}
		</div>
		<div id="files">
			<h4>
				<span class="img_container">
					<img alt="folders" class="folder_img" src={FolderIcon} />
				</span>
				Folders
			</h4>

			<div class="item_wrapper">
				{#each $folders.find((f) => f.uuid === folder.uuid).folders as folderId}
					{@const fldr = getFolder(folderId)}
					<a style="color: var(--color)" href={'./' + '../'.repeat(path().length - 1) + path().at(-1)[1] + '/' + fldr.name} use:link>
						<div style={`--img:url(${FolderIcon})`} class="item folder" title={fldr.name}>
							<span>{fldr.name}</span>
							<button class="refactor-btn" on:click={(e) => renameFolder(e, fldr)} title="rename">R</button>
						</div>
					</a>
				{/each}
			</div>

			<h4>
				<span class="img_container">
					<img alt="files" class="file_img" src={FileIcon} />
				</span>
				Files
			</h4>

			<div class="item_wrapper">
				{#each $folders.find((f) => f.uuid === folder.uuid).files as fileId}
					{@const file = getFile(fileId)}
					<a style="color: var(--color)" use:link href={'./' + '../'.repeat(path().length - 1) + 'edit/' + path().at(-1)[1] + '/' + file?.name}>
						<div style={`--img:url(${FileIcon})`} class="item file" title={file?.name}>
							<span>{file?.name}</span>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</div>

	<div id="controls">
		<button disabled={folder.uuid === 'root'} on:click={() => deleteFolder()}> <img class="new_file_img" src={TrashIcon} title="delete folder" alt="delete folder" /> </button>
		<button on:click={createFolder}> <img class="new_folder_img" src={FolderIcon} title="new folder" alt="new folder" /> </button>
		<button on:click={createFile}> <img class="new_file_img" src={FileIcon} title="new file" alt="new file" /> </button>
	</div>

	<style>
		#controls {
			display: flex;
			align-items: center;
			justify-content: right;
			gap: 1rem;
		}
		.new_file_img {
			height: 1.5rem;
			margin: 0.4rem;
			display: flex;
			align-items: center;
		}
		.new_folder_img {
			height: 1.5rem;
			margin: 0.4rem;
			display: flex;
			align-items: center;
		}
		#controls {
			position: absolute;
			top: 0;
			right: 0;
			width: 20rem;
			height: 3.5rem;
			display: flex;
			padding: 1rem;
		}
		.img_container {
			display: inline-block;
			width: 2rem;
			height: 1px;
			text-align: center;
		}
		img {
			margin-top: 0.5rem;
			margin-right: 0.5rem;
		}
		.folder_img {
			height: 1rem;
		}
		.file_img {
			height: 1.5rem;
			position: relative;
			top: 0.33rem;
		}
		#path {
			margin-bottom: 0.75rem;
		}
		#files {
			display: grid;
			gap: 1rem;
		}
		.item_wrapper {
			display: flex;
			gap: 1rem;
			flex-wrap: wrap;
		}
		.item {
			cursor: pointer;
			width: 12rem;
			height: 7rem;
			padding: 1rem;
			border-radius: 10px;
			background: var(--bg-secondary);
			transition: translate 250ms;
			position: relative;
			font-size: medium;
		}
		.item.file > span {
			width: calc(100% - 2rem);
			display: inline-block;
			word-wrap: break-word;
			overflow: hidden;
		}
		.item.file::after {
			content: '';
			width: 2rem;
			height: 3rem;
			position: absolute;
			right: 0.25rem;
			top: 0.25rem;
			background-image: var(--img);
			background-size: contain;
			background-repeat: no-repeat;
			border-top-right-radius: 10px;
			z-index: 5;
		}
		.item.folder > span {
			width: calc(100% - 3rem);
			display: inline-block;
			word-wrap: break-word;
			overflow: hidden;
		}
		.item.folder::after {
			content: '';
			width: 3rem;
			height: 2rem;
			position: absolute;
			right: 0.5rem;
			top: 0.5rem;
			background-image: var(--img);
			background-size: contain;
			background-repeat: no-repeat;
			border-top-right-radius: 10px;
		}
		.item:hover {
			translate: 2% -2%;
		}
		.item.folder:hover > .refactor-btn {
			opacity: 100;
		}
		.item > * {
			pointer-events: none;
		}
		.refactor-btn {
			pointer-events: auto;
			position: absolute;
			bottom: 0.2rem;
			right: 0.2rem;
			width: 2rem;
			height: 1rem;
			opacity: 0;
			transition: opacity 250ms;
		}
	</style>
{:else}
	404 - Could not find folder
{/if}
