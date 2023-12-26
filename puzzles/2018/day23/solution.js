import { getDistance } from '../../utils/grid.js';

export const formatInput = input => input.split('\n').map((row, i) => {
  const [pos, radius] = row.slice(5).split('>, r=');
  return [+radius, pos.split(',').map(Number), i];
});

export const part1 = input => {
  const [radius, position] = input.sort(([r1], [r2]) => r2 - r1)[0];
  return input.filter(([, pos]) => getDistance(position, pos) <= radius).length;
};

export const part2 = input => {
  console.log(input);
};
