import { power, sum } from '../../utils/collections.js';

export const formatInput = input => input
  .split('\n')
  .map(line => line
    .split(': ')[1]
    .split('; ')
    .map(group => group
      .split(', ')
      .map(entry => {
        const [num, color] = entry.split(' ');
        return [+num, color];
      })));

const limits = { red: 12, green: 13, blue: 14 };

export const part1 = input => {
  const indexes = input.map((game, index) => {
    const possible = game.every(set => set.every(([count, color]) => count <= limits[color]));
    return possible ? index + 1 : 0;
  });
  return sum(indexes);
};

export const part2 = input => {
  const powers = input.map(game => {
    const max = { red: 0, green: 0, blue: 0 };
    game.forEach(set => {
      set.forEach(([count, color]) => {
        max[color] = Math.max(max[color], count);
      });
    });
    return power(Object.values(max));
  });
  return sum(powers);
};
