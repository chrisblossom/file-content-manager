import path from 'path';

const map = {
	'.js': 'javascript',
};

function detectFileType(file: string) {
	const parsed = path.parse(file);

	console.log(parsed);
}

export { detectFileType };
