const Intcode = require('./intcode');

const formatInput = input => {
  const [inp, program] = input.split('\n');
  return { input: +inp, program: program.split(',').map(num => +num) };
};

const main = ({ input, program }) => new Intcode(program).run(input).pop();

module.exports = {
  main: (input, isTest) => main(formatInput(input), isTest),
  formatInput,
};
