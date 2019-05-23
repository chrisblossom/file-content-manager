import { getSectionTasks } from './get-section-tasks';
import { normalizeSections } from './normalize-sections';

describe.skip('getSectionTasks', () => {
    test('get tasks and ignores header/footer', () => {
        const sections = normalizeSections({
            body: [
                { id: 'header', contents: '# header' },
                { id: 'body1', contents: '# body1' },
                { id: 'body2', contents: '# body2' },
                { id: 'body3', contents: '# body3' },
                { id: 'footer', contents: '# footer' },
            ],
        });

        const previousSectionIds = ['header', 'body1', 'remove-this', 'footer'];
        const sorted = getSectionTasks(sections, previousSectionIds);

        expect(sorted).toMatchInlineSnapshot(`
Object {
  "new": Array [
    "body2",
    "body3",
  ],
  "updated": Object {
    "body1": "update",
    "remove-this": "delete",
  },
}
`);
    });
});
