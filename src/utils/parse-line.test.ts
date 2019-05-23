import { parseLine } from './parse-line';

describe('parseLine', () => {
    test.each`
        identifier | marker          | text                           | expected
        ${'#'}     | ${'@example'}   | ${'# @example start header'}   | ${{ isComment: true, isMarker: true, section: 'header', state: 'start' }}
        ${'#'}     | ${'@example'}   | ${'# @example end header'}     | ${{ isComment: true, isMarker: true, section: 'header', state: 'end' }}
        ${'#'}     | ${'@example'}   | ${'    # @example end header'} | ${{ isComment: true, isMarker: true, section: 'header', state: 'end' }}
        ${'#'}     | ${'@example'}   | ${'# @example end header   '}  | ${{ isComment: true, isMarker: true, section: 'header', state: 'end' }}
        ${'#'}     | ${'@example'}   | ${'#@example end header'}      | ${{ isComment: true, isMarker: true, section: 'header', state: 'end' }}
        ${'//'}    | ${'@example'}   | ${'// @example end header'}    | ${{ isComment: true, isMarker: true, section: 'header', state: 'end' }}
        ${'#'}     | ${'@has space'} | ${'# @has space end header'}   | ${{ isComment: true, isMarker: true, section: 'header', state: 'end' }}
        ${'#'}     | ${'@example'}   | ${'not # comment'}             | ${{ isComment: false, isMarker: false, section: '', state: '' }}
        ${'#'}     | ${'@example'}   | ${'# not marker'}              | ${{ isComment: true, isMarker: false, section: '', state: '' }}
        ${'#'}     | ${'@example'}   | ${'not comment'}               | ${{ isComment: false, isMarker: false, section: '', state: '' }}
        ${'#'}     | ${'@example'}   | ${'not # @example marker'}     | ${{ isComment: false, isMarker: false, section: '', state: '' }}
    `(
        'returns `$expected` identifier: `$identifier` marker: `$marker` text: `$text`',
        ({ identifier, marker, text, expected }) => {
            const parsed = parseLine({ line: text, identifier, marker });
            expect(parsed).toEqual(expected);
        },
    );
});
