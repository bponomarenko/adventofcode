const { withFormattedInput } = require('./part1');

const main = withFormattedInput(input => {
  console.log(input);
  return null;
});

module.exports = { main };
