import Intcode from '../intcode.js';

export const formatInput = input => input;

export const part1 = (input, isTest) => {
  if (!isTest) {
    const parts = input.split(',');
    input = [parts[0], 12, 2, ...parts.slice(3)].join(',');
  }
  return new Intcode(input).firstInstruction;
};

export const part2 = input => {
  const parts = input.split(',');
  for (let noun = 0; noun < 100; noun += 1) {
    for (let verb = 0; verb < 100; verb += 1) {
      input = [parts[0], noun, verb, ...parts.slice(3)].join(',');
      if (new Intcode(input).firstInstruction === 19690720) {
        return 100 * noun + verb;
      }
    }
  }
  return null;
};
