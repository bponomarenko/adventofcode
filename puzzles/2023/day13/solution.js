import { sum } from '../../utils/collections.js';
import { rotate } from '../../utils/grid.js';

export const formatInput = input => input.split('\n\n').map(grid => grid.split('\n'));

const findReflectionY = (grid, withFix) => {
  let found = -1;
  let fixed = false;
  for (let y = 0, maxY = grid.length - 1; y < maxY && found === -1 && !fixed; y += 1) {
    let y1 = y;
    let y2 = y + 1;
    found = y;
    fixed = false;

    while (y1 >= 0 && y2 <= maxY) {
      if (grid[y1] !== grid[y2]) {
        if (withFix && !fixed) {
          // check if we can fix it
          const fixable = grid[y1].split('').filter((tile, i) => tile !== grid[y2][i]).length === 1;
          if (fixable) {
            // assume it is fixed, compare the rest of the rows
            fixed = true;
          } else {
            found = -1;
            break;
          }
        } else {
          found = -1;
          fixed = false;
          break;
        }
      }
      y1 -= 1;
      y2 += 1;
    }

    if (withFix && !fixed) {
      found = -1;
    }
  }
  return !withFix || fixed ? found + 1 : 0;
};

const countReflections = (input, withFix) => {
  const result = input.map((grid, i) => {
    const foundY = findReflectionY(grid, withFix, i);
    if (foundY > 0) {
      return 100 * foundY;
    }
    const rotatedGrid = rotate(grid.map(row => row.split(''))).map(row => row.join(''));
    return findReflectionY(rotatedGrid, withFix, i);
  });
  return sum(result);
};

export const part1 = input => countReflections(input);

export const part2 = input => countReflections(input, true);
