import { get2dSegmentsIntersection } from '../../utils/geometry.js';

export const formatInput = input => input.split('\n').map(line => line.toNumArray(','));

const getAreaSize = ([x1, y1], [x2, y2]) => (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1);

export const part1 = input => {
  let max = 0;
  for (let [a, b] of input.combinations(2)) {
    max = Math.max(max, getAreaSize(a, b));
  }
  return max;
};

const getRectLines = ([x1, y1], [x2, y2]) => [
  [[x1, y1], [x1, y2]],
  [[x1, y2], [x2, y2]],
  [[x2, y2], [x2, y1]],
  [[x2, y1], [x1, y1]],
];

export const part2 = input => {
  const lines = input.map((point, i) => [input.at(i - 1), point]);
  let max = 0;
  for (let [[x1, y1], [x2, y2]] of input.combinations(2)) {
    if (x1 === x2 || y1 === y2) {
      // points are on the same line and can't form a rect
      continue;
    }

    let hasIntersections = false;
    if (Math.abs(x1 - x2) > 1 && Math.abs(y1 - y2) > 1) {
      const xAsc = x2 > x1;
      const yAsc = y2 > y1;
      // Get "inside" reactangular
      const insideRectLines = getRectLines([xAsc ? x1 + 1 : x1 - 1, yAsc ? y1 + 1 : y1 - 1], [xAsc ? x2 - 1 : x2 + 1, yAsc ? y2 - 1 : y2 + 1]);
      // if there are any intersections with the "inside rect" - that means lines are definitely passign through, and not located on the edges 
      hasIntersections = lines.some(line => insideRectLines.some(rectLine => get2dSegmentsIntersection(rectLine, line)));
    }

    if (!hasIntersections) {
      max = Math.max(max, getAreaSize([x1, y1], [x2, y2]));
    }
  }
  return max;
};
