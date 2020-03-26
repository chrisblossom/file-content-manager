import { Body, Header, Footer } from '../file-manager';

interface NormalizeSectionsParameters {
	body?: Body;
	header?: Header;
	footer?: Footer;
}

export interface SectionsNormalized {
	ids: string[];
	contents: { [key: string]: string };
	header: boolean;
	footer: boolean;
}

function normalizeSections({
	body = [],
	header,
	footer,
}: NormalizeSectionsParameters): SectionsNormalized {
	const initial: SectionsNormalized = {
		ids: [''],
		contents: {},
		header: false,
		footer: false,
	};

	if (typeof header === 'string') {
		initial.ids.push('header');
		initial.contents.header = header;
		initial.header = true;
	}

	const normalized = body.reduce((acc: SectionsNormalized, section) => {
		if (['header', 'footer'].includes(section.id)) {
			throw new Error(
				`"${section.id}" cannot be used as an id. Use option "${section.id}" instead or change identifier`,
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

	if (typeof footer === 'string') {
		normalized.ids.push('footer');
		normalized.contents.footer = footer;
		normalized.footer = true;
	}

	return normalized;
}

export { normalizeSections };
