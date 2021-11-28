const { withFormattedInput, getSquareSize } = require('./part1');

const directions = ['e', 'n', 'w', 's'];

const getSum = (field, { x, y }) => field[y - 1][x - 1]
  + field[y - 1][x]
  + field[y - 1][x + 1]
  + field[y][x - 1]
  + field[y][x + 1]
  + field[y + 1][x - 1]
  + field[y + 1][x]
  + field[y + 1][x + 1];

const getNextCoordinates = ({ x, y, dir }) => {
  switch (dir) {
    case 'e':
      return [x + 1, y];
    case 'w':
      return [x - 1, y];
    case 'n':
      return [x, y - 1];
    case 's':
      return [x, y + 1];
    default:
      throw new Error(`Not expected direction: ${dir}`);
  }
};

const getLeftPos = ({ x, y, dir }) => {
  switch (dir) {
    case 'e':
      return [x, y - 1];
    case 'w':
      return [x, y + 1];
    case 'n':
      return [x - 1, y];
    case 's':
      return [x + 1, y];
    default:
      throw new Error(`Not expected direction: ${dir}`);
  }
};

const getNextDir = dir => {
  const index = directions.indexOf(dir);
  // Find index of the next direction
  const nextIndex = index === directions.length - 1 ? 0 : index + 1;
  return directions[nextIndex];
};

const getNextPos = (field, pos) => {
  const [nX, nY] = getNextCoordinates(pos);
  const nextPos = { x: nX, y: nY, dir: pos.dir };
  const [leftX, leftY] = getLeftPos(nextPos);
  // Check if we need to change the direction (to turn left)
  if (!field[leftY][leftX]) {
    nextPos.dir = getNextDir(nextPos.dir);
  }
  return nextPos;
};

const main = withFormattedInput(input => {
  const sideSize = getSquareSize(input);
  // Create two-dimensional array
  const field = new Array(sideSize).fill(0).map(() => new Array(sideSize).fill(0));
  const center = Math.floor(sideSize / 2);

  // Set starting point in the center of the field
  let pos = { x: center, y: center, dir: 'e' };
  let sum = getSum(field, pos);

  // Set initial value
  field[pos.y][pos.x] = 1;

  // Fill the field
  while (sum < input) {
    pos = getNextPos(field, pos);
    sum = getSum(field, pos);
    field[pos.y][pos.x] = sum;
  }

  return sum;
});

module.exports = { main };
