function splitNewLines(contents: string) {
    // https://stackoverflow.com/a/52947649
    const split = contents.split(/\r\n|\r|\n/);

    return split;
}

export { splitNewLines };
