function removeId(comment: string, identifier: string): string {
	return comment
		.split(identifier)
		.slice(1)
		.join(identifier)
		.trim();
}

function isMarker(
	comment: string,
	identifier: string,
	marker: string,
): boolean {
	return removeId(comment, identifier).startsWith(marker);
}

type markerDataType = ['start' | 'end', string];

function getMarkerData(markerComment: string, marker: string): markerDataType {
	const identifierLength = marker.length;
	const markerText = markerComment.substring(identifierLength).trim();

	const [markerType, markerValue]: markerDataType = markerText.split(
		' ',
	) as markerDataType;

	return [markerType, markerValue];
}

function isComment(line: string, identifier: string): boolean {
	return line.trim().startsWith(identifier);
}

interface ParseLineParameters {
	line: string;
	identifier: string;
	marker: string;
}

function parseLine({
	line,
	identifier,
	marker,
}: ParseLineParameters):
	| { isComment: boolean; isMarker: false; state: ''; section: '' }
	| {
			isComment: true;
			isMarker: true;
			state: 'start' | 'end';
			section: string;
	  } {
	const lineIsComment = isComment(line, identifier);
	if (lineIsComment === false) {
		return {
			isComment: lineIsComment,
			isMarker: lineIsComment,
			state: '',
			section: '',
		};
	}

	const lineIsMarker = isMarker(line, identifier, marker);
	if (lineIsMarker === false) {
		return {
			isComment: lineIsComment,
			isMarker: lineIsMarker,
			state: '',
			section: '',
		};
	}

	const commentIdRemoved = removeId(line, identifier);
	const [state, section] = getMarkerData(commentIdRemoved, marker);

	const sections = {
		isComment: lineIsComment,
		isMarker: lineIsMarker,
		section,
		state,
	};

	return sections;
}

export { parseLine };
