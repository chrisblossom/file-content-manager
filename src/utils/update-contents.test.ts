import { updateContents } from './update-contents';
import { mapUnmanagedContents } from './map-unmanaged-contents';
import { normalizeSections } from './normalize-sections';

describe('updateContents', () => {
	test('with previous content', () => {
		const contents = [
			'# @managed start header',
			'# old',
			'# header',
			'# @managed end header',
			'# comment',
			'.eslintrc.js',
			'# @managed start body1',
			'# old',
			'# body1',
			'# @managed end body1',
			'# @managed start remove-this',
			'# old',
			'# remove-this',
			'# @managed end remove-this',
			'.prettierrc.js',
			'# @managed start footer',
			'# old',
			'# footer',
			'# @managed end footer',
		];

		const sections = normalizeSections({
			header: '# header',
			body: [
				{ id: 'body1', contents: '# body1' },
				{ id: 'body2', contents: '# body2' },
				{ id: 'body3', contents: '# body3' },
			],
			footer: '# footer',
		});

		const marker = '@managed';
		const identifier = '#';
		const removeInitialContent = false;
		const allowUnmanagedContent = true;

		const unmanagedContentMap = mapUnmanagedContents({
			sections,
			contents,
			identifier,
			marker,
			removeInitialContent,
			allowUnmanagedContent,
		});

		const updated = updateContents({
			unmanaged: unmanagedContentMap,
			sections,
			marker,
			identifier,
			allowUnmanagedContent,
		});

		expect(updated).toEqual([
			'# @managed start header',
			'# header',
			'# @managed end header',
			'# comment',
			'.eslintrc.js',
			'# @managed start body1',
			'# body1',
			'# @managed end body1',
			'.prettierrc.js',
			'# @managed start body2',
			'# body2',
			'# @managed end body2',
			'# @managed start body3',
			'# body3',
			'# @managed end body3',
			'# @managed start footer',
			'# footer',
			'# @managed end footer',
		]);
	});

	test('without previous content', () => {
		const contents: string[] = [];

		const sections = normalizeSections({
			header: '# header',
			body: [
				{ id: 'body1', contents: '# body1' },
				{ id: 'body2', contents: '# body2' },
				{ id: 'body3', contents: '# body3' },
			],
			footer: '# footer',
		});

		const marker = '@managed';
		const identifier = '#';
		const removeInitialContent = false;
		const allowUnmanagedContent = true;

		const unmanagedContentMap = mapUnmanagedContents({
			sections,
			contents,
			identifier,
			marker,
			removeInitialContent,
			allowUnmanagedContent,
		});

		const updated = updateContents({
			unmanaged: unmanagedContentMap,
			sections,
			marker,
			identifier,
			allowUnmanagedContent,
		});

		expect(updated).toEqual([
			'# @managed start header',
			'# header',
			'# @managed end header',
			'# @managed start body1',
			'# body1',
			'# @managed end body1',
			'# @managed start body2',
			'# body2',
			'# @managed end body2',
			'# @managed start body3',
			'# body3',
			'# @managed end body3',
			'# @managed start footer',
			'# footer',
			'# @managed end footer',
		]);
	});

	test('no header or footer', () => {
		const contents: string[] = [];

		const sections = normalizeSections({
			body: [
				{ id: 'body1', contents: '# body1' },
				{ id: 'body2', contents: '# body2' },
				{ id: 'body3', contents: '# body3' },
			],
		});

		const marker = '@managed';
		const identifier = '#';
		const removeInitialContent = false;
		const allowUnmanagedContent = true;

		const unmanagedContentMap = mapUnmanagedContents({
			sections,
			contents,
			identifier,
			marker,
			removeInitialContent,
			allowUnmanagedContent,
		});

		const updated = updateContents({
			unmanaged: unmanagedContentMap,
			sections,
			marker,
			identifier,
			allowUnmanagedContent,
		});

		expect(updated).toEqual([
			'# @managed start body1',
			'# body1',
			'# @managed end body1',
			'# @managed start body2',
			'# body2',
			'# @managed end body2',
			'# @managed start body3',
			'# body3',
			'# @managed end body3',
		]);
	});

	test('no body', () => {
		const contents: string[] = [];

		const sections = normalizeSections({
			header: '# header',
			footer: '# footer',
		});

		const marker = '@managed';
		const identifier = '#';
		const removeInitialContent = false;
		const allowUnmanagedContent = true;

		const unmanagedContentMap = mapUnmanagedContents({
			sections,
			contents,
			identifier,
			marker,
			removeInitialContent,
			allowUnmanagedContent,
		});

		const updated = updateContents({
			unmanaged: unmanagedContentMap,
			sections,
			marker,
			identifier,
			allowUnmanagedContent,
		});

		expect(updated).toEqual([
			'# @managed start header',
			'# header',
			'# @managed end header',
			'# @managed start footer',
			'# footer',
			'# @managed end footer',
		]);
	});

	test('handles empty contents', () => {
		const contents: string[] = [];

		const sections = normalizeSections({
			header: '',
			body: [{ id: 'body1', contents: '' }],
			footer: '',
		});

		const marker = '@managed';
		const identifier = '#';
		const removeInitialContent = false;
		const allowUnmanagedContent = true;

		const unmanagedContentMap = mapUnmanagedContents({
			sections,
			contents,
			identifier,
			marker,
			removeInitialContent,
			allowUnmanagedContent,
		});

		const updated = updateContents({
			unmanaged: unmanagedContentMap,
			sections,
			marker,
			identifier,
			allowUnmanagedContent,
		});

		expect(updated).toEqual([
			'# @managed start header',
			'# @managed end header',
			'# @managed start body1',
			'# @managed end body1',
			'# @managed start footer',
			'# @managed end footer',
		]);
	});

	test('unmanaged above managed content', () => {
		const contents: string[] = [
			'1',
			'2',
			'# @managed start body1',
			'# body1',
			'# @managed end body1',
		];

		const sections = normalizeSections({
			body: [{ id: 'body1', contents: '# body1' }],
		});

		const marker = '@managed';
		const identifier = '#';
		const removeInitialContent = false;
		const allowUnmanagedContent = true;

		const unmanagedContentMap = mapUnmanagedContents({
			sections,
			contents,
			identifier,
			marker,
			removeInitialContent,
			allowUnmanagedContent,
		});

		const updated = updateContents({
			unmanaged: unmanagedContentMap,
			sections,
			marker,
			identifier,
			allowUnmanagedContent,
		});

		expect(updated).toEqual([
			'1',
			'2',
			'# @managed start body1',
			'# body1',
			'# @managed end body1',
		]);
	});

	test('unmanaged above header', () => {
		// this typically cannot happen, but verify it can in-order to override if needed
		const sections = normalizeSections({
			header: '# header',
		});

		const marker = '@managed';
		const identifier = '#';
		const allowUnmanagedContent = true;

		const unmanagedContentMap = {
			'': [
				'1',
				'2',
			],
		};
		const updated = updateContents({
			unmanaged: unmanagedContentMap,
			sections,
			marker,
			identifier,
			allowUnmanagedContent,
		});

		expect(updated).toEqual([
			'1',
			'2',
			'# @managed start header',
			'# header',
			'# @managed end header',
		]);
	});

	test('unmanaged below footer', () => {
		// this typically cannot happen, but verify it can in-order to override if needed
		const sections = normalizeSections({
			footer: '# footer',
		});

		const marker = '@managed';
		const identifier = '#';
		const allowUnmanagedContent = true;

		const unmanagedContentMap = {
			footer: [
				'1',
				'2',
			],
		};
		const updated = updateContents({
			unmanaged: unmanagedContentMap,
			sections,
			marker,
			identifier,
			allowUnmanagedContent,
		});

		expect(updated).toEqual([
			'# @managed start footer',
			'# footer',
			'# @managed end footer',
			'1',
			'2',
		]);
	});

	test('only unmanaged', () => {
		const contents: string[] = [
			'1',
			'2',
		];

		const sections = normalizeSections({});

		const marker = '@managed';
		const identifier = '#';
		const removeInitialContent = false;
		const allowUnmanagedContent = true;

		const unmanagedContentMap = mapUnmanagedContents({
			sections,
			contents,
			identifier,
			marker,
			removeInitialContent,
			allowUnmanagedContent,
		});

		const updated = updateContents({
			unmanaged: unmanagedContentMap,
			sections,
			marker,
			identifier,
			allowUnmanagedContent,
		});

		expect(updated).toEqual([
			'1',
			'2',
		]);
	});

	test('empty', () => {
		const contents: string[] = [];

		const sections = normalizeSections({});

		const marker = '@managed';
		const identifier = '#';
		const removeInitialContent = false;
		const allowUnmanagedContent = true;

		const unmanagedContentMap = mapUnmanagedContents({
			sections,
			contents,
			identifier,
			marker,
			removeInitialContent,
			allowUnmanagedContent,
		});

		const updated = updateContents({
			unmanaged: unmanagedContentMap,
			sections,
			marker,
			identifier,
			allowUnmanagedContent,
		});

		expect(updated).toEqual([]);
	});

	test('previously unmanaged - add body', () => {
		const contents: string[] = [
			'1',
			'2',
		];

		const sections = normalizeSections({
			body: [{ id: 'body1', contents: '# body1' }],
		});

		const marker = '@managed';
		const identifier = '#';
		const removeInitialContent = false;
		const allowUnmanagedContent = true;

		const unmanagedContentMap = mapUnmanagedContents({
			sections,
			contents,
			identifier,
			marker,
			removeInitialContent,
			allowUnmanagedContent,
		});

		const updated = updateContents({
			unmanaged: unmanagedContentMap,
			sections,
			marker,
			identifier,
			allowUnmanagedContent,
		});

		expect(updated).toEqual([
			'# @managed start body1',
			'# body1',
			'# @managed end body1',
			'1',
			'2',
		]);
	});

	test('previously unmanaged - add header body footer', () => {
		const contents: string[] = [
			'1',
			'2',
		];

		const sections = normalizeSections({
			header: '',
			body: [{ id: 'body1', contents: '' }],
			footer: '',
		});

		const marker = '@managed';
		const identifier = '#';
		const removeInitialContent = false;
		const allowUnmanagedContent = true;

		const unmanagedContentMap = mapUnmanagedContents({
			sections,
			contents,
			identifier,
			marker,
			removeInitialContent,
			allowUnmanagedContent,
		});

		const updated = updateContents({
			unmanaged: unmanagedContentMap,
			sections,
			marker,
			identifier,
			allowUnmanagedContent,
		});

		expect(updated).toEqual([
			'# @managed start header',
			'# @managed end header',
			'# @managed start body1',
			'# @managed end body1',
			'1',
			'2',
			'# @managed start footer',
			'# @managed end footer',
		]);
	});

	test('allowUnmanagedContent: false - do not add markers', () => {
		const contents: string[] = [
			'1',
			'2',
		];

		const sections = normalizeSections({
			header: '# header',
			body: [{ id: 'body1', contents: '# body1' }],
			footer: '# footer',
		});

		const marker = '@managed';
		const identifier = '#';
		const removeInitialContent = false;
		const allowUnmanagedContent = false;

		const unmanagedContentMap = mapUnmanagedContents({
			sections,
			contents,
			identifier,
			marker,
			removeInitialContent,
			allowUnmanagedContent,
		});

		const updated = updateContents({
			unmanaged: unmanagedContentMap,
			sections,
			marker,
			identifier,
			allowUnmanagedContent,
		});

		expect(updated).toEqual([
			'# header',
			'',
			'# body1',
			'',
			'# footer',
		]);
	});
});
