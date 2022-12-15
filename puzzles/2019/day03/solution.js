import { getDistance as getManhattanDistance } from '../../utils/grid.js';

const lineToVectors = line => {
  let start = [0, 0];
  return line.split(',').map(instr => {
    const delta = +instr.slice(1);
    let vector;
    switch (instr[0]) {
      case 'R':
        vector = [start, [start[0] + delta, start[1]], 'h'];
        break;
      case 'L':
        vector = [start, [start[0] - delta, start[1]], 'h'];
        break;
      case 'U':
        vector = [start, [start[0], start[1] + delta], 'v'];
        break;
      case 'D':
        vector = [start, [start[0], start[1] - delta], 'v'];
        break;
      default:
        break;
    }
    [, start] = vector;
    return vector;
  });
};

export const formatInput = input => {
  const [line1, line2] = input.split('\n');
  return { line1: lineToVectors(line1), line2: lineToVectors(line2) };
};

const getIntersections = (line1, line2) => {
  const res = [];
  line1.forEach(vec1 => line2.forEach(vec2 => {
    // if perpendicular
    if (vec1[2] !== vec2[2]) {
      const [ver, hor] = vec1[2] === 'v' ? [vec1, vec2] : [vec2, vec1];
      // if intersect
      if (ver[0][0] >= Math.min(hor[0][0], hor[1][0])
        && ver[0][0] <= Math.max(hor[0][0], hor[1][0])
        && hor[0][1] >= Math.min(ver[0][1], ver[1][1])
        && hor[0][1] <= Math.max(ver[0][1], ver[1][1])
      ) {
        res.push([ver[0][0], hor[0][1]]);
      }
    }
  }));
  return res;
};

const getDistance = (line1, line2) => {
  const distances = getIntersections(line1, line2)
    .map(([x, y]) => Math.abs(x) + Math.abs(y))
    .filter(Boolean);
  return Math.min(...distances);
};

export const part1 = ({ line1, line2 }) => getDistance(line1, line2);

const getLineDistance = (line, intersection) => {
  let traveled = 0;
  let i = 0;
  while (
    Math.min(line[i][0][0], line[i][1][0]) > intersection[0]
    || Math.max(line[i][0][0], line[i][1][0]) < intersection[0]
    || Math.min(line[i][0][1], line[i][1][1]) > intersection[1]
    || Math.max(line[i][0][1], line[i][1][1]) < intersection[1]
  ) {
    const [start, end] = line[i];
    traveled += getManhattanDistance(start, end);
    i += 1;
  }
  return traveled + getManhattanDistance(intersection, line[i][0]);
};

const getDistance2 = (line1, line2) => {
  const distances = getIntersections(line1, line2)
    .map(intersection => getLineDistance(line1, intersection) + getLineDistance(line2, intersection))
    .filter(Boolean);
  return Math.min(...distances);
};

export const part2 = ({ line1, line2 }) => getDistance2(line1, line2);
