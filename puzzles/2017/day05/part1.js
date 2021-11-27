const formatInput = input => input.split('\n').map(value => +value);

const main = input => {
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

module.exports = { main: input => main(formatInput(input)), formatInput };
