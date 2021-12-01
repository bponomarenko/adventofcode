const Intcode = require('../day05/intcode');

const formatInput = input => input.split(',').map(num => +num);

const main = input => new Intcode(input).run(1).join(',');

module.exports = {
  main: (input, isTest) => main(formatInput(input), isTest),
  formatInput,
};
