const formatInput = input => input.split('\n').map(line => line.split(''));

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
        // eslint-disable-next-line no-continue
        continue;
      }

      if (seats[row][i] === 'L') {
        if (countAdjacentSeats(prevSeats, row, i) === 0) {
          // eslint-disable-next-line no-param-reassign
          seats[row][i] = '#';
          res = false;
        }
      } else if (seats[row][i] === '#') {
        if (countAdjacentSeats(prevSeats, row, i) >= 4) {
          // eslint-disable-next-line no-param-reassign
          seats[row][i] = 'L';
          res = false;
        }
      }
    }
  }
  return res;
};

const countOccupiedSeats = seats => seats.reduce((acc, row) => acc + row.reduce((acc2, seat) => acc2 + (seat === '#' ? 1 : 0), 0), 0);

const main = input => {
  while (!doRound(input)) {
    // Empty body as all the job is in the "doRound" function
  }
  return countOccupiedSeats(input);
};

module.exports = {
  main: input => main(formatInput(input)),
  mainFn: main,
  formatInput,
  countOccupiedSeats,
};
