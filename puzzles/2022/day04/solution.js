export const formatInput = input => input.split('\n').map(line => line.split(',').map(range => range.split('-').map(Number)));

export const part1 = input => input.filter(([[s1, e1], [s2, e2]]) => (s1 >= s2 && e1 <= e2) || (s2 >= s1 && e2 <= e1)).length;

export const part2 = input => input.filter(([[s1, e1], [s2, e2]]) => (s1 <= e2 && s2 <= e1) || (s2 <= e1 && s1 <= e2)).length;
