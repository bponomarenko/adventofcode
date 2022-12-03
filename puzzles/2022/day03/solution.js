import { sum } from '../../utils/collections.js';

export const formatInput = input => input.split('\n');

const getPriority = badge => {
  const code = badge.charCodeAt(0);
  // lower case chars go after upper cased on the ascii table
  return code >= 97 ? code - 96 : code - 38;
};

export const part1 = input => {
  const priorities = input.map(line => {
    const middle = line.length / 2;
    const firstPart = new Set(line.slice(0, middle).split(''));
    const badge = line.slice(middle).split('').find(item => firstPart.has(item));
    return getPriority(badge);
  });
  return sum(priorities);
};

export const part2 = input => {
  let result = 0;
  for (let i = 0, max = input.length; i < max; i += 3) {
    const line1 = new Set(input[i]);
    const line2 = new Set(input[i + 1]);
    const badge = input[i + 2].split('').find(char => line1.has(char) && line2.has(char));
    result += getPriority(badge);
  }
  return result;
};
