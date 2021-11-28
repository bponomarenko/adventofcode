const formatInput = input => input.split('\n').reduce((acc, line) => {
  const [, generator, , , value] = line.split(' ');
  return { ...acc, [generator]: +value };
}, {});

const getGenValue = (value, factor) => (value * factor) % 2147483647;
const getGenAValue = value => getGenValue(value, 16807);
const getGenBValue = value => getGenValue(value, 48271);
const isEqualInLower16Bits = (a, b) => ((a & 65535) ^ (b & 65535)) === 0;

const main = input => {
  const iterations = 40_000_000;
  let a = input.A;
  let b = input.B;
  let count = 0;

  // Naive brute force
  for (let i = 0; i < iterations; i += 1) {
    a = getGenAValue(a);
    b = getGenBValue(b);
    // ...but use bitwise operator for speed
    if (isEqualInLower16Bits(a, b)) {
      count += 1;
    }
  }
  return count;
};

module.exports = {
  main: input => main(formatInput(input)),
  formatInput,
  isEqualInLower16Bits,
  getGenValue,
};
