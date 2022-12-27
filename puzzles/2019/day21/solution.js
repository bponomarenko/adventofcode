import Intcode from '../intcode.js';

export const formatInput = input => input;

const sendDroid = (input, instructions) => new Intcode(input, {
  input: instructions.flatMap(str => str.split('').map(char => char.charCodeAt(0)).concat(10)),
}).lastOutput;

export const part1 = input => sendDroid(input, [
  'NOT A J',
  'NOT B T',
  'OR T J',
  'NOT C T',
  'OR T J',
  'AND D J',
  'WALK',
]);

export const part2 = input => sendDroid(input, [
  'NOT A J',
  'NOT B T',
  'OR T J',
  'NOT C T',
  'OR T J',
  'AND D J',
  'NOT H T',
  'NOT T T',
  'OR E T',
  'AND T J',
  'RUN',
]);
