import fs from 'fs';
import { promisify } from 'util';
import { updateContents } from './utils/update-contents';
import { normalizeSections } from './utils/normalize-sections';
import { mapUnmanagedContents } from './utils/map-unmanaged-contents';
import { addManagedLines, removeManagedLines } from './utils/managed-lines';
import { normalizeNewLines, splitNewLines } from './utils/new-lines';

const readFileAsync = promisify(fs.readFile);

export interface Section {
	id: string;
	contents: string;
}

export type Header = string;
export type Footer = string;
export type Body = Section[];

interface FileContentManagerParams {
	file: string;
	marker: string;
	fileType: string;

	header?: Header;
	body?: Body;
	footer?: Footer;

	allowUnmanagedContent?: boolean;
	removeInitialContent?: boolean;
}

/**
 * Manages the content of a file by updating, removing, and adding sections.
 *
 * @param {FileContentManagerParams} args - The parameters for managing the file.
 * @param {string} args.file - The path to the file.
 * @param {string} args.marker - The marker used to identify sections in the file.
 * @param {string} args.fileType - The type of the file.
 * @param {string} args.header - The header section content.
 * @param {string} args.body - The body section content.
 * @param {string} args.footer - The footer section content.
 * @param {boolean} [args.allowUnmanagedContent=false] - Indicates if unmanaged content is allowed.
 * @param {boolean} [args.removeInitialContent=true] - Indicates if the initial content should be removed.
 * @returns {Promise<string>} The updated content of the file.
 */
async function fileContentManager(
	args: FileContentManagerParams,
): Promise<string> {
	const {
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
		fileContents = await readFileAsync(file, 'utf8');
	} catch (error) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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

export { fileContentManager };
