# Svelte FS

Local storage file explorer/editor in Svelte.

# How it works

Folders and files alike have UUIDs.
Folders contain a list of files or folders as a reference to their UUID.

There is a "root" folder which is displayed on the home screen.
Said "root" folder does not have an ID.

Eg.:
Folder:

```js
{
	uuid: '2gnAdYQ-rMQwyVe-2GEMHQ2',
	parent: null,
	name: 'My Folder',
	files: [ 'icNAz4h-eAorwE5-vJYIwQl', 'aNWatGP-gVX2CoT-SAOSqZP' ],
	folders: [ 'qNCbOJz-dNntBJe-cMjlyxg' ],
}
```

Files:

```js
{
	uuid: 'icNAz4h-eAorwE5-vJYIwQl',
	parent: '2gnAdYQ-rMQwyVe-2GEMHQ2',
	name: 'My File.txt',
	content: 'Hello, world!',
}
```
