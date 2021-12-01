const formatInput = input => input.split('\n').map(num => +num);

// Count icreasing elements
const main = input => input.reduce((acc, num, index) => ((index > 0 && num > input[index - 1]) ? acc + 1 : acc), 0);

module.exports = {
  main: input => main(formatInput(input)),
  formatInput,
};
