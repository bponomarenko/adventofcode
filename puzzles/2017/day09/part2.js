const { formatInput } = require('./part1');

// Count amount of the remove garbage characters this time
const getSum = groups => groups.reduce((acc, { garbage, len, children }) => acc + (garbage ? len : getSum(children)), 0);

const main = input => getSum(input);

module.exports = { main: input => main(formatInput(input)) };
