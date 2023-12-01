import { getDistance } from '../../utils/grid.js';

export const formatInput = input => input.split('\n').map(line => line.split(', '));

const sortNums = arr => arr.sort(([a], [b]) => a - b);

export const part1 = input => {
  const xValues = input.map(([x]) => x);
  const yValues = input.map(([, y]) => y);
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);

  const points = new Set(input.map(point => point.join(',')));
  const distances = new Array(points.size).fill(0);
  const pointsToSkip = new Set();

  for (let x = minX; x <= maxX; x += 1) {
    for (let y = minY; y <= maxY; y += 1) {
      const nums = sortNums(input.map((point, index) => [getDistance(point, [x, y]), index]));
      if (nums[0][0] === nums[1][0]) {
        continue;
      }
      const numIndex = nums[0][1];
      if (x === minX || x === maxX || y === minY || y === maxY) {
        pointsToSkip.add(numIndex);
        distances[numIndex] = 0;
      } else if (!pointsToSkip.has(numIndex)) {
        distances[numIndex] += 1;
      }
    }
  }
  return Math.max(...distances);
};

export const part2 = input => {
  const result = part1(input);
  console.log(result);
  return null;
};
