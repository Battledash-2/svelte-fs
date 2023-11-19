export function crypto() {
	return window.crypto.randomUUID();
}

let alph = 'abcdefghijklmnopqrstuvwxyz';
alph = alph + alph.toUpperCase();

let num = '1234567890';
let special = '~!@#$%^&*()-_=+[]{}|;\':.>,</?" ';

let alphanum = alph + num;
let all = alphanum + special;

// @ts-ignore
function randomIn(item) {
	return item[Math.floor(Math.random() * (item.length - 1))];
}

export function uuid(pattern = 'AAAAAAA-AAAAAAA-AAAAAAA', repeat = 1) {
	let id = '';

	for (let i = 0; i < repeat; i++) {
		for (let c of pattern.toLowerCase()) {
			if (c === 'c') id += randomIn(alph);
			else if (c === 'n') id += randomIn(num);
			else if (c === 's') id += randomIn(special);
			else if (c === 'a') id += randomIn(alphanum);
			else if (c === 'r') id += randomIn(all);
			else id += c;
		}
	}

	return id;
}
