const formatInput = input => input.split('\n').map(num => +num);

const getFuel = mass => Math.max(Math.floor(mass / 3) - 2, 0);

const main = input => input.reduce((acc, n) => acc + getFuel(n), 0);

module.exports = {
  main: input => main(formatInput(input)),
  formatInput,
};
