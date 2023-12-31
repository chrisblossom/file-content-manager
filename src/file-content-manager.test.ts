import { TempSandbox } from 'temp-sandbox';
import { fileContentManager } from './file-content-manager';

const sandbox = new TempSandbox({ randomDir: true });

const cwd = process.cwd();

beforeEach(() => {
	process.chdir(sandbox.dir);
	sandbox.cleanSync();
});

afterEach(() => {
	process.chdir(cwd);
});

afterAll(() => {
	sandbox.destroySandboxSync();
	process.chdir(cwd);
});

describe('fileContentManager', () => {
	test('file does not exist', async () => {
		const body = [{ id: 'body1', contents: '# body1' }];

		const header = '# header';
		const footer = '# footer';

		const removeInitialContent = false;
		const allowUnmanagedContent = true;

		const options = {
			file: '.gitignore',
			marker: '@managed',
			fileType: 'ignore',
			header,
			body,
			footer,
			allowUnmanagedContent,
			removeInitialContent,
		};

		const updatedFile = await fileContentManager(options);

		expect(updatedFile).toEqual(
			`
# @managed start header
# header
# @managed end header

# @managed start body1
# body1
# @managed end body1

# @managed start footer
# footer
# @managed end footer
`.substring(1),
		);
	});

	test('previously managed', async () => {
		sandbox.createFileSync(
			'.gitignore',
			`
# @managed start header
# old
# header
# @managed end header
# comment
.eslintrc.js
# @managed start body1
# old
# body1
# @managed end body1
# @managed start remove-this
# old
# remove-this
# @managed end remove-this
.prettierrc.js
# @managed start footer
# old
# footer
# @managed end footer
`.substring(1),
		);

		const body = [
			{ id: 'body1', contents: '# body1' },
			{ id: 'body2', contents: '# body2' },
			{ id: 'body3', contents: '# body3' },
		];
		const header = '# header';
		const footer = '# footer';

		const removeInitialContent = false;
		const allowUnmanagedContent = true;

		const options = {
			file: '.gitignore',
			marker: '@managed',
			fileType: 'ignore',
			header,
			body,
			footer,
			allowUnmanagedContent,
			removeInitialContent,
		};

		const updatedFile = await fileContentManager(options);

		expect(updatedFile).toEqual(
			`
# @managed start header
# header
# @managed end header

# comment
.eslintrc.js

# @managed start body1
# body1
# @managed end body1

.prettierrc.js

# @managed start body2
# body2
# @managed end body2

# @managed start body3
# body3
# @managed end body3

# @managed start footer
# footer
# @managed end footer
`.substring(1),
		);
	});

	test('previously unmanaged', async () => {
		sandbox.createFileSync(
			'.gitignore',
			`
# comment
.eslintrc.js
.prettierrc.js
`.substring(1),
		);

		const body = [
			{ id: 'body1', contents: '# body1' },
			{ id: 'body2', contents: '# body2' },
		];

		const header = '# header';
		const footer = '# footer';

		const removeInitialContent = false;
		const allowUnmanagedContent = true;

		const updatedFile = await fileContentManager({
			file: '.gitignore',
			marker: '@managed',
			fileType: 'ignore',
			body,
			header,
			footer,
			allowUnmanagedContent,
			removeInitialContent,
		});

		expect(updatedFile).toEqual(
			`
# @managed start header
# header
# @managed end header

# @managed start body1
# body1
# @managed end body1

# @managed start body2
# body2
# @managed end body2

# comment
.eslintrc.js
.prettierrc.js

# @managed start footer
# footer
# @managed end footer
`.substring(1),
		);
	});

	test('allowUnmanagedContent - false', async () => {
		sandbox.createFileSync('.gitignore');

		const body = [
			{ id: 'body1', contents: '# body1' },
			{ id: 'body2', contents: '# body2' },
		];

		const header = '# header';
		const footer = '# footer';

		const removeInitialContent = false;
		const allowUnmanagedContent = false;

		const updatedFile = await fileContentManager({
			file: '.gitignore',
			marker: '@managed',
			fileType: 'ignore',
			body,
			header,
			footer,
			allowUnmanagedContent,
			removeInitialContent,
		});

		expect(updatedFile).toEqual(
			`
# header

# body1

# body2

# footer
`.substring(1),
		);
	});
});
