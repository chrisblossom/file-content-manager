import { normalizeSections } from './normalize-sections';

describe.only('normalizeSections', () => {
    test('body with header/footer', () => {
        const header = '# header';
        const footer = '# footer';

        const body = [
            { id: 'body1', contents: '# body1' },
            { id: 'body2', contents: '# body2' },
        ];

        const normalized = normalizeSections({ header, body, footer });

        expect(normalized).toEqual({
            contents: {
                body1: '# body1',
                body2: '# body2',
            },
            footer: '# footer',
            header: '# header',
            ids: ['body1', 'body2'],
        });
    });

    test('body without header/footer', () => {
        const body = [
            { id: 'body1', contents: '# body1' },
            { id: 'body2', contents: '# body2' },
        ];

        const normalized = normalizeSections({ body });

        expect(normalized).toEqual({
            contents: {
                body1: '# body1',
                body2: '# body2',
            },
            footer: null,
            header: null,
            ids: ['body1', 'body2'],
        });
    });

    test('no body with header/footer', () => {
        const header = '# header';
        const footer = '# footer';

        const normalized = normalizeSections({ header, footer });
        expect(normalized).toEqual({
            contents: {},
            footer: '# footer',
            header: '# header',
            ids: [],
        });
    });

    test('header/footer empty string', () => {
        const header = '';
        const footer = '';

        const normalized = normalizeSections({ header, footer });

        expect(normalized).toEqual({
            contents: {},
            footer: '',
            header: '',
            ids: [],
        });
    });

    test('empty contents', () => {
        const normalized = normalizeSections({});

        expect(normalized).toEqual({
            contents: {},
            footer: null,
            header: null,
            ids: [],
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
