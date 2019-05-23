import { Body, Header, Footer } from '../file-manager';

interface NormalizeSectionsParameters {
    body?: Body;
    header?: Header;
    footer?: Footer;
}

export type SectionsNormalized = {
    ids: string[];
    contents: { [key: string]: string };
    header: string | null;
    footer: string | null;
};

function normalizeSections({
    body = [],
    header,
    footer,
}: NormalizeSectionsParameters): SectionsNormalized {
    const initial: SectionsNormalized = {
        ids: [],
        contents: {},
        header: typeof header === 'string' ? header : null,
        footer: typeof footer === 'string' ? footer : null,
    };

    const normalized = body.reduce((acc: SectionsNormalized, section) => {
        if (['header', 'footer'].includes(section.id)) {
            throw new Error(
                `"${section.id}" cannot be used as an id. Use option "${
                    section.id
                }" instead or change identifier`,
            );
        }
        if (section.id === '') {
            throw new Error(
                'section id cannot an empty string. Use header option or change identifier',
            );
        }

        const ids = [...acc.ids, section.id];
        const contents = {
            ...acc.contents,
            [section.id]: section.contents,
        };

        return { ...acc, ids, contents };
    }, initial);

    return normalized;
}

export { normalizeSections };
