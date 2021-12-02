const Intcode = require('./intcode');

const formatInput = input => input.split(',').map(num => +num);

const part1 = program => new Intcode(program).run(1).pop();

const part2 = program => new Intcode(program).run(5).pop();

module.exports = { part1, part2, formatInput };
