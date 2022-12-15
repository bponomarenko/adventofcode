import { getDistance } from '../../utils/grid.js';

const lineRe = /^Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)$/;

export const formatInput = input => input.split('\n').map(line => {
  const [, sx, sy, bx, by] = line.match(lineRe);
  const sensor = [+sx, +sy];
  const beacon = [+bx, +by];
  return { sensor, beacon, distance: getDistance(sensor, beacon) };
});

const countKnownPositions = (input, y, lx, rx) => {
  const knownPos = new Set();
  input.forEach(({ sensor, distance }) => {
    const dx = distance - Math.abs(sensor[1] - y);
    if (dx >= 0) {
      for (let x = Math.max(lx, sensor[0] - dx), mx = Math.min(sensor[0] + dx, rx); x <= mx; x += 1) {
        knownPos.add(x);
      }
    }
  });
  return knownPos.size - 1;
};

export const part1 = input => {
  const maxD = Math.max(...input.map(({ distance }) => distance));
  const xRange = input.flatMap(({ sensor, beacon }) => [sensor[0], beacon[0]]);
  const lx = Math.min(...xRange) - maxD;
  const rx = Math.max(...xRange) + maxD;
  const y = 2000000;
  return countKnownPositions(input, y, lx, rx);
};

const isEmptySpot = (input, [x, y], xRange, yRange) => {
  if (x < xRange[0] || x > xRange[1] || y < yRange[0] || y > yRange[1]) {
    return false;
  }
  return input.every(({ sensor, distance }) => distance < getDistance([x, y], sensor));
};

const findEmptySpot = (input, xRange, yRange) => {
  for (let i = 0; i < input.length; i += 1) {
    const { sensor: [x, y], distance } = input[i];
    // Check sensor outer positions and see if they are visin other sensors range
    // If not – that's the one
    for (let j = 0; j <= distance; j += 1) {
      const emptySpot = [
        [x + j + 1, y - distance + j],
        [x + j + 1, y + distance - j],
        [x - j - 1, y - distance + j],
        [x - j - 1, y + distance - j],
      ].find(point => isEmptySpot(input, point, xRange, yRange));
      if (emptySpot) {
        return emptySpot;
      }
    }
  }
  return [0, 0];
};

export const part2 = input => {
  const max = 4000000;
  const [x, y] = findEmptySpot(input, [0, max], [0, max]);
  return x * max + y;
};
