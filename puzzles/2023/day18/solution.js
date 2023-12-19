import { getRelativeCoord, getNormalisedDirection, changeDirection } from '../../utils/grid.js';

export const formatInput = input => input.toGrid('\n', ' ').map(([dir, count, color]) => [
  [getNormalisedDirection(dir), +count],
  [changeDirection('e', +color.at(-2) * 90), parseInt(color.slice(2, 7), 16)],
]);

/**
 * Implements Shoelace formula
 * There should be at least 3 points, of which first and last one should be the same (it should be a loop)
 * @param {Array} points List of points in the format of [[x1, y1], ...]
 * @see {https://en.wikipedia.org/wiki/Shoelace_formula}
 */
const getPolygonArea = points => {
  let areaSize = 0;
  for (let [[x1, y1], [x2, y2]] of points.slidingWindows(2)) {
    areaSize += (x1 * y2 - x2 * y1) / 2;
  }
  return areaSize;
};

const countInteriorPoints = (digPlan, useColor) => {
  let pos = [0, 0];
  let borderPoints = 0;
  const points = digPlan.map(([set1, set2]) => {
    const [dir, size] = useColor ? set2 : set1;
    pos = getRelativeCoord(...pos, dir, size);
    borderPoints += size;
    return pos;
  }).toSpliced(0, 0, pos);
  // This result is based on the Pick's formula (https://www.mathed.page/geometry-labs/pick)
  return getPolygonArea(points) + borderPoints / 2 + 1;
};

export const part1 = input => countInteriorPoints(input);

export const part2 = input => countInteriorPoints(input, true);
