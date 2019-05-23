import { addManagedLines, removeManagedLines } from './managed-lines';

describe('header footer body and content', () => {
    const withLines = [
        '# @managed start header',
        '# header',
        '# @managed end header',
        '',
        '0',
        '',
        '# @managed start body1',
        '# body1',
        '# @managed end body1',
        '',
        '1',
        '',
        '# @managed start footer',
        '# footer',
        '# @managed end footer',
        '',
    ];

    const withOutLines = [
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
    ];

    const identifier = '#';
    const marker = '@managed';

    test('addManagedLines', () => {
        const linesAdded = addManagedLines({
            contents: withOutLines,
            identifier,
            marker,
        });

        expect(linesAdded).toEqual(withLines);
    });

    test('removeManagedLines', () => {
        const linesRemoved = removeManagedLines({
            contents: withLines,
            identifier,
            marker,
        });

        expect(linesRemoved).toEqual(withOutLines);
    });
});

describe('header footer body and content with excess lines', () => {
    const withLines = [
        '# @managed start header',
        '# header',
        '# @managed end header',
        '',
        '',
        '0',
        '',
        '',
        '# @managed start body1',
        '# body1',
        '# @managed end body1',
        '',
        '',
        '1',
        '',
        '',
        '# @managed start footer',
        '# footer',
        '# @managed end footer',
        '',
    ];

    const withOutLines = [
        '# @managed start header',
        '# header',
        '# @managed end header',
        '',
        '0',
        '',
        '# @managed start body1',
        '# body1',
        '# @managed end body1',
        '',
        '1',
        '',
        '# @managed start footer',
        '# footer',
        '# @managed end footer',
    ];

    const identifier = '#';
    const marker = '@managed';

    test('addManagedLines', () => {
        const linesAdded = addManagedLines({
            contents: withOutLines,
            identifier,
            marker,
        });

        expect(linesAdded).toEqual(withLines);
    });

    test('removeManagedLines', () => {
        const linesRemoved = removeManagedLines({
            contents: withLines,
            identifier,
            marker,
        });

        expect(linesRemoved).toEqual(withOutLines);
    });
});

describe('header footer body and no content', () => {
    const withLines = [
        '# @managed start header',
        '# header',
        '# @managed end header',
        '',
        '# @managed start body1',
        '# body1',
        '# @managed end body1',
        '',
        '# @managed start footer',
        '# footer',
        '# @managed end footer',
        '',
    ];

    const withOutLines = [
        '# @managed start header',
        '# header',
        '# @managed end header',
        '# @managed start body1',
        '# body1',
        '# @managed end body1',
        '# @managed start footer',
        '# footer',
        '# @managed end footer',
    ];

    const identifier = '#';
    const marker = '@managed';

    test('addManagedLines', () => {
        const linesAdded = addManagedLines({
            contents: withOutLines,
            identifier,
            marker,
        });

        expect(linesAdded).toEqual(withLines);
    });

    test('removeManagedLines', () => {
        const linesRemoved = removeManagedLines({
            contents: withLines,
            identifier,
            marker,
        });

        expect(linesRemoved).toEqual(withOutLines);
    });
});

describe('adds new line at end when not managed', () => {
    const withLines = [
        '# @managed start footer',
        '# footer',
        '# @managed end footer',
        '',
        '',
        'remove below',
        '',
    ];

    const withOutLines = [
        '# @managed start footer',
        '# footer',
        '# @managed end footer',
        '',
        'remove below',
    ];

    const identifier = '#';
    const marker = '@managed';

    test('addManagedLines', () => {
        const linesAdded = addManagedLines({
            contents: withOutLines,
            identifier,
            marker,
        });

        expect(linesAdded).toEqual(withLines);
    });

    test('removeManagedLines', () => {
        const linesRemoved = removeManagedLines({
            contents: withLines,
            identifier,
            marker,
        });

        expect(linesRemoved).toEqual(withOutLines);
    });
});

describe('handles no managed content', () => {
    const withLines = ['1', '', '', '2', '', '3', ''];
    const withOutLines = ['1', '', '', '2', '', '3'];

    const identifier = '#';
    const marker = '@managed';

    test('addManagedLines', () => {
        const linesAdded = addManagedLines({
            contents: withOutLines,
            identifier,
            marker,
        });

        expect(linesAdded).toEqual(withLines);
    });

    test('removeManagedLines', () => {
        const linesRemoved = removeManagedLines({
            contents: withLines,
            identifier,
            marker,
        });

        expect(linesRemoved).toEqual(withOutLines);
    });
});

describe('addManagedLines', () => {
    test('adds new line to empty array', () => {
        const contents: string[] = [];

        const identifier = '#';
        const marker = '@managed';

        const result = addManagedLines({
            contents,
            identifier,
            marker,
        });

        expect(result).toEqual(['']);
    });
});

describe('removeManagedLines', () => {
    test('removes excess spaces in header and footer', () => {
        const contents = [
            '',
            '',
            '',
            '',
            '# @managed start footer',
            '# footer',
            '# @managed end footer',
            '',
            'remove below',
            '',
            '',
            '',
        ];

        const identifier = '#';
        const marker = '@managed';

        const result = removeManagedLines({
            contents,
            identifier,
            marker,
        });

        expect(result).toEqual([
            '# @managed start footer',
            '# footer',
            '# @managed end footer',
            'remove below',
        ]);
    });

    test('handles only empty lines', () => {
        const contents = ['', '', '', '', ''];

        const identifier = '#';
        const marker = '@managed';

        const result = removeManagedLines({
            contents,
            identifier,
            marker,
        });

        expect(result).toEqual([]);
    });
});
