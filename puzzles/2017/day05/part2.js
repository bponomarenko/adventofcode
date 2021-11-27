const { formatInput } = require('./part1');

const main = input => {
  const interrupt = Array.from(input);
  const size = interrupt.length;
  let offset = 0;
  let jumpsCount = 0;

  while (offset >= 0 && offset < size) {
    const prevOffset = offset;
    offset += interrupt[offset];
    // The same as in part1, but with an extra condition
    interrupt[prevOffset] += interrupt[prevOffset] >= 3 ? -1 : 1;
    jumpsCount += 1;
  }
  return jumpsCount;
};

module.exports = { main: input => main(formatInput(input)) };
