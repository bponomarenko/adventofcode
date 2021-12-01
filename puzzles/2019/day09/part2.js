const { formatInput } = require('./part1');
const Intcode = require('../day05/intcode');

const main = input => new Intcode(input).run(2).pop();

module.exports = { main: (input, isTest) => main(formatInput(input), isTest) };
