import { TempSandbox } from 'temp-sandbox';

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

test.skip('reads ignore', () => {
	sandbox.createFileSync('.gitignore', '# comment\n.eslintrc.js');

	console.log(sandbox.readFileSync('.gitignore'));
});
