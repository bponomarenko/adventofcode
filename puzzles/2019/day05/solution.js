import Intcode from './intcode.js';

export const formatInput = input => input.split(',').map(Number);

export const part1 = program => new Intcode(program).run(1).pop();

export const part2 = program => new Intcode(program).run(5).pop();
