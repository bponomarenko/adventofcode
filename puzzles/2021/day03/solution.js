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

const filterReport = (report, bit, inverse = false) => {
  const counts = report
    .reduce(([ones, zeros], num) => (num[bit] === '1' ? [ones + 1, zeros] : [ones, zeros + 1]), [0, 0]);
  const filterBit = String(counts[0] >= counts[1] ? 1 ^ inverse : 0 ^ inverse);
  return report.filter(num => num[bit] === filterBit);
};

const part2 = input => {
  let oxygenReport = input;
  let co2Report = input;
  let bit = 0;
  let oxygenRating;
  let co2Rating;

  do {
    if (!oxygenRating) {
      oxygenReport = filterReport(oxygenReport, bit);
      if (oxygenReport.length === 1) {
        [oxygenRating] = oxygenReport;
      }
    }

    if (!co2Rating) {
      co2Report = filterReport(co2Report, bit, true);
      if (co2Report.length === 1) {
        [co2Rating] = co2Report;
      }
    }

    bit += 1;
  } while (!oxygenRating || !co2Rating);

  return parseInt(oxygenRating, 2) * parseInt(co2Rating, 2);
};

module.exports = { part1, part2, formatInput };
