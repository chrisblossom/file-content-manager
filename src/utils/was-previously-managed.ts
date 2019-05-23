import { parseLine } from './parse-line';

function wasPreviouslyManaged(
    contents: string[],
    identifier: string,
    marker: string,
) {
    const previouslyManaged = contents.some((line) => {
        const { isMarker } = parseLine({ line, identifier, marker });

        return isMarker;
    });

    return previouslyManaged;
}

export { wasPreviouslyManaged };
