import Intcode from '../intcode.js';

export const formatInput = input => input.split(',').map(Number);

export const part1 = input => new Intcode(input).output.filter((value, i) => (i + 1) % 3 === 0 && value === 2).length;

export const part2 = input => {
  const result = part1(input);
  console.log(result);
  return null;
};
