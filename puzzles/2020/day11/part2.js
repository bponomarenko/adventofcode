const { formatInput, countOccupiedSeats } = require('./part1');

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

const doRound = seats => {
  const prevSeats = seats.map(row => [...row]);
  let res = true;

  for (let row = 0; row < seats.length; row += 1) {
    for (let i = 0; i < seats[row].length; i += 1) {
      if (seats[row][i] === '.') {
        // eslint-disable-next-line no-continue
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

const main = input => {
  while (!doRound(input)) {
    // Empty body as all the job is in the "doRound" function
  }
  return countOccupiedSeats(input);
};

module.exports = { main: input => main(formatInput(input)) };
