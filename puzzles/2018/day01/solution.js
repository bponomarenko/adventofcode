const formatInput = input => input.split(/,\s|\n/).map(Number);

// Can it be even simpler?
const part1 = input => input.reduce((acc, num) => acc + num, 0);

const part2 = input => {
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

module.exports = { part1, part2, formatInput };
