const Intcode = require('../day05/intcode');

const formatInput = input => input.split(',').map(num => +num);

const part1 = input => new Intcode(input).run(1).join(',');

const part2 = input => new Intcode(input).run(2).pop();

module.exports = { part1, part2, formatInput };
