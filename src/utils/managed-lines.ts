import { parseLine } from './parse-line';

interface Params {
    contents: string[];
    identifier: string;
    marker: string;
}

function addManagedLines({ contents, identifier, marker }: Params) {
    const linesAdded = contents.reduce((acc: string[], line, index) => {
        const { state } = parseLine({ line, identifier, marker });

        if (state === 'start' && index !== 0) {
            return [...acc, '', line];
        }

        if (state === 'end') {
            return [...acc, line, ''];
        }

        return [...acc, line];
    }, []);

    /**
     * always keep new line at end of file
     */
    if (linesAdded[linesAdded.length - 1] !== '') {
        linesAdded.push('');
    }

    return linesAdded;
}

function removeManagedLines({ contents, identifier, marker }: Params) {
    let skipNext = false;
    let matchedNonEmptyString = false;

    const linesRemoved = contents.reduceRight((acc: string[], line, index) => {
        const lastLine = acc[0];

        const nextIndex = index - 1;
        const nextLine = contents[nextIndex];

        if (matchedNonEmptyString === false) {
            if (line === '') {
                return acc;
            }

            matchedNonEmptyString = true;
        }

        if (skipNext === true) {
            skipNext = false;
            return acc;
        }

        const { state } = parseLine({ line, identifier, marker });

        if (state === 'start') {
            if (nextLine === '') {
                skipNext = true;
            }
        }

        if (state === 'end') {
            if (lastLine === '') {
                acc.shift();
            }

            matchedNonEmptyString = false;
        }

        return [line, ...acc];
    }, []);

    /**
     * remove leading lines
     */
    for (const line of [...linesRemoved]) {
        if (line === '') {
            linesRemoved.shift();
        } else {
            return linesRemoved;
        }
    }

    return linesRemoved;
}

export { addManagedLines, removeManagedLines };
