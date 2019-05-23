import { parseLine } from './parse-line';
import { wasPreviouslyManaged } from './was-previously-managed';
import { SectionsNormalized } from './normalize-sections';

interface Params {
    contents: string[];
    sections: SectionsNormalized;
    identifier: string;
    marker: string;
    allowUnmanagedContent: boolean;
    removeInitialContent: boolean;
}

export type UnmanagedContentMap = {
    [key: string]: string[];
};

function mapUnmanagedContents({
    contents,
    sections,
    identifier,
    marker,
    allowUnmanagedContent,
    removeInitialContent,
}: Params): UnmanagedContentMap {
    if (allowUnmanagedContent === false) {
        return {};
    }

    const previouslyManaged = wasPreviouslyManaged(
        contents,
        identifier,
        marker,
    );

    if (removeInitialContent === true) {
        if (previouslyManaged === false) {
            return {};
        }
    }

    let insideMarker = false;
    let lastSectionId = '';
    let forcedSectionId = '';

    const sectionCount = sections.ids.length;
    if (
        previouslyManaged === false &&
        (sectionCount !== 0 || sections.header !== null)
    ) {
        lastSectionId = sections.ids[sectionCount - 1] || 'header';
    }

    const contentMap = contents.reduce(
        (acc: UnmanagedContentMap, line, index) => {
            const { state, section } = parseLine({ line, identifier, marker });

            if (state === 'start') {
                if (forcedSectionId !== '') {
                    /**
                     * separate moved sections with empty space
                     */
                    const lastState = acc[forcedSectionId];
                    if (lastState[lastState.length - 1] !== '') {
                        lastState.push('');
                    }

                    forcedSectionId = '';
                }

                insideMarker = true;
                return acc;
            }

            if (state === 'end') {
                // exclude footer to force footer to bottom
                const matchedSection = [
                    ...(sections.header !== null ? ['header'] : []),
                    ...sections.ids,
                ].includes(section);

                if (matchedSection === true) {
                    lastSectionId = section;
                }

                /**
                 * handle removed managed sections
                 */
                if (matchedSection === false) {
                    const previousSection = acc[lastSectionId] || [];
                    const previousSectionLine =
                        previousSection[previousSection.length - 1];
                    const nextLine = contents[index + 1] || '';

                    if (previousSectionLine !== '' && nextLine !== '') {
                        // add space when section removed
                        previousSection.push('');
                    } else if (previousSectionLine === '' && nextLine === '') {
                        // combine double spaces when section removed
                        previousSection.pop();
                    }
                }

                insideMarker = false;
                return acc;
            }

            if (insideMarker === true) {
                return acc;
            }

            /**
             * Do not allow unmanaged text above header
             */
            if (lastSectionId === '' && sections.header !== null) {
                forcedSectionId = 'header';
            }

            const sectionId = forcedSectionId || lastSectionId;

            /**
             * handle unmanaged text
             */
            const matched = acc[sectionId] || [];

            return {
                ...acc,
                [sectionId]: [...matched, line],
            };
        },
        {},
    );

    return contentMap;
}

export { mapUnmanagedContents };
