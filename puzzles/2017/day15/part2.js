const { formatInput, isEqualInLower16Bits, getGenValue } = require('./part1');

const getGenValueWithDiv = (value, factor, diviser) => {
  let nextValue = value;
  do {
    nextValue = getGenValue(nextValue, factor);
    // Loop until we find correct value
  } while (nextValue % diviser !== 0);
  return nextValue;
};
const getGenAValue = value => getGenValueWithDiv(value, 16807, 4);
const getGenBValue = value => getGenValueWithDiv(value, 48271, 8);

const main = input => {
  const iterations = 5_000_000;
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

module.exports = { main: input => main(formatInput(input)) };
