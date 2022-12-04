import { sum } from '../../utils/collections.js';

export const formatInput = input => input.split('\n\n').map(line => line.split('\n').map(Number));

export const part1 = input => Math.max(...input.map(sum));

export const part2 = input => sum(input.map(sum).sort((a, b) => b - a).slice(0, 3));
