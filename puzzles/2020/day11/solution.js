import { getAdjacent, getRelativeCoord } from '../../utils/grid.js';

export const formatInput = input => input.toGrid();

const countAdjacentSeats = (seats, x, y, limits) => getAdjacent(x, y, ...limits).sum(([dx, dy]) => +(seats[dy][dx] === '#'));

const doRound = seats => {
  const prevSeats = Array.from(seats, row => Array.from(row));
  const limits = [[0, seats[0].length - 1], [0, seats.length - 1]];
  let res = true;

  for (let y = 0; y <= limits[1][1]; y += 1) {
    for (let x = 0; x <= limits[0][1]; x += 1) {
      const seat = seats[y][x];
      if (seat === '.') {
        continue;
      }

      if (seat === 'L') {
        if (countAdjacentSeats(prevSeats, x, y, limits) === 0) {
          seats[y][x] = '#';
          res = false;
        }
      } else if (seat === '#') {
        if (countAdjacentSeats(prevSeats, x, y, limits) >= 4) {
          seats[y][x] = 'L';
          res = false;
        }
      }
    }
  }
  return res;
};

const countOccupiedSeats = seats => seats.sum(row => row.sum(seat => +(seat === '#')));

export const part1 = input => {
  while (!doRound(input)) {
    // Empty body as all the job is in the "doRound" function
  }
  return countOccupiedSeats(input);
};

const lookupDirection = (seats, row, i, getNextPos) => {
  let nextPos = [row, i];
  do {
    nextPos = getNextPos(...nextPos);
    const seat = seats[nextPos[0]]?.[nextPos[1]];
    if (!seat || seat === 'L') {
      return 0;
    }
    if (seat === '#') {
      return 1;
    }
  // eslint-disable-next-line no-constant-condition
  } while (true);
};

const adjacentDirections = ['w', 'e', 'n', 's', 'nw', 'ne', 'sw', 'se'];
const countVisibleSeats = (seats, x, y) => adjacentDirections
  .sum(dir => lookupDirection(seats, y, x, (r, s) => getRelativeCoord(r, s, dir)));

const doRound2 = seats => {
  const prevSeats = Array.from(seats, row => Array.from(row));
  let res = true;

  for (let y = 0, maxY = seats.length; y < maxY; y += 1) {
    for (let x = 0, maxX = seats[0].length; x < maxX; x += 1) {
      const seat = seats[y][x];
      if (seat === '.') {
        continue;
      }

      if (seat === 'L') {
        if (countVisibleSeats(prevSeats, x, y) === 0) {
          seats[y][x] = '#';
          res = false;
        }
      } else if (seat === '#') {
        if (countVisibleSeats(prevSeats, x, y) >= 5) {
          seats[y][x] = 'L';
          res = false;
        }
      }
    }
  }
  return res;
};

export const part2 = input => {
  while (!doRound2(input)) {
    // Empty body as all the job is in the "doRound" function
  }
  return countOccupiedSeats(input);
};
