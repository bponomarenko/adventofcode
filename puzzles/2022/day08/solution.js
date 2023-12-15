export const formatInput = input => input.split('\n');

// "look" from a tree in one of the directions
// will return array with two values:
// 1. true or false if the view was visible or blocked by another tree
// 2. amount of the trees till the view is blocked or the edge
const checkDirection = (trees, tx, ty, inc) => {
  const tree = trees[ty][tx];
  let value = tree;
  let count = 0;
  let x = tx;
  let y = ty;

  while (value !== undefined) {
    [x, y] = inc(x, y);
    value = trees[y]?.[x];
    if (value !== undefined) {
      count += 1;
      if (value >= tree) {
        return [false, count];
      }
    }
  }
  return [true, count];
};

const directions = [
  (x, y) => [x + 1, y], // right
  (x, y) => [x - 1, y], // left
  (x, y) => [x, y + 1], // up
  (x, y) => [x, y - 1], // down
];

export const part1 = input => {
  const my = input.length;
  let counter = 0;

  input.forEach((row, y) => {
    const mx = row.length;
    if (y === 0 || y === my - 1) {
      // entire row is the edge – add all the trees
      counter += mx;
    } else {
      // add the edge trees
      counter += 2;

      for (let x = 1; x < mx - 1; x += 1) {
        const isVisible = directions.some(inc => checkDirection(input, x, y, inc)[0]);
        counter += isVisible ? 1 : 0;
      }
    }
  });
  return counter;
};

export const part2 = input => {
  let totalScore = 0;
  input.forEach((row, y) => {
    for (let x = 0, mx = row.length; x < mx; x += 1) {
      const score = directions.power(inc => checkDirection(input, x, y, inc)[1]);
      totalScore = Math.max(totalScore, score);
    }
  });
  return totalScore;
};
