// https://stackoverflow.com/a/52947649
const newLineRegex = new RegExp(/\r\n|\r|\n/g);

function normalizeNewLines(contents: string) {
	return contents.replace(newLineRegex, '\n');
}

function splitNewLines(contents: string) {
	const split = contents.split(newLineRegex);

	return split;
}

export { normalizeNewLines, splitNewLines };
