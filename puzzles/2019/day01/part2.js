const { formatInput } = require('./part1');

const getFuel = mass => {
  const res = Math.max(Math.floor(mass / 3) - 2, 0);
  return res > 0 ? res + getFuel(res) : 0;
};

const main = input => input.reduce((acc, n) => acc + getFuel(n), 0);

module.exports = { main: input => main(formatInput(input)) };
