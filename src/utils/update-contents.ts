import { UnmanagedContentMap } from './map-unmanaged-contents';
import { SectionsNormalized } from './normalize-sections';

interface Params {
    unmanaged: UnmanagedContentMap;
    sections: SectionsNormalized;
    marker: string;
    identifier: string;
}

function updateContents({ unmanaged, sections, marker, identifier }: Params) {
    const allSections = [];

    // unmanaged top file key is ''
    if (Array.isArray(unmanaged[''])) {
        allSections.push('');
    }

    if (sections.header !== null) {
        allSections.push('header');
    }

    allSections.push(...sections.ids);

    if (sections.footer !== null) {
        allSections.push('footer');
    }

    const updated = allSections.reduce((acc: string[], sectionId) => {
        if (sectionId === '') {
            return [...acc, ...unmanaged[sectionId]];
        }

        const startMarker = `${identifier} ${marker} start ${sectionId}`;
        const endMarker = `${identifier} ${marker} end ${sectionId}`;

        let sectionContents;
        if (sectionId === 'header' && sections.header !== null) {
            sectionContents = sections.header;
        } else if (sectionId === 'footer' && sections.footer !== null) {
            sectionContents = sections.footer;
        } else {
            sectionContents = sections.contents[sectionId];
        }

        sectionContents = sectionContents !== '' ? [sectionContents] : [];

        const unmanagedContent = unmanaged[sectionId] || [];

        return [
            ...acc,
            startMarker,
            ...sectionContents,
            endMarker,
            ...unmanagedContent,
        ];
    }, []);

    return updated;
}

export { updateContents };
