const capitalSplitCase = (string: string, splitOn: string = '-', joinWith: string = ' ') => {
    return string.split(splitOn).map(string => string[0].toUpperCase() + string.slice(1)).join(joinWith);
}

const padNumbers = (num: number, size: number) => {
    const ssize = "000000000" + num;
    return ssize.substring(ssize.length - size);
}

export { capitalSplitCase, padNumbers }