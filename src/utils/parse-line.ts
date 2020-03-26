function removeId(comment: string, identifier: string) {
	const [, ...rest] = comment.split(identifier);

	const commentIdRemoved = rest.join(identifier).trim();

	return commentIdRemoved;
}

function isMarker(comment: string, identifier: string, marker: string) {
	const idLength = marker.length;
	const shouldEqualMarker = removeId(comment, identifier).substr(0, idLength);

	const commentIsMarker = shouldEqualMarker === marker;

	return commentIsMarker;
}

function getMarkerData(markerComment: string, marker: string) {
	const identifierLength = marker.length;

	const markerText = markerComment.substring(identifierLength).trim();

	// @ts-ignore
	const markerData: ['start' | 'end', string] = markerText.split(' ');

	return markerData;
}

function isComment(line: string, identifier: string) {
	const identifierLength = identifier.length;
	const firstChar = line.trim().substr(0, identifierLength);

	const lineIsComment = firstChar === identifier;

	return lineIsComment;
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
