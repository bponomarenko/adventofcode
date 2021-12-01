const Intcode = require('./intcode');
const { formatInput } = require('./part1');

const main = input => {
  const intcode = new Intcode();

  for (let noun = 0; noun < 100; noun += 1) {
    for (let verb = 0; verb < 100; verb += 1) {
      input[1] = noun;
      input[2] = verb;
      if (intcode.run(input)[0] === 19690720) {
        return 100 * noun + verb;
      }
    }
  }
  return null;
};

module.exports = { main: (input, isTest) => main(formatInput(input), isTest) };
