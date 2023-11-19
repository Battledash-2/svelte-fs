const glblKey = 'svelte-fs.';

export default {
	glblKey,
	filesKey: glblKey + '.FILES', // "svelte-fs..FILES"
	foldersKey: glblKey + '.FOLDERS', // "svelte-fs..FOLDERS"
	recentKey: glblKey + 'recent', // "svelte-fs.recent"
};
