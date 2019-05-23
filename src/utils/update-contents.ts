import { UnmanagedContentMap } from './map-unmanaged-contents';
import { SectionsNormalized } from './normalize-sections';

interface Params {
    unmanaged: UnmanagedContentMap;
    sections: SectionsNormalized;
    marker: string;
    identifier: string;
}

function updateContents({ unmanaged, sections, marker, identifier }: Params) {
    const updated = sections.ids.reduce((acc: string[], sectionId) => {
        const unmanagedContent = unmanaged[sectionId] || [];

        // unmanaged top file key is ''
        if (sectionId === '') {
            // no top unmanaged content
            if (unmanagedContent.length === 0) {
                return acc;
            }

            return [...acc, ...unmanagedContent];
        }

        const startMarker = `${identifier} ${marker} start ${sectionId}`;
        const endMarker = `${identifier} ${marker} end ${sectionId}`;

        const sectionContents = sections.contents[sectionId];

        // Prevent empty content from adding unnecessary new line
        const normalizedContents =
            sectionContents !== '' ? [sectionContents] : [];

        return [
            ...acc,
            startMarker,
            ...normalizedContents,
            endMarker,
            ...unmanagedContent,
        ];
    }, []);

    return updated;
}

export { updateContents };
