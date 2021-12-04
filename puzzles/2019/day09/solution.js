import Intcode from '../day05/intcode.js';

export const formatInput = input => input.split(',').map(num => +num);

export const part1 = input => new Intcode(input).run(1).join(',');

export const part2 = input => new Intcode(input).run(2).pop();
