// @ts-nocheck
import { getContext } from 'svelte';
import Config from '../Config.js';

export function filterFileName(name, folder, _folders, files, aae = true) {
	if (!name || name === '') return "Invalid file name '" + name + "'";
	if (name.toLowerCase() === 'edit' || name.toLowerCase() === 'svelte-fs') return "Cannot name a file '" + name + "'";
	if (name.includes('/')) return 'File name contains illegal characters.';
	if (aae && folder.files.some((c) => files.find((i) => i.uuid === c).name === name)) return "File with name '" + name + "' already exists";
	return null;
}

export function filterFolderName(name, folder, folders, _files, aae = true) {
	if (!name || name === '') return alert("Invalid folder name '" + name + "'");
	if (name.toLowerCase() === 'root' || name.toLowerCase() === 'edit' || name.toLowerCase() === 'svelte-fs') return alert("Cannot name a folder '" + name + "'");
	if (name.includes('/')) return alert('Folder name contains illegal characters.');
	if (aae && folder.folders.some((c) => folders.find((i) => i.uuid === c).name === name)) return "Folder with name '" + name + "' already exists";
	return null;
}
