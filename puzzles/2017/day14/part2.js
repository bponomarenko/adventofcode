const { formatInput } = require('./part1');

const main = input => {
  console.log(input);
  return null;
};

module.exports = { main: input => main(formatInput(input)) };
