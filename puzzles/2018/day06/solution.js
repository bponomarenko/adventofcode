import { getDistance } from '../../utils/grid.js';

export const formatInput = input => input.toGrid('\n', ', ');

const sortNums = arr => arr.sort(([a], [b]) => a - b);
const getLimits = points => {
  const xValues = points.map(([x]) => x);
  const yValues = points.map(([, y]) => y);
  return [
    Math.min(...xValues),
    Math.max(...xValues),
    Math.min(...yValues),
    Math.max(...yValues),
  ];
};

export const part1 = input => {
  const [minX, maxX, minY, maxY] = getLimits(input);
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

export const part2 = (input, isTest) => {
  const limit = isTest ? 32 : 10000;
  const [minX, maxX, minY, maxY] = getLimits(input);
  let validLocations = 0;

  for (let x = minX; x <= maxX; x += 1) {
    for (let y = minY; y <= maxY; y += 1) {
      const distances = input.sum(point => getDistance(point, [x, y]));
      if (distances < limit) {
        validLocations += 1;
      }
    }
  }
  return validLocations;
};
