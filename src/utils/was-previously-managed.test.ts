import { wasPreviouslyManaged } from './was-previously-managed';

describe('wasPreviouslyManaged', () => {
	test('true', () => {
		const contents = [
			'# @managed start header',
			'# old',
			'# header',
			'# @managed end header',
			'# comment',
			'.eslintrc.js',
			'# @managed start body',
			'# old',
			'# body',
			'# @managed end body',
			'.prettierrc.js',
			'',
		];

		const identifier = '#';
		const marker = '@managed';
		const previouslyManaged = wasPreviouslyManaged({
			contents,
			identifier,
			marker,
		});

		expect(previouslyManaged).toEqual(true);
	});

	test('false', () => {
		const contents = ['.eslintrc.js', '.prettierrc.js', ''];

		const identifier = '#';
		const marker = '@managed';
		const previouslyManaged = wasPreviouslyManaged({
			contents,
			identifier,
			marker,
		});

		expect(previouslyManaged).toEqual(false);
	});
});
