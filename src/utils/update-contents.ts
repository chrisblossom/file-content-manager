import { UnmanagedContentMap } from './map-unmanaged-contents';
import { SectionsNormalized } from './normalize-sections';

interface Params {
	unmanaged: UnmanagedContentMap;
	sections: SectionsNormalized;
	marker: string;
	identifier: string;
	allowUnmanagedContent: boolean;
}

function updateContents({
	unmanaged,
	sections,
	allowUnmanagedContent,
	marker,
	identifier,
}: Params): string[] {
	const updated = sections.ids.reduce(
		(acc: string[], sectionId): string[] => {
			// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
			const unmanagedContent = unmanaged[sectionId] || [];

			// unmanaged top file key is ''
			if (sectionId === '') {
				// no top unmanaged content
				if (unmanagedContent.length === 0) {
					return acc;
				}

				return [
					...acc,
					...unmanagedContent,
				];
			}

			let startMarker: string[] = [];
			let endMarker: string[] = [];

			// only include markers when allowUnmanagedContent is true
			if (allowUnmanagedContent === true) {
				startMarker = [`${identifier} ${marker} start ${sectionId}`];
				endMarker = [`${identifier} ${marker} end ${sectionId}`];
			}

			// separate sections with new line when allowUnmanagedContent are false
			if (allowUnmanagedContent === false && sectionId !== 'footer') {
				endMarker = [''];
			}

			const sectionContents = sections.contents[sectionId];

			// Prevent empty content from adding unnecessary new line
			const normalizedContents =
				sectionContents !== '' ? [sectionContents] : [];

			return [
				...acc,
				...startMarker,
				...normalizedContents,
				...endMarker,
				...unmanagedContent,
			];
		},
		[],
	);

	return updated;
}

export { updateContents };
