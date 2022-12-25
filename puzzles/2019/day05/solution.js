import Intcode from '../intcode.js';

export const formatInput = input => input.split(',').map(Number);

export const part1 = program => new Intcode(program, { input: [1] }).lastOutput;

export const part2 = program => new Intcode(program, { input: [5] }).lastOutput;
