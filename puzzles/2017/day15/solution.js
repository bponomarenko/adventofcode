const formatInput = input => input.split('\n').reduce((acc, line) => {
  const [, generator, , , value] = line.split(' ');
  return { ...acc, [generator]: +value };
}, {});

const getGenValue = (value, factor) => (value * factor) % 2147483647;
const getGenAValue = value => getGenValue(value, 16807);
const getGenBValue = value => getGenValue(value, 48271);
const isEqualInLower16Bits = (a, b) => ((a & 65535) ^ (b & 65535)) === 0;

const part1 = input => {
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

const getGenValueWithDiv = (value, factor, diviser) => {
  let nextValue = value;
  do {
    nextValue = getGenValue(nextValue, factor);
    // Loop until we find correct value
  } while (nextValue % diviser !== 0);
  return nextValue;
};
const getGenAValue2 = value => getGenValueWithDiv(value, 16807, 4);
const getGenBValue2 = value => getGenValueWithDiv(value, 48271, 8);

const part2 = input => {
  const iterations = 5_000_000;
  let a = input.A;
  let b = input.B;
  let count = 0;

  // Naive brute force
  for (let i = 0; i < iterations; i += 1) {
    a = getGenAValue2(a);
    b = getGenBValue2(b);
    // ...but use bitwise operator for speed
    if (isEqualInLower16Bits(a, b)) {
      count += 1;
    }
  }
  return count;
};

module.exports = { part1, part2, formatInput };
