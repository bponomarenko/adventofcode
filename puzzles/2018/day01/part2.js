const { formatInput } = require('./part1');

const main = input => {
  const history = new Set();
  const lastIndex = input.length - 1;
  let frequency = 0;
  let offset = 0;

  while (!history.has(frequency)) {
    history.add(frequency);
    frequency += input[offset];
    // Make sure we start from the beginning of the list when we reach last item
    offset = offset === lastIndex ? 0 : offset + 1;
  }
  return frequency;
};

module.exports = { main: input => main(formatInput(input)) };
