export const formatInput = input => input.split('\n').map(line => line.split(''));

const countAdjacentSeats = (seats, row, i) => (
  (seats[row - 1]?.[i - 1] === '#' ? 1 : 0)
  + (seats[row - 1]?.[i] === '#' ? 1 : 0)
  + (seats[row - 1]?.[i + 1] === '#' ? 1 : 0)
  + (seats[row][i - 1] === '#' ? 1 : 0)
  + (seats[row][i + 1] === '#' ? 1 : 0)
  + (seats[row + 1]?.[i - 1] === '#' ? 1 : 0)
  + (seats[row + 1]?.[i] === '#' ? 1 : 0)
  + (seats[row + 1]?.[i + 1] === '#' ? 1 : 0)
);

const doRound = seats => {
  const prevSeats = seats.map(row => [...row]);
  let res = true;

  for (let row = 0; row < seats.length; row += 1) {
    for (let i = 0; i < seats[row].length; i += 1) {
      if (seats[row][i] === '.') {
        continue;
      }

      if (seats[row][i] === 'L') {
        if (countAdjacentSeats(prevSeats, row, i) === 0) {
          seats[row][i] = '#';
          res = false;
        }
      } else if (seats[row][i] === '#') {
        if (countAdjacentSeats(prevSeats, row, i) >= 4) {
          seats[row][i] = 'L';
          res = false;
        }
      }
    }
  }
  return res;
};

const countOccupiedSeats = seats => seats.reduce((acc, row) => acc + row.reduce((acc2, seat) => acc2 + (seat === '#' ? 1 : 0), 0), 0);

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

const countVisibleSeats = (seats, row, i) => (
  lookupDirection(seats, row, i, (r, s) => [r - 1, s])
  + lookupDirection(seats, row, i, (r, s) => [r - 1, s + 1])
  + lookupDirection(seats, row, i, (r, s) => [r, s + 1])
  + lookupDirection(seats, row, i, (r, s) => [r + 1, s + 1])
  + lookupDirection(seats, row, i, (r, s) => [r + 1, s])
  + lookupDirection(seats, row, i, (r, s) => [r + 1, s - 1])
  + lookupDirection(seats, row, i, (r, s) => [r, s - 1])
  + lookupDirection(seats, row, i, (r, s) => [r - 1, s - 1])
);

const doRound2 = seats => {
  const prevSeats = seats.map(row => [...row]);
  let res = true;

  for (let row = 0; row < seats.length; row += 1) {
    for (let i = 0; i < seats[row].length; i += 1) {
      if (seats[row][i] === '.') {
        continue;
      }

      if (seats[row][i] === 'L') {
        if (countVisibleSeats(prevSeats, row, i) === 0) {
          seats[row][i] = '#';
          res = false;
        }
      } else if (seats[row][i] === '#') {
        if (countVisibleSeats(prevSeats, row, i) >= 5) {
          seats[row][i] = 'L';
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
