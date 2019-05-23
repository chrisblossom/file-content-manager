import { parseLine } from './parse-line';

interface WasPreviouslyManagedParameters {
    contents: string[];
    identifier: string;
    marker: string;
}

function wasPreviouslyManaged({
    contents,
    identifier,
    marker,
}: WasPreviouslyManagedParameters) {
    const previouslyManaged = contents.some((line) => {
        const { isMarker } = parseLine({ line, identifier, marker });

        return isMarker;
    });

    return previouslyManaged;
}

export { wasPreviouslyManaged };
