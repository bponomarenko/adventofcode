const formatInput = input => input.split('\n').map(value => +value);

const part1 = input => {
  const interrupt = Array.from(input);
  const size = interrupt.length;
  let offset = 0;
  let jumpsCount = 0;

  // Do jumps until we go out of commands input
  while (offset >= 0 && offset < size) {
    const prevOffset = offset;
    offset += interrupt[offset];
    interrupt[prevOffset] += 1;
    jumpsCount += 1;
  }
  return jumpsCount;
};

const part2 = input => {
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

module.exports = { part1, part2, formatInput };
