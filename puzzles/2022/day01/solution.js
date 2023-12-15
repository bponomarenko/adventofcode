export const formatInput = input => input.split('\n\n').map(line => line.split('\n').map(Number));

export const part1 = input => Math.max(...input.map(row => row.sum()));

export const part2 = input => input.map(row => row.sum()).sort((a, b) => b - a).slice(0, 3).sum();
