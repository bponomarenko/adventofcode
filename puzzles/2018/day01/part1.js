const formatInput = input => input.split(/,\s|\n/).map(Number);

// Can it be even simpler?
const main = input => input.reduce((acc, num) => acc + num, 0);

module.exports = { main: input => main(formatInput(input)), mainFn: main, formatInput };
