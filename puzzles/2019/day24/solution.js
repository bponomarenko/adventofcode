import { getStraightAdjacent } from '../../utils/grid.js';
import { sum } from '../../utils/collections.js';

export const formatInput = input => input.split('\n').map(row => row.split(''));

const size = 5;
const limit = [0, size - 1];

export const part1 = input => {
  const history = new Set();
  for (; ;) {
    const hash = input.join('');
    if (history.has(hash)) {
      break;
    }
    history.add(hash);

    input = input.map((row, y) => row.map((value, x) => {
      const bugs = getStraightAdjacent(x, y, limit, limit).filter(([dx, dy]) => input[dy][dx] === '#').length;
      return bugs === 1 || (value === '.' && bugs === 2) ? '#' : '.';
    }));
  }
  return sum(input.flat().map((value, i) => (2 ** i) * (value === '#' ? 1 : 0)));
};

const getEmptyGrid = () => new Array(size).fill(0).map(() => new Array(size).fill('.'));

const getAdjacent = (grids, g, x, y) => {
  let first = [[g, x - 1, y]];
  if (x === 0) {
    first = g === 0 ? null : [[g - 1, 1, 2]];
  } else if (x === 3 && y === 2) {
    first = grids[g + 1]?.map((_, dy) => [g + 1, limit[1], dy]);
  }

  let second = [[g, x + 1, y]];
  if (x === limit[1]) {
    second = g === 0 ? null : [[g - 1, 3, 2]];
  } else if (x === 1 && y === 2) {
    second = grids[g + 1]?.map((_, dy) => [g + 1, 0, dy]);
  }

  let third = [[g, x, y - 1]];
  if (y === 0) {
    third = g === 0 ? null : [[g - 1, 2, 1]];
  } else if (x === 2 && y === 3) {
    third = grids[g + 1]?.[0].map((_, dx) => [g + 1, dx, limit[1]]);
  }

  let fourth = [[g, x, y + 1]];
  if (y === limit[1]) {
    fourth = g === 0 ? null : [[g - 1, 2, 3]];
  } else if (x === 2 && y === 1) {
    fourth = grids[g + 1]?.[0].map((_, dx) => [g + 1, dx, 0]);
  }

  return [
    ...(first ?? []),
    ...(second ?? []),
    ...(third ?? []),
    ...(fourth ?? []),
  ];
};

export const part2 = (input, isTest) => {
  const time = isTest ? 10 : 200;
  let grids = [getEmptyGrid(), input, getEmptyGrid()];

  for (let i = 0; i < time; i += 1) {
    const newGrids = [];
    let addFirst = false;
    let addLast = false;

    for (let g = 0, l = grids.length; g < l; g += 1) {
      const grid = grids[g].map((row, y) => row.map((value, x) => {
        if (x === (size - 1) / 2 && y === (size - 1) / 2) {
          return '.';
        }
        const bugs = getAdjacent(grids, g, x, y).filter(([dg, dx, dy]) => grids[dg][dy][dx] === '#').length;
        let newValue = bugs === 1 || (value === '.' && bugs === 2) ? '#' : '.';
        if (newValue === '#') {
          addFirst = addFirst || (g === 0);
          addLast = addLast || (g === l - 1);
        }
        return newValue;
      }));
      newGrids.push(grid);
    }

    grids = [
      ...(addFirst ? [getEmptyGrid()] : []),
      ...newGrids,
      ...(addLast ? [getEmptyGrid()] : []),
    ];
  }
  return sum(grids.flatMap(grid => grid.flat()).map(value => (value === '#' ? 1 : 0)));
};
