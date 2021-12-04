const formatInput = input => input.split('\n');

const part1 = input => {
  const numLength = input[0].length;

  // 1. Calculate bits frequency
  const counts = input.reduce((acc, line) => {
    const num = parseInt(line, 2);
    for (let i = 0; i < numLength; i += 1) {
      // Count only high bits (1)
      acc[i] += (num >> i) & 1;
    }
    return acc;
  }, new Array(numLength).fill(0));

  const inputHalfLen = input.length / 2;
  // 2. Get gamma code
  const gamma = counts.reduce((acc, count, index) => (count >= inputHalfLen ? acc + 2 ** index : acc), 0);
  const xorMask = 2 ** numLength - 1;
  // 3. Get epsilon just by inverting gamma code
  const epsilon = gamma ^ xorMask;

  return gamma * epsilon;
};

const findRating = (report, bit, inverse = false) => {
  const countHighBits = report.reduce((acc, num) => (num[bit] === '1' ? acc + 1 : acc), 0);
  // Find bit value to filter by
  const filterBit = String((countHighBits >= report.length / 2 ? 1 : 0) ^ inverse);
  // Get only numbers that match the bit
  const filteredReport = report.filter(num => num[bit] === filterBit);

  if (filteredReport.length === 1) {
    // Found it
    return filteredReport[0];
  }
  // Keep looking
  return findRating(filteredReport, bit + 1, inverse);
};

const part2 = input => {
  const oxygenRating = findRating(input, 0);
  const co2Rating = findRating(input, 0, true);

  return parseInt(oxygenRating, 2) * parseInt(co2Rating, 2);
};

module.exports = { part1, part2, formatInput };
