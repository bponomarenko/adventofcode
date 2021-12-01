const { formatInput } = require('./part1');

const main = input => {
  // Get sum of 3 elements
  const sum = index => input[index] + input[index - 1] + input[index - 2];
  // Count icreasing sums
  return input.reduce((acc, num, index) => (index > 2 && sum(index) > sum(index - 1) ? acc + 1 : acc), 0);
};

module.exports = { main: input => main(formatInput(input)) };
