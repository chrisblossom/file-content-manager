import { splitNewLines } from './split-new-lines';

describe.skip('splitNewLines', () => {
    test('single newlines', () => {
        const split = splitNewLines('AAA\rBBB\nCCC\r\nDDD');

        expect(split).toEqual(['AAA', 'BBB', 'CCC', 'DDD']);
    });

    test('double newlines', () => {
        const split = splitNewLines('EEE\r\rFFF\n\nGGG\r\n\r\nHHH');

        expect(split).toEqual(['EEE', '', 'FFF', '', 'GGG', '', 'HHH']);
    });

    test('mixed sequences', () => {
        const split = splitNewLines('III\n\r\nJJJ\r\r\nKKK\r\n\nLLL\r\n\rMMM');

        expect(split).toEqual([
            'III',
            '',
            'JJJ',
            '',
            'KKK',
            '',
            'LLL',
            '',
            'MMM',
        ]);
    });
});
