import { getAdjacent, getRelativeCoord, changeDirection } from '../../utils/grid.js';

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

const getSum = (field, { x, y }) => getAdjacent(x, y, [0, field[0].length - 1], [0, field.length - 1])
  .reduce((sum, [nx, ny]) => sum + field[ny][nx], 0);

const getLeftPos = ({ x, y, dir }) => getRelativeCoord(x, y, changeDirection(dir, -90));

const getNextDir = dir => {
  const index = directions.indexOf(dir);
  // Find index of the next direction
  const nextIndex = index === directions.length - 1 ? 0 : index + 1;
  return directions[nextIndex];
};

const getNextPos = (field, pos) => {
  const [nX, nY] = getRelativeCoord(pos.x, pos.y, pos.dir);
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
  const field = Array.from(new Array(sideSize), () => new Array(sideSize).fill(0));
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
