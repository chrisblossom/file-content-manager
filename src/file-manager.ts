import fse from 'fs-extra';
import { updateContents } from './utils/update-contents';
import { normalizeSections } from './utils/normalize-sections';
import { mapUnmanagedContents } from './utils/map-unmanaged-contents';
import { addManagedLines, removeManagedLines } from './utils/managed-lines';
import { normalizeNewLines, splitNewLines } from './utils/new-lines';

export interface Section {
	id: string;
	contents: string;
}

export type Header = string;
export type Footer = string;
export type Body = Section[];

interface FileManagerParams {
	file: string;
	marker: string;
	fileType: string;

	header?: Header;
	body?: Body;
	footer?: Footer;

	allowUnmanagedContent?: boolean;
	removeInitialContent?: boolean;
}

async function fileManager(args: FileManagerParams) {
	const {
		//
		file,
		marker,
		// fileType,

		header,
		body,
		footer,

		allowUnmanagedContent = false,
	} = args;

	let { removeInitialContent = true } = args;
	if (allowUnmanagedContent === false) {
		// removeInitialContent cannot be false when allowUnmanagedContent is also false
		removeInitialContent = true;
	}

	let fileContents: string;
	try {
		fileContents = await fse.readFile(file, 'utf8');
	} catch (error) {
		if (error.code !== 'ENOENT') {
			throw error;
		}

		// handle files that do not exist
		fileContents = '';
	}

	const normalizedSections = normalizeSections({ body, header, footer });

	// move to everything below parsers/ignore.ts
	const identifier = '#';
	const contentsSplit = splitNewLines(fileContents);

	const excessSpacesRemoved = removeManagedLines({
		contents: contentsSplit,
		identifier,
		marker,
	});

	const unmanagedContentMap = mapUnmanagedContents({
		contents: excessSpacesRemoved,
		sections: normalizedSections,
		identifier,
		marker,
		allowUnmanagedContent,
		removeInitialContent,
	});

	const update = updateContents({
		unmanaged: unmanagedContentMap,
		sections: normalizedSections,
		allowUnmanagedContent,
		marker,
		identifier,
	});

	const managedNewLinesAdded = addManagedLines({
		contents: update,
		identifier,
		marker,
	});

	const initialMerge = managedNewLinesAdded.join('\n');

	const normalized = normalizeNewLines(initialMerge);

	return normalized;
}

export { fileManager };
