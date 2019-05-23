import fse from 'fs-extra';
import { updateContents } from './utils/update-contents';
import { normalizeSections } from './utils/normalize-sections';
import { mapUnmanagedContents } from './utils/map-unmanaged-contents';
import { removeManagedLines } from './utils/managed-lines';
import { splitNewLines } from './utils/split-new-lines';

export interface Section {
    id: string;
    contents: string;
}

export type Header = string;
export type Footer = string;
export type Body = Section[];

interface Args {
    file: string;
    marker: string;
    fileType: string;

    header?: Header;
    body?: Body;
    footer?: Footer;

    allowUnmanagedContent?: boolean;
    removeInitialContent?: boolean;
}

async function fileManager(args: Args) {
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

    const fileContents = await fse.readFile(file, 'utf8');
    const normalizedSections = normalizeSections({ body, header, footer });

    // move to everything below parsers/ignore.ts
    const identifier = '#';
    const contentsSplit = splitNewLines(fileContents);

    const excessSpacesRemoved = removeManagedLines({
        contents: contentsSplit,
        identifier,
        marker,
    });

    const contentsNormalized = mapUnmanagedContents({
        contents: excessSpacesRemoved,
        sections: normalizedSections,
        identifier,
        marker,
        allowUnmanagedContent,
        removeInitialContent,
    });

    // const update = updateContents({
    //     contents: contentsNormalized,
    //     sections: normalizedSections,
    //     marker,
    //     identifier,
    // });
    //
    // const combine = `|${update.join('\n')}|`;
    //
    // return combine;
}

export { fileManager };
