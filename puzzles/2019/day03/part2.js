const { formatInput, getIntersections } = require('./part1');

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
    traveled += Math.abs(end[0] - start[0]) + Math.abs(end[1] - start[1]);
    i += 1;
  }
  return traveled + Math.abs(intersection[0] - line[i][0][0]) + Math.abs(intersection[1] - line[i][0][1]);
};

const getDistance = (line1, line2) => {
  const distances = getIntersections(line1, line2)
    .map(intersection => getLineDistance(line1, intersection) + getLineDistance(line2, intersection))
    .filter(Boolean);
  return Math.min(...distances);
};

const main = ({ line1, line2 }) => getDistance(line1, line2);

module.exports = { main: (input, isTest) => main(formatInput(input), isTest) };
