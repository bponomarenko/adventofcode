const { formatInput } = require('./part1');
const Intcode = require('./intcode');

const main = ({ input, program }) => new Intcode(program).run(input).pop();

module.exports = { main: (input, isTest) => main(formatInput(input), isTest) };
