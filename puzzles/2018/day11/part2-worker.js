import { getSquareSum } from './utils.js';

export default (send, { grid, size }) => {
  let coords = [-Infinity];
  for (let y = 0; y < 300 - size + 1; y += 1) {
    for (let x = 0; x < 300 - size + 1; x += 1) {
      const squareSum = getSquareSum(grid, x, y, size);
      if (squareSum > coords[0]) {
        coords = [squareSum, x + 1, y + 1, size];
      }
    }
  }
  send(coords);
};
