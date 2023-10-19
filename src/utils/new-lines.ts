// https://stackoverflow.com/a/52947649
const newLineRegex = new RegExp(/\r\n|\r|\n/g);

function normalizeNewLines(contents: string): string {
	return contents.replace(newLineRegex, '\n');
}

function splitNewLines(contents: string): string[] {
	return contents.split(newLineRegex);
}

export { normalizeNewLines, splitNewLines };
