import { normalizeSections } from './normalize-sections';

describe('normalizeSections', () => {
	test('body with header/footer', () => {
		const header = '# header';
		const footer = '# footer';

		const body = [
			{ id: 'body1', contents: '# body1' },
			{ id: 'body2', contents: '# body2' },
		];

		const normalized = normalizeSections({ header, body, footer });

		expect(normalized).toEqual({
			ids: [
				'',
				'header',
				'body1',
				'body2',
				'footer',
			],
			contents: {
				header: '# header',
				body1: '# body1',
				body2: '# body2',
				footer: '# footer',
			},
			header: true,
			footer: true,
		});
	});

	test('body without header/footer', () => {
		const body = [
			{ id: 'body1', contents: '# body1' },
			{ id: 'body2', contents: '# body2' },
		];

		const normalized = normalizeSections({ body });

		expect(normalized).toEqual({
			ids: [
				'',
				'body1',
				'body2',
			],
			contents: { body1: '# body1', body2: '# body2' },
			header: false,
			footer: false,
		});
	});

	test('no body with header/footer', () => {
		const header = '# header';
		const footer = '# footer';

		const normalized = normalizeSections({ header, footer });
		expect(normalized).toEqual({
			ids: [
				'',
				'header',
				'footer',
			],
			contents: { header: '# header', footer: '# footer' },
			header: true,
			footer: true,
		});
	});

	test('header/footer empty string', () => {
		const header = '';
		const footer = '';

		const normalized = normalizeSections({ header, footer });

		expect(normalized).toEqual({
			ids: [
				'',
				'header',
				'footer',
			],
			contents: { header: '', footer: '' },
			header: true,
			footer: true,
		});
	});

	test('empty contents', () => {
		const normalized = normalizeSections({});

		expect(normalized).toEqual({
			ids: [''],
			contents: {},
			header: false,
			footer: false,
		});
	});

	test('body cannot have id header', () => {
		const body = [{ id: 'header', contents: '# fake header' }];

		expect(() =>
			normalizeSections({ body }),
		).toThrowErrorMatchingInlineSnapshot(
			`"\\"header\\" cannot be used as an id. Use option \\"header\\" instead or change identifier"`,
		);
	});

	test('body cannot have id footer', () => {
		const body = [{ id: 'footer', contents: '# fake footer' }];

		expect(() =>
			normalizeSections({ body }),
		).toThrowErrorMatchingInlineSnapshot(
			`"\\"footer\\" cannot be used as an id. Use option \\"footer\\" instead or change identifier"`,
		);
	});

	test('body cannot have id [empty string] ("")', () => {
		const body = [{ id: '', contents: '# empty string' }];

		expect(() =>
			normalizeSections({ body }),
		).toThrowErrorMatchingInlineSnapshot(
			`"section id cannot an empty string. Use header option or change identifier"`,
		);
	});
});
