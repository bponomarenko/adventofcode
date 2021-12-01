const Intcode = require('./intcode');

const formatInput = input => input.split(',').map(num => +num);

const main = (input, isTest) => {
  if (!isTest) {
    input[1] = 12;
    input[2] = 2;
  }
  const program = new Intcode().run(input);
  return program[0];
};

module.exports = {
  main: (input, isTest) => main(formatInput(input), isTest),
  formatInput,
};
