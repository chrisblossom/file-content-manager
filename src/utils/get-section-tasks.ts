import { SectionsNormalized } from './normalize-sections';
import { UnmanagedContentMap } from './map-unmanaged-contents';

interface UpdateDelete {
    [key: string]: 'update' | 'delete';
}

function getSectionTasks(
    updatedSection: SectionsNormalized,
    previousSectionIds: UnmanagedContentMap,
) {
    const addSections = updatedSection.ids.reduce(
        (acc: string[], sectionId) => {
            if (previousSectionIds.includes(sectionId) === true) {
                return acc;
            }

            return [...acc, sectionId];
        },
        [],
    );

    const matchedSections: UpdateDelete = previousSectionIds.reduce(
        (acc: UpdateDelete, sectionId) => {
            // never include header and footer
            if (['header', 'footer'].includes(sectionId) === true) {
                return acc;
            }

            // Update sectionIds
            if (updatedSection.ids.includes(sectionId) === true) {
                return { ...acc, [sectionId]: 'update' };
            }

            // Unused sectionIds
            return { ...acc, [sectionId]: 'delete' };
        },
        {},
    );

    return {
        new: addSections,
        updated: matchedSections,
    };
}

export { getSectionTasks };
