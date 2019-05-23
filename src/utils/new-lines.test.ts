import { normalizeNewLines, splitNewLines } from './new-lines';

describe('normalizeNewLines', () => {
    test.each`
        contents                                     | expected
        ${'AAA\rBBB\nCCC\r\nDDD'}                    | ${'AAA\nBBB\nCCC\nDDD'}
        ${'EEE\r\rFFF\n\nGGG\r\n\r\nHHH'}            | ${'EEE\n\nFFF\n\nGGG\n\nHHH'}
        ${'III\n\r\nJJJ\r\r\nKKK\r\n\nLLL\r\n\rMMM'} | ${'III\n\nJJJ\n\nKKK\n\nLLL\n\nMMM'}
    `('returns `$expected` contents: `$contents`', ({ contents, expected }) => {
        const normalized = normalizeNewLines(contents);
        expect(normalized).toEqual(expected);
    });
});

describe('splitNewLines', () => {
    test.each`
        contents                                     | expected
        ${'AAA\rBBB\nCCC\r\nDDD'}                    | ${['AAA', 'BBB', 'CCC', 'DDD']}
        ${'EEE\r\rFFF\n\nGGG\r\n\r\nHHH'}            | ${['EEE', '', 'FFF', '', 'GGG', '', 'HHH']}
        ${'III\n\r\nJJJ\r\r\nKKK\r\n\nLLL\r\n\rMMM'} | ${['III', '', 'JJJ', '', 'KKK', '', 'LLL', '', 'MMM']}
    `('returns `$expected` contents: `$contents`', ({ contents, expected }) => {
        const split = splitNewLines(contents);
        expect(split).toEqual(expected);
    });
});
