import { mapUnmanagedContents } from './map-unmanaged-contents';
import { normalizeSections } from './normalize-sections';

describe.skip('mapUnmanagedContents', () => {
    test('maps unmanaged content to managed', () => {
        const contents = [
            '# @managed start header',
            '# header',
            '# @managed end header',
            '1',
            '2',
            '# @managed start body',
            '# body',
            '# @managed end body',
            '3',
        ];

        const identifier = '#';
        const marker = '@managed';
        const removeInitialContent = false;
        const allowUnmanagedContent = true;

        const sections = normalizeSections({
            header: '# header',
            body: [{ id: 'body', contents: '# body' }],
        });

        const sorted = mapUnmanagedContents({
            sections,
            contents,
            identifier,
            marker,
            removeInitialContent,
            allowUnmanagedContent,
        });

        expect(sorted).toEqual({
            header: ['1', '2'],
            body: ['3'],
        });
    });

    test('handles sections being removed with spaces and header removed', () => {
        const contents = [
            '# @managed start header',
            '# @managed end header',
            '1',
            '2',
            '',
            '# @managed start body1',
            '# @managed end body1',
            '3',
            '4',
            '5',
            '',
            '# @managed start body2',
            '# @managed end body2',
            '',
            '6',
            '7',
            '# @managed start body3',
            '# @managed end body3',
            '',
            '8',
            '9',
        ];

        const sections = normalizeSections({});

        const identifier = '#';
        const marker = '@managed';
        const removeInitialContent = false;
        const allowUnmanagedContent = true;

        const sorted = mapUnmanagedContents({
            contents,
            sections,
            identifier,
            marker,
            removeInitialContent,
            allowUnmanagedContent,
        });

        expect(sorted).toEqual({
            '': ['1', '2', '', '3', '4', '5', '', '6', '7', '', '8', '9'],
        });
    });

    test('handles sections being removed', () => {
        const contents = [
            '# @managed start header',
            '# header',
            '# @managed end header',
            '1',
            '2',
            '# @managed start body1',
            '# body1',
            '# @managed end body1',
            '3',
            '4',
            '5',
            '# @managed start body2',
            '# body2',
            '# @managed end body2',
            '6',
            '7',
            '# @managed start body3',
            '# body3',
            '# @managed end body3',
            '8',
            '9',
        ];

        const sections = normalizeSections({
            header: '# header',
            body: [
                { id: 'body1', contents: '# body1' },
                // { id: 'body2', contents: '# body2' },
                { id: 'body3', contents: '# body3' },
            ],
        });

        const identifier = '#';
        const marker = '@managed';
        const removeInitialContent = false;
        const allowUnmanagedContent = true;

        const sorted = mapUnmanagedContents({
            contents,
            sections,
            identifier,
            marker,
            removeInitialContent,
            allowUnmanagedContent,
        });

        expect(sorted).toEqual({
            header: ['1', '2'],
            body1: ['3', '4', '5', '', '6', '7'],
            body3: ['8', '9'],
        });
    });

    test('handles spaces before/after content', () => {
        const contents = [
            '# @managed start header',
            '# header',
            '# @managed end header',
            '# comment',
            '.eslintrc.js',
            '# @managed start body',
            '# body',
            '# @managed end body',
            '.prettierrc.js',
        ];

        const identifier = '#';
        const marker = '@managed';
        const removeInitialContent = false;
        const allowUnmanagedContent = true;

        const sections = normalizeSections({
            header: '# header',
            body: [{ id: 'body', contents: '# body' }],
        });

        const sorted = mapUnmanagedContents({
            sections,
            contents,
            identifier,
            marker,
            removeInitialContent,
            allowUnmanagedContent,
        });

        expect(sorted).toEqual({
            body: ['.prettierrc.js'],
            header: ['# comment', '.eslintrc.js'],
        });
    });

    test('only managed content', () => {
        const contents = [
            '# @managed start header',
            '# header',
            '# @managed end header',
            '# @managed start body',
            '# body',
            '# @managed end body',
        ];

        const identifier = '#';
        const marker = '@managed';
        const removeInitialContent = false;
        const allowUnmanagedContent = true;

        const sections = normalizeSections({
            header: '# header',
            body: [{ id: 'body', contents: '# body' }],
        });

        const sorted = mapUnmanagedContents({
            sections,
            contents,
            identifier,
            marker,
            removeInitialContent,
            allowUnmanagedContent,
        });

        expect(sorted).toEqual({});
    });

    test('no managed content', () => {
        const contents = ['1', '2', '3'];

        const identifier = '#';
        const marker = '@managed';
        const removeInitialContent = false;
        const allowUnmanagedContent = true;

        const sections = normalizeSections({});

        const sorted = mapUnmanagedContents({
            sections,
            contents,
            identifier,
            marker,
            removeInitialContent,
            allowUnmanagedContent,
        });

        expect(sorted).toEqual({
            '': ['1', '2', '3'],
        });
    });

    test('new managed content without', () => {
        const contents = ['1', '2', '3'];

        const identifier = '#';
        const marker = '@managed';
        const removeInitialContent = false;
        const allowUnmanagedContent = true;

        const sections = normalizeSections({
            body: [
                {
                    id: 'body1',
                    contents: '# body1',
                },
            ],
        });

        const sorted = mapUnmanagedContents({
            sections,
            contents,
            identifier,
            marker,
            removeInitialContent,
            allowUnmanagedContent,
        });

        expect(sorted).toEqual({
            body1: ['1', '2', '3'],
        });
    });

    test('new managed content with header', () => {
        const contents = ['1', '2', '3'];

        const identifier = '#';
        const marker = '@managed';
        const removeInitialContent = false;
        const allowUnmanagedContent = true;

        const sections = normalizeSections({
            header: '# header',
        });

        const sorted = mapUnmanagedContents({
            sections,
            contents,
            identifier,
            marker,
            removeInitialContent,
            allowUnmanagedContent,
        });

        expect(sorted).toEqual({
            header: ['1', '2', '3'],
        });
    });

    test('new managed content with footer', () => {
        const contents = ['1', '2', '3'];

        const identifier = '#';
        const marker = '@managed';
        const removeInitialContent = false;
        const allowUnmanagedContent = true;

        const sections = normalizeSections({
            body: [
                {
                    id: 'body1',
                    contents: '# body1',
                },
            ],
            footer: '# footer',
        });

        const sorted = mapUnmanagedContents({
            sections,
            contents,
            identifier,
            marker,
            removeInitialContent,
            allowUnmanagedContent,
        });

        expect(sorted).toEqual({
            body1: ['1', '2', '3'],
        });
    });

    test('unmanaged content after footer', () => {
        const contents = [
            '# @managed start header',
            '# header',
            '# @managed end header',
            '0',
            '# @managed start body1',
            '# body1',
            '# @managed end body1',
            '1',
            '# @managed start footer',
            '# footer',
            '# @managed end footer',
            '',
            '2',
            '3',
        ];

        const identifier = '#';
        const marker = '@managed';
        const removeInitialContent = false;
        const allowUnmanagedContent = true;

        const sections = normalizeSections({
            header: '# header',
            body: [{ id: 'body1', contents: '# body1' }],
            footer: '# footer',
        });

        const sorted = mapUnmanagedContents({
            sections,
            contents,
            identifier,
            marker,
            removeInitialContent,
            allowUnmanagedContent,
        });

        expect(sorted).toEqual({
            header: ['0'],
            body1: ['1', '', '2', '3'],
        });
    });

    test('unmanaged content above header', () => {
        const contents = [
            '1',
            '2',
            '# @managed start header',
            '# header',
            '# @managed end header',
            '3',
            '# @managed start body1',
            '# body1',
            '# @managed end body1',
            '4',
            '5',
            '# @managed start footer',
            '# footer',
            '# @managed end footer',
        ];

        const identifier = '#';
        const marker = '@managed';
        const removeInitialContent = false;
        const allowUnmanagedContent = true;

        const sections = normalizeSections({
            header: '# header',
            body: [{ id: 'body1', contents: '# body1' }],
            footer: '# footer',
        });

        const sorted = mapUnmanagedContents({
            sections,
            contents,
            identifier,
            marker,
            removeInitialContent,
            allowUnmanagedContent,
        });

        expect(sorted).toEqual({
            header: ['1', '2', '', '3'],
            body1: ['4', '5'],
        });
    });

    test('allowUnmanagedContent: false', () => {
        const contents = [
            '# @managed start header',
            '# header',
            '# @managed end header',
            '# comment',
            '1',
            '# @managed start body',
            '# body',
            '# @managed end body',
            '2',
            '',
        ];

        const identifier = '#';
        const marker = '@managed';
        const removeInitialContent = false;
        const allowUnmanagedContent = false;

        const sections = normalizeSections({
            header: '# header',
            body: [{ id: 'body', contents: '# body' }],
        });

        const sorted = mapUnmanagedContents({
            sections,
            contents,
            identifier,
            marker,
            removeInitialContent,
            allowUnmanagedContent,
        });
        expect(sorted).toEqual({});
    });

    test('allowUnmanagedContent: true, removeInitialContent: true previouslyManaged: false', () => {
        const contents = ['1', '2', '3', ''];

        const identifier = '#';
        const marker = '@managed';
        const removeInitialContent = true;
        const allowUnmanagedContent = true;

        const sections = normalizeSections({
            header: '# header',
            body: [{ id: 'body', contents: '# body' }],
        });

        const sorted = mapUnmanagedContents({
            sections,
            contents,
            identifier,
            marker,
            removeInitialContent,
            allowUnmanagedContent,
        });

        expect(sorted).toEqual({});
    });

    test('allowUnmanagedContent: true, removeInitialContent: true previouslyManaged: true', () => {
        const contents = [
            '# @managed start header',
            '# header',
            '# @managed end header',
            '1',
            '2',
            '3',
        ];

        const identifier = '#';
        const marker = '@managed';
        const removeInitialContent = true;
        const allowUnmanagedContent = true;

        const sections = normalizeSections({
            header: '# header',
        });

        const sorted = mapUnmanagedContents({
            sections,
            contents,
            identifier,
            marker,
            removeInitialContent,
            allowUnmanagedContent,
        });

        expect(sorted).toEqual({ header: ['1', '2', '3'] });
    });
});
