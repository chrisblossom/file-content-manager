import path from 'path';
import { detectFileType } from './detect-file-type';

describe.skip('detectFileType', () => {
	test.each`
		file         | expected
		${'file.js'} | ${'javascript'}
	`('returns `$expected` file: `$file`', ({ file, expected }) => {
		const fileType = detectFileType(file);
		expect(fileType).toEqual(expected);
	});
});
