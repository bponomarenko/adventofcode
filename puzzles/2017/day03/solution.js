import { getAdjacent } from '../../utils/grid.js';

export const formatInput = input => +input;

const getSquareSize = input => {
  // Get size of the grid square
  const sideSize = Math.ceil(Math.sqrt(input));
  // Make sure it is odd number
  return sideSize % 2 === 1 ? sideSize : sideSize + 1;
};

export const part1 = input => {
  const sideSize = getSquareSize(input);
  // Calculate amount of steps from the center to the outer side
  const distance = (sideSize - 1) / 2;

  let start = (sideSize - 2) ** 2;
  while (start + sideSize - 1 < input) {
    start += sideSize - 1;
  }
  // Calculate amount of steps from the center of the outer side to the number from input
  const travel = Math.abs(start + ((sideSize - 1) / 2) - input);
  // Return total amount of steps
  return distance + travel;
};

const directions = ['e', 'n', 'w', 's'];

const getSum = (field, { x, y }) => getAdjacent(y, x, [0, field[0].length - 1], [0, field.length - 1])
  .reduce((sum, [nx, ny]) => sum + field[ny][nx], 0);

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

export const part2 = input => {
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
};
