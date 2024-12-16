import { getDistance } from '../../utils/grid.js';

export const formatInput = input => input.split('\n').map(line => line.split(' ').map(p => p.slice(2).split(',').map(Number)));

const getSize = robots => [
  Math.max(...robots.map(([p]) => p[0])) + 1,
  Math.max(...robots.map(([p]) => p[1])) + 1,
];

const simulate = (robots, width, height, seconds = 100) => robots.map(([[x, y], [dx, dy]]) => {
  const nx = (x + dx * seconds) % width;
  const ny = (y + dy * seconds) % height;
  return [nx < 0 ? width + nx : nx, ny < 0 ? height + ny : ny];
});

const getSafetyFactor = (robots, width, height) => {
  const positions = simulate(robots, width, height);
  const quadrants = [0, 0, 0, 0];
  const mw = (width - 1) / 2;
  const mh = (height - 1) / 2;
  positions.forEach(p => {
    if (p[0] < mw) {
      if (p[1] < mh) {
        quadrants[0] += 1;
      } else if (p[1] > mh) {
        quadrants[1] += 1;
      }
    } else if (p[0] > mw) {
      if (p[1] < mh) {
        quadrants[2] += 1;
      } else if (p[1] > mh) {
        quadrants[3] += 1;
      }
    }
  });
  return quadrants.mul();
};

export const part1 = input => getSafetyFactor(input, ...getSize(input));

const getAverageSpread = (robots, size, count) => Array
  .from(simulate(robots, ...size, count).slidingWindows(2))
  .avg(([p1, p2]) => getDistance(p1, p2));

export const part2 = async input => {
  const size = getSize(input);
  const ref = getAverageSpread(input, size, 1);
  let best = [0];
  let count = 2;
  while (count < 10000) {
    const diff = Math.abs(getAverageSpread(input, size, count) / ref - 1);
    // Find the biggest outlier
    if (diff > best[0]) {
      best = [diff, count];
    }
    count += 1;
  }
  return best[1];
};
