import { getDistance } from '../../utils/grid.js';

const lineRe = /^Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)$/;

export const formatInput = input => input.split('\n').map(line => {
  const [, sx, sy, bx, by] = line.match(lineRe);
  const sensor = [+sx, +sy];
  const beacon = [+bx, +by];
  return { sensor, beacon, distance: getDistance(sensor, beacon) };
});

export const part1 = input => {
  const y = 2000000;
  // Only use sensors that affect specified line
  const inputSlice = input
    .map(row => ({ ...row, dy: row.distance - Math.abs(y - row.sensor[1]) }))
    .filter(({ dy }) => dy >= 0);

  const ranges = [];
  inputSlice.forEach(({ sensor, dy }) => {
    // range is a line on the sensor's "visibility area" by a specified y value
    let range = [sensor[0] - dy, sensor[0] + dy];
    let overlapIndex;
    do {
      // Merge overlapping ranges
      overlapIndex = ranges.findIndex(([x1, x2]) => !(range[1] < x1 || range[0] > x2));
      if (overlapIndex >= 0) {
        const overlap = ranges.splice(overlapIndex, 1)[0];
        range = [Math.min(overlap[0], range[0]), Math.max(overlap[1], range[1])];
      }
    } while (overlapIndex >= 0);
    ranges.push(range);
  });
  // For the result just add values in the ranges
  return ranges.sum(([x1, x2]) => x2 - x1);
};

const isEmptySpot = (input, [x, y], maxRange) => {
  if (x < 0 || x > maxRange || y < 0 || y > maxRange) {
    return false;
  }
  return input.every(({ sensor, distance }) => distance < getDistance([x, y], sensor));
};

export const part2 = input => {
  const max = 4000000;

  for (let i = 0; i < input.length; i += 1) {
    const { sensor: [x, y], distance } = input[i];
    // Check sensor outer positions and see if they are vithin range of other sensors
    // If not – that's the one
    for (let j = 0; j <= distance; j += 1) {
      const hiddenSensor = [
        [x + j + 1, y - distance + j],
        [x + j + 1, y + distance - j],
        [x - j - 1, y - distance + j],
        [x - j - 1, y + distance - j],
      ].find(point => isEmptySpot(input, point, max));

      if (hiddenSensor) {
        return hiddenSensor[0] * max + hiddenSensor[1];
      }
    }
  }
  return 0;
};
