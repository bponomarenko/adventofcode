import Intcode from '../intcode.js';

export const formatInput = input => input.split(',').map(num => +num);

export const part1 = input => new Intcode(input, { input: [1] }).output.join(',');

export const part2 = input => new Intcode(input, { input: [2] }).lastOutput;
