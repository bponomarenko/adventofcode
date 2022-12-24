import Intcode from './intcode.js';

export const formatInput = input => input.split(',').map(Number);

export const part1 = (input, isTest) => {
  if (!isTest) {
    input[1] = 12;
    input[2] = 2;
  }
  const program = new Intcode().run(input);
  return program[0];
};

export const part2 = input => {
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
